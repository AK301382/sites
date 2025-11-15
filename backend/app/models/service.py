"""Service inquiry and consultation models."""
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from datetime import datetime, timezone
from typing import Optional
import uuid


class ServiceInquiry(BaseModel):
    """Service inquiry model."""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    service_type: str = Field(..., description="Type of service interested in")
    message: str = Field(..., min_length=10, max_length=2000)
    budget_range: Optional[str] = None
    timeline: Optional[str] = None
    status: str = Field(default="new")  # new, contacted, quoted, closed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ip_address: Optional[str] = None


class ConsultationBooking(BaseModel):
    """Consultation booking model."""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    service_interested: str = Field(..., description="Service they're interested in")
    preferred_date: str = Field(..., description="Preferred consultation date")
    preferred_time: str = Field(..., description="Preferred consultation time")
    message: Optional[str] = Field(None, max_length=1000)
    status: str = Field(default="pending")  # pending, confirmed, completed, cancelled
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ip_address: Optional[str] = None
