from fastapi import APIRouter, HTTPException
from database import get_today_activity, calculate_streak, activity_collection
from ai import generate_digest
from datetime import datetime
from bson import ObjectId

router = APIRouter()


@router.get("/daily-digest/{user_id}")
async def daily_digest(user_id: str):

    # ✅ Validate user_id
    if not user_id or user_id == "undefined":
        raise HTTPException(status_code=400, detail="Invalid user_id")

    try:
        ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Malformed user_id")

    # ✅ Fetch real activity from correct collection
    activity = await get_today_activity(user_id)

    # ✅ Calculate real streak
    streak = await calculate_streak(user_id)

    # ✅ Update streak in today's document if activity exists
    today = datetime.utcnow().strftime("%Y-%m-%d")
    await activity_collection.update_one(
        {"userId": ObjectId(user_id), "date": today},
        {"$set": {"streak": streak}},
    )

    # ✅ Build data for AI with all fields
    digest_data = {
        "problemsSolved": activity["problemsSolved"],
        "timeSpent":      activity["timeSpent"],
        "streak":         streak,
        "topics":         activity["topics"]
    }

    # ✅ AI digest
    summary = await generate_digest(digest_data)

    return {
        "userId":         user_id,
        "date":           today,
        "problemsSolved": activity["problemsSolved"],
        "timeSpent":      activity["timeSpent"],
        "streak":         streak,
        "topics":         activity["topics"],
        "digest":         summary
    }