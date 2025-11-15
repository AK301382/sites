from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from config.settings import settings

# MongoDB connection using settings
mongo_url = settings.MONGO_URL
db_name = settings.DB_NAME

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Collections
contacts_collection = db.contacts
newsletter_collection = db.newsletter
portfolio_collection = db.portfolio
blog_collection = db.blog
service_inquiries_collection = db.service_inquiries
consultation_bookings_collection = db.consultation_bookings

def get_database() -> AsyncIOMotorDatabase:
    """Get database instance for dependency injection."""
    return db

async def close_db_connection():
    client.close()