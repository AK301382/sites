"""Contact form schemas."""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class ContactCreate(BaseModel):
    """Schema for creating a contact submission."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    service: Optional[str] = None
    message: str = Field(..., min_length=10, max_length=2000)
    budget: Optional[str] = None
    timeline: Optional[str] = None


class ContactResponse(BaseModel):
    """Schema for contact submission response."""
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    service: Optional[str] = None
    message: str
    budget: Optional[str] = None
    timeline: Optional[str] = None
    status: str
    created_at: datetime
