from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import HTTPException
from dotenv import load_dotenv
from bson import ObjectId
from datetime import datetime
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = AsyncIOMotorClient(MONGO_URL)
db = client["dsa_manual"]

users_collection = db["users"]
progress_collection = db["user_progress"]  # ✅ naya collection


async def get_user_progress(user_id: str) -> list[str]:
    """
    User ki saari solved questionIds lao — charo sheets ki
    Return: ["striver-1.1-3", "babbar-ARR-01", "MER-ARR-001", ...]
    Frontend inhe ek Set mein rakhega aur isSolved check karega
    """
    try:
        user_object_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user_id")

    docs = await progress_collection.find(
        {"userId": user_object_id}
    ).to_list(None)

    return [doc["questionId"] for doc in docs]


async def toggle_question(user_id: str, question_id: str, sheet_id: str) -> bool:
    """
    Question tick karo → DB mein save
    Question untick karo → DB se delete
    Return: True agar ab solved, False agar unsolve
    
    DB mein document:
    {
      userId:     ObjectId,
      sheetId:    "striver",
      questionId: "striver-1.1-3",
      solvedAt:   "2024-04-18"
    }
    """
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
        # ✅ Pehle se tick tha — untick karo, delete karo
        await progress_collection.delete_one({"_id": existing["_id"]})
        return False
    else:
        # ✅ Pehli baar tick — save karo
        await progress_collection.insert_one({
            "userId":     user_object_id,
            "sheetId":    sheet_id,
            "questionId": question_id,
            "solvedAt":   datetime.utcnow().strftime("%Y-%m-%d")
        })
        return True