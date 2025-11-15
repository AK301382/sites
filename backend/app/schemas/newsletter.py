"""Newsletter subscription schemas."""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class NewsletterCreate(BaseModel):
    """Schema for creating a newsletter subscription."""
    email: EmailStr


class NewsletterResponse(BaseModel):
    """Schema for newsletter subscription response."""
    id: str
    email: EmailStr
    status: str
    subscribed_at: datetime
    source: Optional[str] = None
