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
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:8080")


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


@router.post("/signup")
async def signup(user: SignupModel):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered!")

    hashed_password = bcrypt.hashpw(
        user.password.encode("utf-8"), bcrypt.gensalt(rounds=10)
    ).decode("utf-8")

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.utcnow(),
        "is_verified": True,  # ✅ Direct verified
    }
    await users_collection.insert_one(new_user)

    return {"message": "Signup successful! You can now login."}


@router.post("/login")
async def login(user: LoginModel):
    existing = await users_collection.find_one({"email": user.email})
    if not existing:
        raise HTTPException(status_code=404, detail="User not found!")

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