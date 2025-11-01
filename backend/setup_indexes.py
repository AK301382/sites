"""
Database Indexing Setup for Performance Optimization
Creates indexes on frequently queried fields
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def setup_indexes():
    """Create database indexes for better query performance"""
    
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ['DB_NAME']
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("🔧 Setting up database indexes for performance optimization...")
    
    try:
        # Services Collection Indexes
        print("\n📚 Creating indexes for 'services' collection...")
        await db.services.create_index([("id", 1)], unique=True)
        await db.services.create_index([("category", 1)])
        print("✅ Services indexes created")
        
        # Appointments Collection Indexes
        print("\n📅 Creating indexes for 'appointments' collection...")
        await db.appointments.create_index([("id", 1)], unique=True)
        await db.appointments.create_index([("customer_email", 1)])
        await db.appointments.create_index([("service_id", 1)])
        await db.appointments.create_index([("artist_id", 1)])
        await db.appointments.create_index([("status", 1)])
        await db.appointments.create_index([("appointment_date", 1)])
        await db.appointments.create_index([("created_at", -1)])  # Descending for recent first
        print("✅ Appointments indexes created")
        
        # Artists Collection Indexes
        print("\n👨‍🎨 Creating indexes for 'artists' collection...")
        await db.artists.create_index([("id", 1)], unique=True)
        await db.artists.create_index([("name", 1)])
        print("✅ Artists indexes created")
        
        # Gallery Collection Indexes
        print("\n🖼️ Creating indexes for 'gallery' collection...")
        await db.gallery.create_index([("id", 1)], unique=True)
        await db.gallery.create_index([("style", 1)])
        await db.gallery.create_index([("colors", 1)])
        await db.gallery.create_index([("artist_name", 1)])
        await db.gallery.create_index([("created_at", -1)])  # Descending for recent first
        print("✅ Gallery indexes created")
        
        # Contact Messages Collection Indexes
        print("\n📧 Creating indexes for 'contact_messages' collection...")
        await db.contact_messages.create_index([("id", 1)], unique=True)
        await db.contact_messages.create_index([("email", 1)])
        await db.contact_messages.create_index([("created_at", -1)])  # Descending for recent first
        print("✅ Contact messages indexes created")
        
        # Service Categories Collection Indexes
        print("\n📂 Creating indexes for 'service_categories' collection...")
        await db.service_categories.create_index([("id", 1)], unique=True)
        print("✅ Service categories indexes created")
        
        # Gallery Styles Collection Indexes
        print("\n🎨 Creating indexes for 'gallery_styles' collection...")
        await db.gallery_styles.create_index([("id", 1)], unique=True)
        print("✅ Gallery styles indexes created")
        
        # Gallery Colors Collection Indexes
        print("\n🌈 Creating indexes for 'gallery_colors' collection...")
        await db.gallery_colors.create_index([("id", 1)], unique=True)
        print("✅ Gallery colors indexes created")
        
        # Settings Collection Index
        print("\n⚙️ Creating indexes for 'settings' collection...")
        await db.settings.create_index([("id", 1)], unique=True)
        print("✅ Settings indexes created")
        
        # Compound Indexes for complex queries
        print("\n🔗 Creating compound indexes...")
        await db.appointments.create_index([("artist_id", 1), ("appointment_date", 1)])
        await db.appointments.create_index([("status", 1), ("appointment_date", 1)])
        await db.gallery.create_index([("style", 1), ("colors", 1)])
        print("✅ Compound indexes created")
        
        print("\n✨ All database indexes created successfully!")
        print("📊 Your database queries will now be much faster!")
        
    except Exception as e:
        print(f"\n❌ Error creating indexes: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(setup_indexes())
