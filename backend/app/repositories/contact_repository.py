"""Contact repository for database operations."""
from .base import BaseRepository
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase


class ContactRepository(BaseRepository):
    """Repository for contact submissions."""
    
    
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db["contacts"])
    
    async def find_by_status(self, status: str, skip: int = 0, limit: int = 50) -> List[dict]:
        """Find contacts by status."""
        return await self.find_many(
            query={"status": status},
            skip=skip,
            limit=limit,
            sort=[("created_at", -1)]
        )
    
    async def find_by_email(self, email: str) -> List[dict]:
        """Find contacts by email."""
        return await self.find_many(
            query={"email": email},
            sort=[("created_at", -1)]
        )
    
    async def update_status(self, doc_id: str, status: str) -> Optional[dict]:
        """Update contact status."""
        return await self.update(doc_id, {"status": status})
