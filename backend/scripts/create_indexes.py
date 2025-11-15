"""
Script to create database indexes for optimal query performance.
Run this script once after database setup.
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from database import db
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def create_indexes():
    """Create all necessary database indexes for performance optimization."""
    
    logger.info("🔧 Creating database indexes...")
    
    try:
        # ==================== Admin Users ====================
        logger.info("Creating indexes for admin_users collection...")
        await db.admin_users.create_index([("username", 1)], unique=True)
        await db.admin_users.create_index([("email", 1)], unique=True)
        
        # ==================== Contacts ====================
        logger.info("Creating indexes for contacts collection...")
        await db.contacts.create_index([("status", 1), ("created_at", -1)])
        await db.contacts.create_index([("email", 1)])
        await db.contacts.create_index([("created_at", -1)])
        
        # ==================== Newsletter ====================
        logger.info("Creating indexes for newsletter collection...")
        await db.newsletter.create_index([("email", 1)], unique=True)
        await db.newsletter.create_index([("status", 1)])
        await db.newsletter.create_index([("subscribed_at", -1)])
        
        # ==================== Portfolio ====================
        logger.info("Creating indexes for portfolio collection...")
        await db.portfolio.create_index([("slug", 1)], unique=True)
        await db.portfolio.create_index([("category", 1), ("featured", -1)])
        await db.portfolio.create_index([("status", 1)])
        await db.portfolio.create_index([("created_at", -1)])
        await db.portfolio.create_index([("featured", -1), ("created_at", -1)])
        
        # ==================== Blog ====================
        logger.info("Creating indexes for blog collection...")
        await db.blog.create_index([("slug", 1)], unique=True)
        await db.blog.create_index([("category", 1), ("published_at", -1)])
        await db.blog.create_index([("status", 1)])
        await db.blog.create_index([("featured", -1), ("published_at", -1)])
        await db.blog.create_index([("created_at", -1)])
        
        # Text index for search
        await db.blog.create_index([
            ("title", "text"),
            ("content", "text"),
            ("excerpt", "text")
        ], name="blog_text_search")
        
        # ==================== Service Inquiries ====================
        logger.info("Creating indexes for service_inquiries collection...")
        await db.service_inquiries.create_index([("status", 1), ("created_at", -1)])
        await db.service_inquiries.create_index([("service_type", 1)])
        await db.service_inquiries.create_index([("email", 1)])
        await db.service_inquiries.create_index([("created_at", -1)])
        
        # Compound index for common queries
        await db.service_inquiries.create_index([
            ("status", 1),
            ("service_type", 1),
            ("created_at", -1)
        ])
        
        # ==================== Consultation Bookings ====================
        logger.info("Creating indexes for consultation_bookings collection...")
        await db.consultation_bookings.create_index([("status", 1), ("created_at", -1)])
        await db.consultation_bookings.create_index([("preferred_date", 1)])
        await db.consultation_bookings.create_index([("email", 1)])
        await db.consultation_bookings.create_index([("created_at", -1)])
        
        logger.info("✅ All indexes created successfully!")
        logger.info("📊 Database performance optimized")
        
        # List all indexes for verification
        logger.info("\n📋 Index Summary:")
        for collection_name in ['admin_users', 'contacts', 'newsletter', 'portfolio', 'blog', 'service_inquiries', 'consultation_bookings']:
            collection = db[collection_name]
            indexes = await collection.list_indexes().to_list(length=100)
            logger.info(f"\n{collection_name}:")
            for idx in indexes:
                logger.info(f"  - {idx.get('name')}: {idx.get('key')}")
        
    except Exception as e:
        logger.error(f"❌ Error creating indexes: {e}")
        raise


async def drop_all_indexes():
    """Drop all indexes (use with caution - only for re-indexing)."""
    logger.warning("⚠️  Dropping all indexes...")
    
    collections = ['admin_users', 'contacts', 'newsletter', 'portfolio', 'blog', 'service_inquiries', 'consultation_bookings']
    
    for collection_name in collections:
        try:
            collection = db[collection_name]
            await collection.drop_indexes()
            logger.info(f"✅ Dropped indexes for {collection_name}")
        except Exception as e:
            logger.error(f"❌ Error dropping indexes for {collection_name}: {e}")


if __name__ == "__main__":
    print("=" * 60)
    print("🗄️  Database Index Management")
    print("=" * 60)
    
    if len(sys.argv) > 1 and sys.argv[1] == "--drop":
        print("\n⚠️  WARNING: This will drop ALL indexes!")
        confirm = input("Type 'yes' to confirm: ")
        if confirm.lower() == 'yes':
            asyncio.run(drop_all_indexes())
        else:
            print("❌ Cancelled")
    else:
        asyncio.run(create_indexes())
    
    print("\n" + "=" * 60)
    print("✅ Done!")
    print("=" * 60)
