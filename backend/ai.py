from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def generate_digest(data): # ✅ FIXED
    prompt = f"""
    User solved {data['problemsSolved']} problems,
    spent {data['timeSpent']} minutes,
    and has a {data['streak']} day streak.

    Write a short daily summary.
    - Do NOT use emojis
    - Keep it professional
    - Keep it under 3 lines
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content