"""Customer model for multi-tenant customer management."""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr
from enum import Enum


class SubscriptionPlan(str, Enum):
    """Available subscription plans."""
    FREE = "free"
    BASIC = "basic"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class SubscriptionStatus(str, Enum):
    """Subscription status."""
    ACTIVE = "active"
    INACTIVE = "inactive"
    CANCELLED = "cancelled"
    TRIAL = "trial"
    PAST_DUE = "past_due"


class CustomerModel(BaseModel):
    """Customer database model."""
    id: str = Field(description="Customer unique identifier (UUID)")
    email: EmailStr = Field(description="Customer email address")
    password_hash: str = Field(description="Hashed password")
    company_name: str = Field(description="Company name")
    
    # Contact Information
    contact_name: str = Field(description="Primary contact person name")
    phone: Optional[str] = Field(None, description="Contact phone number")
    website: Optional[str] = Field(None, description="Company website")
    
    # Address Information
    address: Optional[str] = Field(None, description="Street address")
    city: Optional[str] = Field(None, description="City")
    state: Optional[str] = Field(None, description="State/Province")
    country: Optional[str] = Field(None, description="Country")
    postal_code: Optional[str] = Field(None, description="Postal/ZIP code")
    
    # Subscription Information
    subscription_plan: SubscriptionPlan = Field(
        default=SubscriptionPlan.FREE,
        description="Current subscription plan"
    )
    subscription_status: SubscriptionStatus = Field(
        default=SubscriptionStatus.TRIAL,
        description="Current subscription status"
    )
    subscription_start_date: Optional[datetime] = Field(
        None,
        description="Subscription start date"
    )
    subscription_end_date: Optional[datetime] = Field(
        None,
        description="Subscription end date"
    )
    trial_end_date: Optional[datetime] = Field(
        None,
        description="Trial period end date"
    )
    
    # Account Status
    is_active: bool = Field(default=True, description="Account active status")
    is_verified: bool = Field(default=False, description="Email verification status")
    verification_token: Optional[str] = Field(
        None,
        description="Email verification token"
    )
    
    # Metadata
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Customer creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp"
    )
    last_login: Optional[datetime] = Field(
        None,
        description="Last login timestamp"
    )
    
    # Settings
    settings: dict = Field(
        default_factory=dict,
        description="Customer-specific settings"
    )
    
    # Notes (for internal use)
    notes: Optional[str] = Field(None, description="Internal notes")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "john@company.com",
                "company_name": "ACME Corporation",
                "contact_name": "John Doe",
                "phone": "+1234567890",
                "subscription_plan": "pro",
                "subscription_status": "active",
                "is_active": True,
                "is_verified": True
            }
        }
