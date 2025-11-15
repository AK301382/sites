"""Blog repository for database operations."""
from .base import BaseRepository
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase


class BlogRepository(BaseRepository):
    """Repository for blog posts."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db["blog"])
    
    async def find_by_slug(self, slug: str) -> Optional[dict]:
        """Find blog post by slug."""
        return await self.find_one({"slug": slug})
    
    async def find_by_category(self, category: str, skip: int = 0, limit: int = 50) -> List[dict]:
        """Find blog posts by category."""
        return await self.find_many(
            query={"category": category, "status": "published"},
            skip=skip,
            limit=limit,
            sort=[("published_at", -1)]
        )
    
    async def find_featured(self, limit: int = 3) -> List[dict]:
        """Find featured blog posts."""
        return await self.find_many(
            query={"featured": True, "status": "published"},
            limit=limit,
            sort=[("published_at", -1)]
        )
    
    async def find_published(self, skip: int = 0, limit: int = 50) -> List[dict]:
        """Find all published blog posts."""
        return await self.find_many(
            query={"status": "published"},
            skip=skip,
            limit=limit,
            sort=[("published_at", -1)]
        )
    
    async def search(self, search_term: str, skip: int = 0, limit: int = 50) -> List[dict]:
        """Search blog posts by text."""
        return await self.find_many(
            query={"$text": {"$search": search_term}, "status": "published"},
            skip=skip,
            limit=limit
        )
