import motor.motor_asyncio
import os

# Retrieve MongoDB connection string from environment variable,
# or default to a local instance running on your machine
MONGO_URL = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Create the async MongoDB client
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)

# Connect to the unavoidable database (it gets created automatically when data is inserted)
db = client.unavoidable_db

# Create references to the collections we'll need
users_collection = db.get_collection("users")
admins_collection = db.get_collection("admins")
suggestions_collection = db.get_collection("suggestions")
steps_collection = db.get_collection("steps")
