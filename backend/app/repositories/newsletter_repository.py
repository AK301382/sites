"""Newsletter repository for database operations."""
from .base import BaseRepository
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase


class NewsletterRepository(BaseRepository):
    """Repository for newsletter subscriptions."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db["newsletter"])
    
    async def find_by_email(self, email: str) -> Optional[dict]:
        """Find subscription by email."""
        return await self.find_one({"email": email})
    
    async def find_active_subscribers(self, skip: int = 0, limit: int = 100) -> list:
        """Find all active subscribers."""
        return await self.find_many(
            query={"status": "active"},
            skip=skip,
            limit=limit,
            sort=[("subscribed_at", -1)]
        )
    
    async def unsubscribe(self, email: str) -> Optional[dict]:
        """Unsubscribe by email."""
        subscription = await self.find_by_email(email)
        if subscription:
            return await self.update(subscription["id"], {"status": "unsubscribed"})
        return None
