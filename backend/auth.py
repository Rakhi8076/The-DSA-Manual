from fastapi import APIRouter, HTTPException
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

class SignupModel(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginModel(BaseModel):
    email: EmailStr
    password: str

def create_token(email: str):
    expire = datetime.utcnow() + timedelta(days=7)
    return jwt.encode({"email": email, "exp": expire}, JWT_SECRET, algorithm="HS256")

def send_verification_email(to_email: str, token: str):
    verify_link = f"http://localhost:8000/auth/verify?token={token}"
    message = Mail(
        from_email=SENDGRID_FROM_EMAIL,
        to_emails=to_email,
        subject="Verify your DSA Manual account",
        html_content=f"""
        <h2>Welcome to DSA Manual! 🎉</h2>
        <p>Click the link below to verify your account:</p>
        <a href="{verify_link}" style="background:#6366f1;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">
            Verify Email
        </a>
        <p>Link expires in 24 hours.</p>
        """
    )
    sg = SendGridAPIClient(SENDGRID_API_KEY)
    sg.send(message)

@router.post("/signup")
async def signup(user: SignupModel):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered!")

    hashed_password = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt(rounds=10)
    ).decode("utf-8")

    # Verification token banao
    verify_token = secrets.token_urlsafe(32)

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.utcnow(),
        "is_verified": False,
        "verify_token": verify_token
    }
    await users_collection.insert_one(new_user)

    # Email bhejo
    send_verification_email(user.email, verify_token)

    return {"message": "Signup successful! Please check your email to verify your account."}

@router.get("/verify")
async def verify_email(token: str):
    user = await users_collection.find_one({"verify_token": token})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token!")

    await users_collection.update_one(
        {"verify_token": token},
        {"$set": {"is_verified": True}, "$unset": {"verify_token": ""}}
    )
    # 👇 Yahi change karo
    
    return RedirectResponse(url="http://localhost:8080/login?verified=true")

@router.post("/login")
async def login(user: LoginModel):
    existing = await users_collection.find_one({"email": user.email})
    if not existing:
        raise HTTPException(status_code=404, detail="User not found!")

    # Verified hai?
    if not existing.get("is_verified", False):
        raise HTTPException(status_code=403, detail="Please verify your email first!")

    is_valid = bcrypt.checkpw(
        user.password.encode("utf-8"),
        existing["password"].encode("utf-8")
    )
    if not is_valid:
        raise HTTPException(status_code=401, detail="Wrong password!")

    token = create_token(user.email)

    return {
        "message": "Login successful!",
        "token": token,
        "user": {
            "name": existing["name"],
            "email": existing["email"]
        }
    }