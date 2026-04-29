from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, EmailStr
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from database import users_collection
import os
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from fastapi.responses import RedirectResponse
import secrets

load_dotenv()

router = APIRouter()

JWT_SECRET = os.getenv("JWT_SECRET")
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
SENDGRID_FROM_EMAIL = os.getenv("SENDGRID_FROM_EMAIL")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:8080")

# ✅ Pending users memory mein
pending_users: dict = {}


class SignupModel(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginModel(BaseModel):
    email: EmailStr
    password: str


def create_token(email: str, user_id: str):
    expire = datetime.utcnow() + timedelta(days=7)
    return jwt.encode(
        {"email": email, "userId": user_id, "exp": expire},
        JWT_SECRET,
        algorithm="HS256"
    )


def _send_verification_email(to_email: str, token: str):
    print(f"⭐ Sending verification to {to_email}")
    verify_link = f"{BACKEND_URL}/auth/verify?token={token}"
    message = Mail(
        from_email=SENDGRID_FROM_EMAIL,
        to_emails=to_email,
        subject="Verify your The DSA Manual account",
        html_content=f"""
        <h2>Welcome to The DSA Manual!</h2>
        <p>Click the link below to verify your account:</p>
        <a href="{verify_link}" style="background:#6366f1;color:white;padding:10px 20px;
        border-radius:8px;text-decoration:none;">
            Verify Email
        </a>
        <p>Link expires in 24 hours.</p>
        """
    )
    sg = SendGridAPIClient(SENDGRID_API_KEY)
    sg.send(message)


def _send_admin_notification(user_name: str, user_email: str):
    try:
        print(f"⭐ Sending admin notification for {user_name}")
        message = Mail(
            from_email=SENDGRID_FROM_EMAIL,
            to_emails=ADMIN_EMAIL,
            subject=f"New Signup: {user_name}",  # ✅ emoji hataya
            html_content=f"""
            <h2>New user signed up on DSA Manual!</h2>
            <p><b>Name:</b> {user_name}</p>
            <p><b>Email:</b> {user_email}</p>
            <p><b>Time:</b> {datetime.utcnow().strftime("%d %b %Y, %I:%M %p")} UTC</p>
            """
        )
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"✅ Admin notified: {response.status_code}")
    except Exception as e:
        print(f"❌ Admin notification failed: {e}")
        import traceback
        traceback.print_exc()


@router.post("/signup")
async def signup(user: SignupModel, background_tasks: BackgroundTasks):
    # ✅ DB mein check karo
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered!")

    # ✅ Pending mein bhi check karo
    for token, data in pending_users.items():
        if data["email"] == user.email:
            raise HTTPException(status_code=400, detail="Email already registered!")

    hashed_password = bcrypt.hashpw(
        user.password.encode("utf-8"), bcrypt.gensalt(rounds=10)
    ).decode("utf-8")

    verify_token = secrets.token_urlsafe(32)
    verify_token_expiry = datetime.utcnow() + timedelta(hours=24)

    # ✅ DB mein mat daalo — memory mein rakho
    pending_users[verify_token] = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.utcnow(),
        "verify_token_expiry": verify_token_expiry
    }

    background_tasks.add_task(
        _send_verification_email, user.email, verify_token
    )
    background_tasks.add_task(
        _send_admin_notification, user.name, user.email
    )

    return {"message": "Signup successful! Please check your email to verify your account."}


@router.get("/verify")
async def verify_email(token: str):
    # ✅ Pending mein dhundo
    user_data = pending_users.get(token)
    if not user_data:
        raise HTTPException(status_code=400, detail="Invalid or expired token!")

    # ✅ Expiry check
    if datetime.utcnow() > user_data["verify_token_expiry"]:
        pending_users.pop(token, None)
        raise HTTPException(status_code=400, detail="Verification link has expired!")

    # ✅ Verify hone ke baad DB mein store karo
    await users_collection.insert_one({
        "name": user_data["name"],
        "email": user_data["email"],
        "password": user_data["password"],
        "created_at": user_data["created_at"],
        "is_verified": True,
    })

    # ✅ Pending se hatao
    pending_users.pop(token, None)

    return RedirectResponse(url=f"{FRONTEND_URL}/login?verified=true")


@router.post("/login")
async def login(user: LoginModel):
    existing = await users_collection.find_one({"email": user.email})
    if not existing:
        raise HTTPException(status_code=404, detail="User not found!")

    if not existing.get("is_verified", False):
        raise HTTPException(status_code=403, detail="Please verify your email first!")

    is_valid = bcrypt.checkpw(
        user.password.encode("utf-8"),
        existing["password"].encode("utf-8")
    )
    if not is_valid:
        raise HTTPException(status_code=401, detail="Wrong password!")

    token = create_token(user.email, str(existing["_id"]))

    return {
        "message": "Login successful!",
        "token": token,
        "user": {
            "_id": str(existing["_id"]),
            "name": existing["name"],
            "email": existing["email"]
        }
    }