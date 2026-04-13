from groq import Groq
from dotenv import load_dotenv
import asyncio
import os

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


async def generate_digest(data: dict) -> str:
    problems   = data.get("problemsSolved", 0)
    time_spent = data.get("timeSpent", 0)
    streak     = data.get("streak", 0)
    topics     = data.get("topics", [])             # ✅ Topics included

    topics_str = ", ".join(topics) if topics else "koi topic nahi"

    if problems == 0:
        tone = "encouraging — user ne aaj kuch nahi kiya, motivate karo"
    elif problems <= 3:
        tone = "appreciative — user ne thoda kaam kiya, appreciate karo"
    else:
        tone = "highly praising — user ne bahut problems solve ki, praise karo"

    prompt = f"""
You are a DSA coach. Generate a daily digest for a user.

Stats:
- Problems solved today: {problems}
- Time spent: {time_spent} minutes
- Current streak: {streak} days
- Topics covered: {topics_str}

Tone: {tone}

Rules (STRICT):
- Write EXACTLY 2 to 3 lines
- Language: Hinglish only (Roman script, eg: "Aaj tune 5 problems solve kiye")
- NO Hindi or Urdu script (no Devanagari)
- NO emojis
- Mention topics if available
- Sound human, not robotic
"""

    try:
        # ✅ Non-blocking Groq call
        response = await asyncio.to_thread(
            client.chat.completions.create,
            model="llama-3.3-70b-versatile",    # ✅ Better model for Hinglish
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        return response.choices[0].message.content.strip()

    except Exception:
        # ✅ Hinglish fallback
        if problems == 0:
            return f"You didn’t solve any problems today. Your streak is {streak} days—don’t break it. Start again tomorrow!"
        elif problems <= 3:
            return f"You solved {problems} problems in {time_spent} minutes and covered {topics_str}. Good job, keep it up!"
        else:
            return f"Great work! You solved {problems} problems and performed strongly in {topics_str}. A {streak}-day streak—solid dedication!"