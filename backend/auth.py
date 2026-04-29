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
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")    # ✅ No hardcode
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:8080")  # ✅ No hardcode


class SignupModel(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginModel(BaseModel):
    email: EmailStr
    password: str


def create_token(email: str, user_id: str):    # ✅ userId added
    expire = datetime.utcnow() + timedelta(days=7)
    return jwt.encode(
        {"email": email, "userId": user_id, "exp": expire},
        JWT_SECRET,
        algorithm="HS256"
    )


def _send_verification_email(to_email: str, token: str): 
    print(f"⭐ Sending verification to {to_email}")    # ✅ Moved to bg task
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

# ✅ NEW: Admin notification function
def _send_admin_notification(user_name: str, user_email: str):
    try:
        message = Mail(
            from_email=SENDGRID_FROM_EMAIL,
            to_emails=ADMIN_EMAIL,
            subject=f"🎉 New Signup: {user_name}",
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
        print(f"✅ Response body: {response.body}")  
        print(f"✅ Response headers: {response.headers}")  
    except Exception as e:
        print(f"❌ Admin notification failed: {e}") 
        import traceback
        traceback.print_exc()          

    
@router.post("/signup")
async def signup(user: SignupModel, background_tasks: BackgroundTasks):  # ✅ Non-blocking
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered!")

    hashed_password = bcrypt.hashpw(
        user.password.encode("utf-8"), bcrypt.gensalt(rounds=10)
    ).decode("utf-8")

    verify_token = secrets.token_urlsafe(32)
    verify_token_expiry = datetime.utcnow() + timedelta(hours=24)  # ✅ Expiry added

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.utcnow(),
        "is_verified": False,
        "verify_token": verify_token,
        "verify_token_expiry": verify_token_expiry  # ✅ Stored in DB
    }
    await users_collection.insert_one(new_user)

    background_tasks.add_task(                     # ✅ Non-blocking email
        _send_verification_email, user.email, verify_token
    )

    print("⭐ About to call admin notification")   # ← ye add karo
    _send_admin_notification(user.name, user.email)
    print("⭐ Admin notification called")  

    return {"message": "Signup successful! Please check your email to verify your account."}


@router.get("/verify")
async def verify_email(token: str):
    user = await users_collection.find_one({"verify_token": token})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token!")

    # ✅ Expiry check
    expiry = user.get("verify_token_expiry")
    if expiry and datetime.utcnow() > expiry:
        raise HTTPException(status_code=400, detail="Verification link has expired!")

    await users_collection.update_one(
        {"verify_token": token},
        {"$set": {"is_verified": True}, "$unset": {"verify_token": "", "verify_token_expiry": ""}}
    )

    return RedirectResponse(url=f"{FRONTEND_URL}/login?verified=true")  # ✅ No hardcode


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

    token = create_token(user.email, str(existing["_id"]))  # ✅ userId in token

    return {
        "message": "Login successful!",
        "token": token,
        "user": {
            "_id": str(existing["_id"]),
            "name": existing["name"],
            "email": existing["email"]
        }
    }

print(f"SENDGRID KEY: {SENDGRID_API_KEY[:10] if SENDGRID_API_KEY else 'MISSING'}")