"""Portfolio repository for database operations."""
from .base import BaseRepository
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase


class PortfolioRepository(BaseRepository):
    """Repository for portfolio items."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db["portfolio"])
    
    async def find_by_slug(self, slug: str) -> Optional[dict]:
        """Find portfolio item by slug."""
        return await self.find_one({"slug": slug})
    
    async def find_by_category(self, category: str, skip: int = 0, limit: int = 50) -> List[dict]:
        """Find portfolio items by category."""
        return await self.find_many(
            query={"category": category, "status": "published"},
            skip=skip,
            limit=limit,
            sort=[("created_at", -1)]
        )
    
    async def find_featured(self, limit: int = 6) -> List[dict]:
        """Find featured portfolio items."""
        return await self.find_many(
            query={"featured": True, "status": "published"},
            limit=limit,
            sort=[("created_at", -1)]
        )
    
    async def find_published(self, skip: int = 0, limit: int = 50) -> List[dict]:
        """Find all published portfolio items."""
        return await self.find_many(
            query={"status": "published"},
            skip=skip,
            limit=limit,
            sort=[("created_at", -1)]
        )
