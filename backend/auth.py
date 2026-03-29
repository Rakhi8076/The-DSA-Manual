from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from database import users_collection
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

JWT_SECRET = os.getenv("JWT_SECRET")

class SignupModel(BaseModel):
    name: str
    email: EmailStr
    password: str

def create_token(email: str):
    expire = datetime.utcnow() + timedelta(days=7)
    token = jwt.encode(
        {"email": email, "exp": expire},
        JWT_SECRET,
        algorithm="HS256"
    )
    return token

@router.post("/signup")
async def signup(user: SignupModel):
    # Email already exists?
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered!")

    # Password hash karo
    hashed_password = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    # MongoDB mein save karo
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    await users_collection.insert_one(new_user)

    token = create_token(user.email)

    return {
        "message": "Signup successful!",
        "token": token,
        "user": {
            "name": user.name,
            "email": user.email
        }
    }

class LoginModel(BaseModel):
    email: EmailStr
    password: str

@router.post("/login")
async def login(user: LoginModel):
    # User exist karta hai?
    existing = await users_collection.find_one({"email": user.email})
    if not existing:
        raise HTTPException(status_code=404, detail="User not found!")

    # Password check karo
    is_valid = bcrypt.checkpw(
        user.password.encode("utf-8"),
        existing["password"].encode("utf-8")
    )
    if not is_valid:
        raise HTTPException(status_code=401, detail="Wrong password!")

    # Token banao
    token = create_token(user.email)

    return {
        "message": "Login successful!",
        "token": token,
        "user": {
            "name": existing["name"],
            "email": existing["email"]
        }
    }