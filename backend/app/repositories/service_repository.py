"""Service repository for database operations."""
from .base import BaseRepository
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase


class ServiceRepository(BaseRepository):
    """Repository for service inquiries and consultation bookings."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db["service_inquiries"])
    
    async def find_by_status(self, status: str, skip: int = 0, limit: int = 50) -> List[dict]:
        """Find inquiries by status."""
        return await self.find_many(
            query={"status": status},
            skip=skip,
            limit=limit,
            sort=[("created_at", -1)]
        )
    
    async def find_by_service_type(self, service_type: str, skip: int = 0, limit: int = 50) -> List[dict]:
        """Find inquiries by service type."""
        return await self.find_many(
            query={"service_type": service_type},
            skip=skip,
            limit=limit,
            sort=[("created_at", -1)]
        )
    
    async def update_status(self, doc_id: str, status: str) -> Optional[dict]:
        """Update inquiry status."""
        return await self.update(doc_id, {"status": status})
