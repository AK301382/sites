"""Admin user schemas."""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class LoginRequest(BaseModel):
    """Schema for login request."""
    username: str
    password: str


class TokenResponse(BaseModel):
    """Schema for token response."""
    access_token: str
    token_type: str = "bearer"
    user: Optional[dict] = None


class AdminUserCreate(BaseModel):
    """Schema for creating an admin user."""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None
    role: str = Field(default="admin")


class AdminUserResponse(BaseModel):
    """Schema for admin user response."""
    id: str
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None
