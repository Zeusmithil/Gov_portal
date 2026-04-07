import motor.motor_asyncio
import os
import asyncio

# Retrieve MongoDB connection string from environment variable,
# or default to a local instance running on your machine
MONGO_URL = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Create the async MongoDB client
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)

# Connect to the unavoidable database (it gets created automatically when data is inserted)
db = client.unavoidable_db

# Create references to the collections we'll need
users_collection = db.get_collection("users")
documents_collection = db.get_collection("documents")

async def test_insert():
    result = await users_collection.insert_one({"name": "test_user"})
    print("Inserted ID:", result.inserted_id)

if __name__ == "__main__":
    asyncio.run(test_insert())
