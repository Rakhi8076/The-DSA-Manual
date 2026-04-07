from motor.motor_asyncio import AsyncIOMotorClient
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

async def save_activity(user_id, problems, time_spent, streak):
    today = datetime.now().strftime("%Y-%m-%d")
    user_object_id = ObjectId(user_id)

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
                "$set": {
                    "streak": streak
                }
            }
        )
    else:
        await activity_collection.insert_one({
            "userId": user_object_id,
            "date": today,
            "problemsSolved": problems,
            "timeSpent": time_spent,
            "streak": streak
        })

async def calculate_streak(user_id):
    user_object_id = ObjectId(user_id)

    logs = activity_collection.find({
        "userId": user_object_id
    }).sort("date", -1)

    streak = 0
    # FIX 1: aaj ya kal dono valid starting point hain
    # (agar aaj solve nahi kiya toh kal se streak count hogi)
    expected_day = datetime.now().date()

    async for log in logs:
        log_date = datetime.strptime(log["date"], "%Y-%m-%d").date()

        # FIX 2: pehle check karo expected day match hoti hai ya nahi
        # agar gap hai toh streak toot gayi
        if log_date == expected_day or log_date == expected_day - timedelta(days=1):
            # pehli iteration mein expected_day set karo log_date pe
            if streak == 0:
                expected_day = log_date

            streak += 1
            expected_day = expected_day - timedelta(days=1)
        else:
            break

    return streak  # FIX 3: extra +1 hata diya

async def save_activity_collection_update(user_id, streak, today):
    await activity_collection.update_one(
        {
            "userId": ObjectId(user_id),
            "date": today
        },
        {
            "$set": {"streak": streak}
        }
    )


# ✅ 4. GET TODAY ACTIVITY (YAHAN ADD KARO)
async def get_today_activity(user_id):
    today = datetime.now().strftime("%Y-%m-%d")

    return await activity_collection.find_one({
        "userId": ObjectId(user_id),
        "date": today
    })