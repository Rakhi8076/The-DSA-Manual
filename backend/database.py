from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import HTTPException
from dotenv import load_dotenv
from datetime import datetime, timedelta
from bson import ObjectId
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = AsyncIOMotorClient(MONGO_URL)
db = client["dsa_manual"]

users_collection = db["users"]
activity_collection = db["activity_logs"]


async def save_activity(user_id: str, problems: int, time_spent: int, streak: int, topics: list[str]):
    if not user_id or user_id == "undefined":
        raise HTTPException(status_code=400, detail="Invalid user_id")

    today = datetime.utcnow().strftime("%Y-%m-%d")

    try:
        user_object_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Malformed user_id")

    existing = await activity_collection.find_one({
        "userId": user_object_id,
        "date": today
    })

    if existing:
        await activity_collection.update_one(
            {"_id": existing["_id"]},
            {
                "$inc": {
                    "problemsSolved": problems,
                    "timeSpent": time_spent
                },
                "$addToSet": {              # ✅ No duplicate topics
                    "topics": {"$each": topics}
                },
                "$set": {"streak": streak}
            }
        )
    else:
        await activity_collection.insert_one({
            "userId": user_object_id,
            "date": today,
            "problemsSolved": problems,
            "timeSpent": time_spent,
            "topics": list(set(topics)),    # ✅ Deduplicated on insert
            "streak": streak
        })


async def calculate_streak(user_id: str) -> int:
    try:
        user_object_id = ObjectId(user_id)
    except Exception:
        return 0

    logs = activity_collection.find(
        {"userId": user_object_id}
    ).sort("date", -1)

    streak = 0
    expected_day = datetime.utcnow().date()

    async for log in logs:
        log_date = datetime.strptime(log["date"], "%Y-%m-%d").date()

        if streak == 0:
            # ✅ Allow start from today OR yesterday (if not solved today yet)
            if log_date == expected_day:
                pass  # today — valid start
            elif log_date == expected_day - timedelta(days=1):
                expected_day = log_date  # yesterday — shift start
            else:
                break  # gap found, no streak

        if log_date == expected_day:
            streak += 1
            expected_day -= timedelta(days=1)
        else:
            break  # chain broken

    return streak


async def get_today_activity(user_id: str) -> dict:
    try:
        user_object_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user_id")

    today = datetime.utcnow().strftime("%Y-%m-%d")

    activity = await activity_collection.find_one({
        "userId": user_object_id,
        "date": today
    })

    if not activity:
        # ✅ Safe default — no crash on frontend
        return {
            "problemsSolved": 0,
            "timeSpent": 0,
            "streak": 0,
            "topics": []
        }

    return {
        "problemsSolved": activity.get("problemsSolved", 0),
        "timeSpent": activity.get("timeSpent", 0),
        "streak": activity.get("streak", 0),
        "topics": activity.get("topics", [])
    }