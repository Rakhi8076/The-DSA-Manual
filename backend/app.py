from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bson import ObjectId
from auth import router as auth_router
from database import get_user_progress, toggle_question, set_question
import os
from groq import Groq
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

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))  # ✅ Backend mein safe


class ToggleInput(BaseModel):
    userId:     str
    questionId: str
    sheetId:    str


class SetProgressInput(BaseModel):
    userId:     str
    questionId: str
    sheetId:    str
    solved:     bool


# ✅ Chatbot ke liye model
class ChatInput(BaseModel):
    message: str
    history: list[dict] = []  # [{role: "user", content: "..."}, ...]


@app.get("/")
async def root():
    return {"message": "DSA Manual API is running!"}


@app.get("/progress/{user_id}")
async def get_progress(user_id: str):
    if not user_id or user_id == "undefined":
        raise HTTPException(status_code=400, detail="Invalid user_id")
    try:
        ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Malformed user_id")

    solved_ids = await get_user_progress(user_id)
    return {"solvedIds": solved_ids}


@app.post("/progress/toggle")
async def toggle_progress(data: ToggleInput):
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
    return {"solved": is_solved, "questionId": data.questionId, "sheetId": data.sheetId}


@app.post("/progress/set")
async def set_progress(data: SetProgressInput):
    if not data.userId or data.userId == "undefined":
        raise HTTPException(status_code=400, detail="Invalid userId")
    try:
        ObjectId(data.userId)
    except Exception:
        raise HTTPException(status_code=400, detail="Malformed userId")

    await set_question(
        user_id=data.userId,
        question_id=data.questionId,
        sheet_id=data.sheetId,
        solved=data.solved
    )
    return {"solved": data.solved, "questionId": data.questionId, "sheetId": data.sheetId}


# ✅ Chatbot route
@app.post("/chat")
async def chat(data: ChatInput):
    if not data.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    system_prompt = """You are an expert Data Structures and Algorithms assistant specialized in LeetCode problem patterns.
Your task is to analyze the user's input (which may be a problem name, hint, or partial description) and return relevant similar LeetCode problem no. along with their approaches.

Follow these rules strictly:
1. Identify the core pattern of the problem (Binary Search, Sliding Window, Two Pointers, DP, Graph, Backtracking, Greedy, Heap, etc.)
2. Suggest 5 to 7 most relevant LeetCode problems with:
   - Problem name
   - LeetCode problem number
   - Pattern used
   - Short 2-3 line approach (beginner-friendly)
3. If input is unclear, ask a clarification question or provide closest pattern-based guess
4. Output format:
   Input:
   Detected Pattern:
   Similar Problems:
   1. (LC ###) Pattern: Approach:
   2. (LC ###) Pattern: Approach:
5. Do NOT hallucinate fake LeetCode numbers
6. Keep answers short, clear, and structured"""

    # ✅ History ke saath messages banao
    messages = [{"role": "system", "content": system_prompt}]
    messages += data.history
    messages.append({"role": "user", "content": data.message})

    try:
        import asyncio
        response = await asyncio.to_thread(
            groq_client.chat.completions.create,
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=1000,
            temperature=0.5,
        )
        reply = response.choices[0].message.content.strip()
        return {"reply": reply}

    except Exception as e:
        raise HTTPException(status_code=500, detail="AI service unavailable")