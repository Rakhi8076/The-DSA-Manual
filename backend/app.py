from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bson import ObjectId
from auth import router as auth_router
from database import get_user_progress, toggle_question
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="DSA Manual API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])


# ✅ Request body model for toggle
class ToggleInput(BaseModel):
    userId:     str   # kaun sa user
    questionId: str   # kaun sa question
    sheetId:    str   # kaun si sheet


@app.get("/")
async def root():
    return {"message": "DSA Manual API is running!"}


@app.get("/progress/{user_id}")
async def get_progress(user_id: str):
    """
    SheetPage load hone pe call hoga
    Return: ["striver-1.1-3", "MER-ARR-001", ...] — saari solved IDs
    Frontend inhe Set mein rakhega, isSolved check karega
    """
    if not user_id or user_id == "undefined":
        raise HTTPException(status_code=400, detail="Invalid user_id")

    try:
        ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Malformed user_id")

    solved_ids = await get_user_progress(user_id)

    return {"solvedIds": solved_ids}  # ✅ flat list


@app.post("/progress/toggle")
async def toggle_progress(data: ToggleInput):
    """
    User ne question tick/untick kiya
    Tick   → DB mein save, return solved: true
    Untick → DB se delete, return solved: false
    """
    if not data.userId or data.userId == "undefined":
        raise HTTPException(status_code=400, detail="Invalid userId")

    try:
        ObjectId(data.userId)
    except Exception:
        raise HTTPException(status_code=400, detail="Malformed userId")

    is_solved = await toggle_question(
        user_id=data.userId,
        question_id=data.questionId,
        sheet_id=data.sheetId
    )

    return {
        "solved":     is_solved,       # ✅ true ya false
        "questionId": data.questionId,
        "sheetId":    data.sheetId
    }