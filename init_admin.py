import asyncio
from backend.database import admins_collection

async def init_admin():
    try:
        # Check if admin already exists
        existing_admin = await admins_collection.find_one({"username": "admin"})
        if existing_admin:
            print("✓ Admin user already exists.")
            return
        
        # Insert admin user
        result = await admins_collection.insert_one({
            "username": "admin",
            "password": "admin123"
        })
        print(f"✓ Admin user created with ID: {result.inserted_id}")
    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == "__main__":
    asyncio.run(init_admin())
