"""
Script to initialize admin user in the database
Run this script once to create the initial admin user
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
from pathlib import Path
import sys

# Add parent directory to path to import config
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.security import password_handler
from config.settings import settings

async def create_admin_user():
    # Admin credentials from settings
    admin_data = {
        "username": settings.ADMIN_USERNAME,
        "email": settings.ADMIN_EMAIL,
        "hashed_password": password_handler.hash_password(settings.ADMIN_PASSWORD),
        "role": "admin",
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    # Connect to MongoDB using settings
    mongo_url = settings.MONGO_URL
    db_name = settings.DB_NAME
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    admin_users_collection = db.admin_users
    
    try:
        # Check if admin already exists
        existing = await admin_users_collection.find_one({"username": admin_data["username"]})
        
        if existing:
            print(f"✅ Admin user '{admin_data['username']}' already exists!")
        else:
            # Insert admin user
            result = await admin_users_collection.insert_one(admin_data)
            if result.inserted_id:
                print(f"✅ Admin user '{admin_data['username']}' created successfully!")
                print(f"   Email: {admin_data['email']}")
                print("   You can now login at /admin")
            else:
                print("❌ Failed to create admin user")
    
    except Exception as e:
        print(f"❌ Error: {e}")
    
    finally:
        client.close()

if __name__ == "__main__":
    print("🔧 Initializing admin user...")
    asyncio.run(create_admin_user())
    print("✅ Done!")