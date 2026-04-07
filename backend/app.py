from fastapi import FastAPI
from database import save_activity, calculate_streak
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from ai import generate_digest
from database import get_today_activity

app = FastAPI(title="DSA Manual API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])

@app.get("/")
async def root():
    return {"message": "DSA Manual API is running!"}

@app.post("/save-activity")
async def save_user_activity(data: dict):
    user_id = data.get("userId")

    if not user_id:
        return {"error": "userId missing"}

    problems = data.get("problemsSolved", 1)
    time_spent = data.get("timeSpent", 5)

    # ✅ only save
    await save_activity(user_id, problems, time_spent, 0)

    return {"message": "Activity saved"}

@app.get("/daily-digest/{user_id}")
async def daily_digest(user_id: str):
    activity = await get_today_activity(user_id)

    if not activity:
        return {"message": "No activity today"}

    # ✅ transform data for AI
    data = {
        "problemsSolved": activity.get("problemsSolved", 0),
        "timeSpent": activity.get("timeSpent", 0),
        "streak": activity.get("streak", 1),
    }

    digest = await generate_digest(data)

    return {
        "stats": data,
        "digest": digest
    }