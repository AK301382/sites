"""Authentication endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import LoginRequest, TokenResponse
from app.schemas.common import ErrorResponse
from app.services import AuthService
from app.api.deps import get_auth_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/admin/login",
    response_model=TokenResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Invalid credentials"},
    },
)
async def admin_login(
    credentials: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Admin user login."""
    result = await auth_service.authenticate_admin(
        credentials.username,
        credentials.password
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    return result


@router.post(
    "/customer/login",
    response_model=TokenResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Invalid credentials"},
    },
)
async def customer_login(
    credentials: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Customer account login."""
    result = await auth_service.authenticate_customer(
        credentials.username,
        credentials.password
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    return result
