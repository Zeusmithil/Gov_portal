import motor.motor_asyncio
import os


MONGO_URL = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)

db = client.unavoidable_db

users_collection = db.get_collection("users")
admins_collection = db.get_collection("admins")
suggestions_collection = db.get_collection("suggestions")
steps_collection = db.get_collection("steps")
services_collection = db.get_collection("services")
subservices_collection = db.get_collection("subservices")
reset_tokens_collection = db.get_collection("reset_tokens")
admin_logs_collection = db.get_collection("admin_logs")
