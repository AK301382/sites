"""User service - Business logic for admin user management."""
from app.repositories.user_repository import UserRepository
from app.models.user import AdminUser
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class UserService:
    """Service for handling admin users."""
    
    def __init__(self, repository: UserRepository):
        self.repository = repository
    
    async def create_user(self, data: dict) -> AdminUser:
        """Create a new admin user."""
        # Check if username already exists
        existing_username = await self.repository.find_by_username(data.get('username'))
        if existing_username:
            raise ValueError(f"Username '{data.get('username')}' already exists")
        
        # Check if email already exists
        existing_email = await self.repository.find_by_email(data.get('email'))
        if existing_email:
            raise ValueError(f"Email '{data.get('email')}' already exists")
        
        user = AdminUser(**data)
        result = await self.repository.create(user.model_dump())
        logger.info(f"Admin user created: {result['id']} ({user.username})")
        return AdminUser(**result)
    
    async def get_user_by_id(self, user_id: str) -> Optional[AdminUser]:
        """Get user by ID."""
        result = await self.repository.find_by_id(user_id)
        if result:
            return AdminUser(**result)
        return None
    
    async def get_user_by_username(self, username: str) -> Optional[AdminUser]:
        """Get user by username."""
        result = await self.repository.find_by_username(username)
        if result:
            return AdminUser(**result)
        return None
    
    async def get_user_by_email(self, email: str) -> Optional[AdminUser]:
        """Get user by email."""
        result = await self.repository.find_by_email(email)
        if result:
            return AdminUser(**result)
        return None
    
    async def get_all_users(self, skip: int = 0, limit: int = 50) -> List[AdminUser]:
        """Get all admin users."""
        results = await self.repository.find_many(skip=skip, limit=limit, sort=[("created_at", -1)])
        return [AdminUser(**r) for r in results]
    
    async def update_user(self, user_id: str, update_data: dict) -> Optional[AdminUser]:
        """Update a user."""
        result = await self.repository.update(user_id, update_data)
        if result:
            logger.info(f"User updated: {user_id}")
            return AdminUser(**result)
        return None
    
    async def update_last_login(self, user_id: str) -> Optional[AdminUser]:
        """Update user's last login timestamp."""
        result = await self.repository.update_last_login(user_id)
        if result:
            return AdminUser(**result)
        return None
    
    async def delete_user(self, user_id: str) -> bool:
        """Delete a user."""
        success = await self.repository.delete(user_id)
        if success:
            logger.info(f"User deleted: {user_id}")
        return success
