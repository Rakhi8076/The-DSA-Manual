from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import HTTPException
from dotenv import load_dotenv
from bson import ObjectId
from datetime import datetime, timezone, timedelta
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = AsyncIOMotorClient(MONGO_URL)
db = client["dsa_manual"]

# ✅ IST timezone
IST = timezone(timedelta(hours=5, minutes=30))

def get_today() -> str:
    return datetime.now(IST).strftime("%Y-%m-%d")

users_collection = db["users"]
progress_collection = db["user_progress"]


async def get_user_progress(user_id: str) -> list[str]:
    try:
        user_object_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user_id")

    docs = await progress_collection.find(
        {"userId": user_object_id}
    ).to_list(None)

    return [doc["questionId"] for doc in docs]


async def toggle_question(user_id: str, question_id: str, sheet_id: str) -> bool:
    try:
        user_object_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user_id")

    existing = await progress_collection.find_one({
        "userId":     user_object_id,
        "questionId": question_id,
        "sheetId":    sheet_id
    })

    if existing:
        await progress_collection.delete_one({"_id": existing["_id"]})
        return False
    else:
        await progress_collection.insert_one({
            "userId":     user_object_id,
            "sheetId":    sheet_id,
            "questionId": question_id,
            "solvedAt":   get_today()  # ✅ IST date
        })
        return True


async def set_question(user_id: str, question_id: str, sheet_id: str, solved: bool):
    try:
        user_object_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user_id")

    existing = await progress_collection.find_one({
        "userId":     user_object_id,
        "questionId": question_id,
        "sheetId":    sheet_id
    })

    if solved and not existing:
        await progress_collection.insert_one({
            "userId":     user_object_id,
            "sheetId":    sheet_id,
            "questionId": question_id,
            "solvedAt":   get_today()  # ✅ IST date
        })
    elif not solved and existing:
        await progress_collection.delete_one({"_id": existing["_id"]})