"""FastAPI dependencies for dependency injection."""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from app.core.security import jwt_handler
import logging

logger = logging.getLogger(__name__)

# Security scheme
security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current authenticated user from JWT token."""
    token = credentials.credentials
    payload = jwt_handler.decode_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return payload


async def get_current_admin_user(current_user: dict = Depends(get_current_user)) -> dict:
    """Verify that the current user is an admin."""
    if current_user.get("type") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


async def get_current_customer_user(current_user: dict = Depends(get_current_user)) -> dict:
    """Verify that the current user is a customer."""
    if current_user.get("type") != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer access required"
        )
    return current_user


async def get_optional_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[dict]:
    """Get current user if authenticated, otherwise None."""
    if not credentials:
        return None
    
    token = credentials.credentials
    payload = jwt_handler.decode_token(token)
    return payload
