"""Contact submission model."""
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from datetime import datetime, timezone
from typing import Optional
import uuid


class ContactSubmission(BaseModel):
    """Contact form submission model."""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    service: Optional[str] = None
    message: str = Field(..., min_length=10, max_length=2000)
    budget: Optional[str] = None
    timeline: Optional[str] = None
    status: str = Field(default="new")  # new, read, replied, archived
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ip_address: Optional[str] = None
