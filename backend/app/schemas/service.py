"""Service inquiry and consultation schemas."""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class ServiceInquiryCreate(BaseModel):
    """Schema for creating a service inquiry."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    service_type: str
    message: str = Field(..., min_length=10, max_length=2000)
    budget_range: Optional[str] = None
    timeline: Optional[str] = None


class ServiceInquiryResponse(BaseModel):
    """Schema for service inquiry response."""
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    service_type: str
    message: str
    budget_range: Optional[str] = None
    timeline: Optional[str] = None
    status: str
    created_at: datetime


class ConsultationBookingCreate(BaseModel):
    """Schema for creating a consultation booking."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    service_interested: str
    preferred_date: str
    preferred_time: str
    message: Optional[str] = Field(None, max_length=1000)


class ConsultationBookingResponse(BaseModel):
    """Schema for consultation booking response."""
    id: str
    name: str
    email: EmailStr
    phone: str
    company: Optional[str] = None
    service_interested: str
    preferred_date: str
    preferred_time: str
    message: Optional[str] = None
    status: str
    created_at: datetime
