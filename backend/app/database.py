import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_URL")

client = AsyncIOMotorClient(MONGO_DETAILS)

database = client.mydb
