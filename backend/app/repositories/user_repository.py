"""User repository for database operations."""
from .base import BaseRepository
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase


class UserRepository(BaseRepository):
    """Repository for admin users."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db["admin_users"])
    
    async def find_by_username(self, username: str) -> Optional[dict]:
        """Find user by username."""
        return await self.find_one({"username": username})
    
    async def find_by_email(self, email: str) -> Optional[dict]:
        """Find user by email."""
        return await self.find_one({"email": email})
    
    async def update_last_login(self, user_id: str) -> Optional[dict]:
        """Update user's last login timestamp."""
        from datetime import datetime, timezone
        return await self.update(user_id, {"last_login": datetime.now(timezone.utc)})
