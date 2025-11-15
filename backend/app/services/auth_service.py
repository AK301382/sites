"""Authentication service - Business logic for authentication and authorization."""
from datetime import datetime, timedelta, timezone
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class AuthService:
    """Service for handling authentication."""
    
    def __init__(self, user_service, account_service, password_handler, jwt_handler):
        self.user_service = user_service
        self.account_service = account_service
        self.password_handler = password_handler
        self.jwt_handler = jwt_handler
    
    async def authenticate_admin(self, username: str, password: str) -> Optional[dict]:
        """Authenticate an admin user."""
        # Find user by username
        user = await self.user_service.get_user_by_username(username)
        if not user:
            logger.warning(f"Failed admin login attempt: username '{username}' not found")
            return None
        
        # Verify password
        if not self.password_handler.verify_password(password, user.hashed_password):
            logger.warning(f"Failed admin login attempt: incorrect password for '{username}'")
            return None
        
        # Check if user is active
        if not user.is_active:
            logger.warning(f"Failed admin login attempt: user '{username}' is inactive")
            return None
        
        # Update last login
        await self.user_service.update_last_login(user.id)
        
        # Generate token
        token_data = {
            "sub": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "type": "admin"
        }
        access_token = self.jwt_handler.create_access_token(token_data)
        
        logger.info(f"Admin login successful: {username}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role
            }
        }
    
    async def authenticate_customer(self, username: str, password: str) -> Optional[dict]:
        """Authenticate a customer account."""
        # Find account by username
        account = await self.account_service.get_account_by_username(username)
        if not account:
            logger.warning(f"Failed customer login attempt: username '{username}' not found")
            return None
        
        # Verify password
        if not self.password_handler.verify_password(password, account.hashed_password):
            logger.warning(f"Failed customer login attempt: incorrect password for '{username}'")
            return None
        
        # Check if account is active
        if not account.is_active:
            logger.warning(f"Failed customer login attempt: account '{username}' is inactive")
            return None
        
        # Update last login
        await self.account_service.update_last_login(account.id)
        
        # Generate token
        token_data = {
            "sub": account.id,
            "username": account.username,
            "email": account.email,
            "customer_id": account.customer_id,
            "role": account.role,
            "type": "customer"
        }
        access_token = self.jwt_handler.create_access_token(token_data)
        
        logger.info(f"Customer login successful: {username}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": account.id,
                "username": account.username,
                "email": account.email,
                "full_name": account.full_name,
                "customer_id": account.customer_id,
                "role": account.role
            }
        }
    
    def verify_token(self, token: str) -> Optional[dict]:
        """Verify and decode a JWT token."""
        return self.jwt_handler.decode_token(token)
    
    async def get_current_user(self, token: str) -> Optional[dict]:
        """Get current user from token."""
        payload = self.verify_token(token)
        if not payload:
            return None
        
        user_type = payload.get('type')
        user_id = payload.get('sub')
        
        if user_type == 'admin':
            user = await self.user_service.get_user_by_id(user_id)
            if user:
                return {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "type": "admin"
                }
        elif user_type == 'customer':
            account = await self.account_service.get_account_by_id(user_id)
            if account:
                return {
                    "id": account.id,
                    "username": account.username,
                    "email": account.email,
                    "customer_id": account.customer_id,
                    "role": account.role,
                    "type": "customer"
                }
        
        return None
