from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import HTTPException
from dotenv import load_dotenv
from datetime import datetime, timedelta
from bson import ObjectId
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = AsyncIOMotorClient(MONGO_URL)
db = client["dsa_manual"]

users_collection = db["users"]
