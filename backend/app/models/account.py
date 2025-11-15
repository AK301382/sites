"""Account model for customer team member management."""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr
from enum import Enum


class AccountRole(str, Enum):
    """Available account roles."""
    OWNER = "owner"  # Full access, can delete customer account
    ADMIN = "admin"  # Full access except deleting customer
    MEMBER = "member"  # Standard access
    VIEWER = "viewer"  # Read-only access


class AccountStatus(str, Enum):
    """Account status."""
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"  # Invitation sent but not accepted
    SUSPENDED = "suspended"


class AccountPermissions(BaseModel):
    """Granular permissions for account."""
    # Portfolio permissions
    can_view_portfolio: bool = Field(default=True)
    can_create_portfolio: bool = Field(default=False)
    can_edit_portfolio: bool = Field(default=False)
    can_delete_portfolio: bool = Field(default=False)
    
    # Blog permissions
    can_view_blog: bool = Field(default=True)
    can_create_blog: bool = Field(default=False)
    can_edit_blog: bool = Field(default=False)
    can_delete_blog: bool = Field(default=False)
    
    # Service permissions
    can_view_services: bool = Field(default=True)
    can_manage_services: bool = Field(default=False)
    
    # Contact & Newsletter permissions
    can_view_contacts: bool = Field(default=False)
    can_export_contacts: bool = Field(default=False)
    can_view_newsletter: bool = Field(default=False)
    
    # Account management permissions
    can_invite_users: bool = Field(default=False)
    can_manage_users: bool = Field(default=False)
    can_manage_roles: bool = Field(default=False)
    
    # Settings permissions
    can_view_settings: bool = Field(default=True)
    can_edit_settings: bool = Field(default=False)
    
    # Billing permissions
    can_view_billing: bool = Field(default=False)
    can_manage_billing: bool = Field(default=False)


class AccountModel(BaseModel):
    """Account database model - represents a team member in a customer account."""
    id: str = Field(description="Account unique identifier (UUID)")
    customer_id: str = Field(description="Parent customer ID")
    
    # User Information
    email: EmailStr = Field(description="Account email address")
    password_hash: Optional[str] = Field(
        None,
        description="Hashed password (None for pending invitations)"
    )
    full_name: str = Field(description="User full name")
    
    # Role & Permissions
    role: AccountRole = Field(
        default=AccountRole.MEMBER,
        description="Account role"
    )
    permissions: AccountPermissions = Field(
        default_factory=AccountPermissions,
        description="Granular permissions"
    )
    
    # Status
    status: AccountStatus = Field(
        default=AccountStatus.PENDING,
        description="Account status"
    )
    is_active: bool = Field(default=True, description="Active status")
    
    # Invitation
    invitation_token: Optional[str] = Field(
        None,
        description="Invitation token for pending accounts"
    )
    invited_by: Optional[str] = Field(
        None,
        description="Account ID of inviter"
    )
    invitation_sent_at: Optional[datetime] = Field(
        None,
        description="Invitation sent timestamp"
    )
    invitation_accepted_at: Optional[datetime] = Field(
        None,
        description="Invitation accepted timestamp"
    )
    
    # Metadata
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Account creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp"
    )
    last_login: Optional[datetime] = Field(
        None,
        description="Last login timestamp"
    )
    
    # Profile
    avatar_url: Optional[str] = Field(None, description="Profile avatar URL")
    bio: Optional[str] = Field(None, description="User bio")
    phone: Optional[str] = Field(None, description="Phone number")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "660e8400-e29b-41d4-a716-446655440001",
                "customer_id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "jane@company.com",
                "full_name": "Jane Smith",
                "role": "admin",
                "status": "active",
                "is_active": True
            }
        }
