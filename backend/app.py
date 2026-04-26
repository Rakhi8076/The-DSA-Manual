from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bson import ObjectId
from auth import router as auth_router
from database import get_user_progress, toggle_question, set_question
import os
import asyncio
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="DSA Manual API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080", "https://the-dsa-manual.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


class ToggleInput(BaseModel):
    userId:     str
    questionId: str
    sheetId:    str


class SetProgressInput(BaseModel):
    userId:     str
    questionId: str
    sheetId:    str
    solved:     bool


class ChatInput(BaseModel):
    message: str
    history: list[dict] = []


class InsightInput(BaseModel):
    topic: str
    solvedEasy: int
    totalEasy: int
    solvedMedium: int
    totalMedium: int
    solvedHard: int
    totalHard: int
    solvedPatterns: list[str] = []
    unsolvedPatterns: list[str] = []


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


@app.post("/chat")
async def chat(data: ChatInput):
    if not data.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    system_prompt = """You are a friendly DSA assistant and coding buddy. Your name is AlgoShee.

BEHAVIOR RULES:
1. If user says hi, hello, hey or general greetings → respond in MAX 1 line only. Example: "Hey! 👋 Which DSA topic or problem can I help you with?"
2. If user is having casual conversation → be friendly and natural, slowly guide towards DSA help
3. If user mentions a DSA problem, topic, or asks for help → then suggest problems

WHEN SUGGESTING PROBLEMS (only when user asks):
- Identify the core pattern (Binary Search, Sliding Window, Two Pointers, DP, Graph, etc.)
- Suggest minimum 10 problems, more if available
- Do NOT stop at 5 or 7 — keep going until all relevant problems are listed
- Only include problems you are 100% sure exist on LeetCode with correct LC numbers
- For EACH problem include:
  * Problem name
  * LeetCode number
  * Direct LeetCode link: https://leetcode.com/problems/problem-slug/
  * Pattern used
  * 1-2 line approach (beginner-friendly)

OUTPUT FORMAT when suggesting:
Detected Pattern: <pattern>

Problems to Practice:
1. Problem Name (LC ###)
   Link: https://leetcode.com/problems/problem-slug/
   Pattern: <pattern>
   Approach: <short approach>

2. ...

STRICT RULES:
- Never hallucinate fake LC numbers or links
- Only suggest problems you are 100% sure about
- If unsure about a link, skip that problem
- Keep responses conversational and friendly

PROGRESS CONTEXT RULES:
- User ke message mein [User Progress Context] section hoga
- Jab user apni progress ke baare mein puche tab is context ko use karo
- Example queries: 'TUF AtoZ mein kitne pending hain?', 'konsi sheet mein zyada pending hai?', 'meri overall progress?'
- Context ko user ko mat dikhao — sirf internally use karo answer karne ke liye
- Numbers exactly wahi batao jo context mein hain"""
    messages = [{"role": "system", "content": system_prompt}]
    messages += data.history
    messages.append({"role": "user", "content": data.message})

    try:
        response = await asyncio.to_thread(
            groq_client.chat.completions.create,
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=2000,
            temperature=0.5,
        )
        reply = response.choices[0].message.content.strip()
        return {"reply": reply}

    except Exception:
        raise HTTPException(status_code=500, detail="AI service unavailable")


@app.post("/ai-insight")
async def ai_insight(data: InsightInput):
    prompt = f"""You are a DSA coach. A student is practicing {data.topic}.
Their progress:
- Easy: {data.solvedEasy}/{data.totalEasy} solved
- Medium: {data.solvedMedium}/{data.totalMedium} solved
- Hard: {data.solvedHard}/{data.totalHard} solved
- Patterns they have solved: {', '.join(data.solvedPatterns) or 'none'}
- Patterns not yet attempted: {', '.join(data.unsolvedPatterns) or 'none'}

Give exactly 1 short actionable line (max 12 words) telling what they should focus on next. Be specific about patterns or difficulty. No fluff."""

    try:
        response = await asyncio.to_thread(
            groq_client.chat.completions.create,
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=50,
            temperature=0.5,
        )
        insight = response.choices[0].message.content.strip()
        return {"insight": insight}
    except Exception:
        raise HTTPException(status_code=500, detail="AI insight unavailable")