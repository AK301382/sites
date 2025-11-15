"""User models (admin and customer users)."""
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from datetime import datetime, timezone
from typing import Optional
import uuid


class AdminUser(BaseModel):
    """Admin user model."""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    hashed_password: str
    full_name: Optional[str] = None
    role: str = Field(default="admin")  # admin, super_admin
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_login: Optional[datetime] = None
