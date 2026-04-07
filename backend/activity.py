from ai import generate_digest
from datetime import datetime, timedelta
from database import db
from fastapi import APIRouter

router = APIRouter()

@router.get("/daily-digest/{user_id}")
async def daily_digest(user_id: str):

    today = datetime.utcnow().date()

    start = datetime(today.year, today.month, today.day)
    end = start + timedelta(days=1)

    activities = await db.activities.find({
        "user_id": user_id,
        "created_at": {"$gte": start, "$lt": end}
    }).to_list(100)

    if not activities:
        return {"message": "No activity today"}

    total = len(activities)

    # 🔥 simple stats
    topics = list(set([a["topic"] for a in activities]))

    # 🔥 AI ke liye data
    data = {
        "problemsSolved": total,
        "timeSpent": total * 10,  # approx
        "streak": 3  # abhi dummy, baad me calculate karenge
    }

    # 🔥 AI CALL
    summary = await generate_digest(data)

    return {
        "total_questions": total,
        "topics": topics,
        "summary": summary
    }