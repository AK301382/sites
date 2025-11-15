"""Customer schemas for API contracts."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, validator
from app.models.customer import SubscriptionPlan, SubscriptionStatus


# ============= Request Schemas =============

class CustomerRegister(BaseModel):
    """Schema for customer registration."""
    email: EmailStr = Field(description="Customer email")
    password: str = Field(
        min_length=8,
        description="Password (min 8 characters)"
    )
    company_name: str = Field(
        min_length=2,
        max_length=100,
        description="Company name"
    )
    contact_name: str = Field(
        min_length=2,
        max_length=100,
        description="Primary contact name"
    )
    phone: Optional[str] = Field(None, description="Contact phone")
    website: Optional[str] = Field(None, description="Company website")
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one number')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "john@company.com",
                "password": "SecurePass123",
                "company_name": "ACME Corp",
                "contact_name": "John Doe",
                "phone": "+1234567890",
                "website": "https://acme.com"
            }
        }


class CustomerLogin(BaseModel):
    """Schema for customer login."""
    email: EmailStr = Field(description="Customer email")
    password: str = Field(description="Customer password")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "john@company.com",
                "password": "SecurePass123"
            }
        }


class CustomerUpdate(BaseModel):
    """Schema for customer profile update."""
    company_name: Optional[str] = Field(None, min_length=2, max_length=100)
    contact_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "company_name": "ACME Corporation",
                "contact_name": "John Doe",
                "phone": "+1234567890",
                "city": "San Francisco",
                "country": "USA"
            }
        }


class CustomerPasswordChange(BaseModel):
    """Schema for password change."""
    current_password: str = Field(description="Current password")
    new_password: str = Field(
        min_length=8,
        description="New password (min 8 characters)"
    )
    
    @validator('new_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one number')
        return v


# ============= Response Schemas =============

class CustomerResponse(BaseModel):
    """Schema for customer response (without sensitive data)."""
    id: str
    email: EmailStr
    company_name: str
    contact_name: str
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    subscription_plan: SubscriptionPlan
    subscription_status: SubscriptionStatus
    subscription_start_date: Optional[datetime] = None
    subscription_end_date: Optional[datetime] = None
    trial_end_date: Optional[datetime] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "john@company.com",
                "company_name": "ACME Corp",
                "contact_name": "John Doe",
                "subscription_plan": "pro",
                "subscription_status": "active",
                "is_active": True,
                "is_verified": True
            }
        }


class CustomerLoginResponse(BaseModel):
    """Schema for customer login response."""
    access_token: str = Field(description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    customer: CustomerResponse = Field(description="Customer data")
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "customer": {
                    "id": "550e8400-e29b-41d4-a716-446655440000",
                    "email": "john@company.com",
                    "company_name": "ACME Corp"
                }
            }
        }
