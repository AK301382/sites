"""Account schemas for API contracts."""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, validator
from app.models.account import AccountRole, AccountStatus, AccountPermissions


# ============= Request Schemas =============

class AccountInvite(BaseModel):
    """Schema for inviting a new account."""
    email: EmailStr = Field(description="Account email")
    full_name: str = Field(
        min_length=2,
        max_length=100,
        description="Full name"
    )
    role: AccountRole = Field(
        default=AccountRole.MEMBER,
        description="Account role"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "jane@company.com",
                "full_name": "Jane Smith",
                "role": "member"
            }
        }


class AccountAcceptInvitation(BaseModel):
    """Schema for accepting an invitation."""
    invitation_token: str = Field(description="Invitation token")
    password: str = Field(
        min_length=8,
        description="Password (min 8 characters)"
    )
    
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


class AccountLogin(BaseModel):
    """Schema for account login."""
    email: EmailStr = Field(description="Account email")
    password: str = Field(description="Account password")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "jane@company.com",
                "password": "SecurePass123"
            }
        }


class AccountUpdate(BaseModel):
    """Schema for account profile update."""
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "full_name": "Jane Smith",
                "phone": "+1234567890",
                "bio": "Marketing Manager"
            }
        }


class AccountRoleUpdate(BaseModel):
    """Schema for updating account role."""
    role: AccountRole = Field(description="New role")
    
    class Config:
        json_schema_extra = {
            "example": {
                "role": "admin"
            }
        }


class AccountPermissionsUpdate(BaseModel):
    """Schema for updating account permissions."""
    permissions: AccountPermissions = Field(description="Updated permissions")
    
    class Config:
        json_schema_extra = {
            "example": {
                "permissions": {
                    "can_view_portfolio": True,
                    "can_create_portfolio": True,
                    "can_edit_portfolio": True
                }
            }
        }


# ============= Response Schemas =============

class AccountResponse(BaseModel):
    """Schema for account response (without sensitive data)."""
    id: str
    customer_id: str
    email: EmailStr
    full_name: str
    role: AccountRole
    permissions: AccountPermissions
    status: AccountStatus
    is_active: bool
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    invited_by: Optional[str] = None
    invitation_sent_at: Optional[datetime] = None
    invitation_accepted_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
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


class AccountLoginResponse(BaseModel):
    """Schema for account login response."""
    access_token: str = Field(description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    account: AccountResponse = Field(description="Account data")
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "account": {
                    "id": "660e8400-e29b-41d4-a716-446655440001",
                    "email": "jane@company.com",
                    "full_name": "Jane Smith"
                }
            }
        }


class AccountListResponse(BaseModel):
    """Schema for paginated account list."""
    accounts: List[AccountResponse]
    total: int
    page: int
    page_size: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "accounts": [],
                "total": 0,
                "page": 1,
                "page_size": 10
            }
        }
