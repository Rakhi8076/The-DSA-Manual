from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
from bson import ObjectId
import os

from auth import router as auth_router
from database import (
    save_activity,
    calculate_streak,
    get_today_activity,
    activity_collection
)
from ai import generate_digest
from datetime import datetime

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:8080")  # ✅ No hardcode

app = FastAPI(title="DSA Manual API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],   # ✅ Not wildcard
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Routers
app.include_router(auth_router, prefix="/auth", tags=["Auth"])


# ✅ Pydantic model — no more raw dict
class ActivityInput(BaseModel):
    userId: str
    problemsSolved: int = 1
    timeSpent: int = 5
    topics: list[str] = []          # ✅ Topics included


@app.get("/")
async def root():
    return {"message": "DSA Manual API is running!"}


@app.post("/save-activity")
async def save_user_activity(data: ActivityInput):

    # ✅ Validate userId
    if not data.userId or data.userId == "undefined":
        raise HTTPException(status_code=400, detail="Invalid userId")

    try:
        ObjectId(data.userId)
    except Exception:
        raise HTTPException(status_code=400, detail="Malformed userId")

    # ✅ Calculate real streak before saving
    streak = await calculate_streak(data.userId)

    # ✅ Save with topics + real streak
    await save_activity(
        user_id=data.userId,
        problems=data.problemsSolved,
        time_spent=data.timeSpent,
        streak=streak,
        topics=data.topics
    )

    return {"message": "Activity saved", "streak": streak}


@app.get("/daily-digest/{user_id}")
async def daily_digest(user_id: str):

    # ✅ Validate
    if not user_id or user_id == "undefined":
        raise HTTPException(status_code=400, detail="Invalid user_id")

    try:
        ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Malformed user_id")

    # ✅ Fetch real activity
    activity = await get_today_activity(user_id)

    # ✅ Calculate real streak
    streak = await calculate_streak(user_id)

    # ✅ Update streak in DB if activity exists today
    today = datetime.utcnow().strftime("%Y-%m-%d")
    await activity_collection.update_one(
        {"userId": ObjectId(user_id), "date": today},
        {"$set": {"streak": streak}}
    )

    digest_data = {
        "problemsSolved": activity["problemsSolved"],
        "timeSpent":      activity["timeSpent"],
        "streak":         streak,
        "topics":         activity["topics"],   # ✅ Topics to AI
    }

    digest = await generate_digest(digest_data)

    # ✅ FLAT response — frontend directly use karega, no nesting
    return {
        "userId":         user_id,
        "date":           today,
        "problemsSolved": activity["problemsSolved"],
        "timeSpent":      activity["timeSpent"],
        "streak":         streak,
        "topics":         activity["topics"],
        "digest":         digest
    }