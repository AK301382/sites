"""Account API endpoints for team member management."""
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.schemas.account import (
    AccountInvite,
    AccountAcceptInvitation,
    AccountLogin,
    AccountUpdate,
    AccountRoleUpdate,
    AccountPermissionsUpdate,
    AccountResponse,
    AccountLoginResponse,
    AccountListResponse,
)
from app.services.account_service import AccountService
from app.api.deps import get_database, get_current_customer, get_current_account
from app.core.security import create_access_token
from app.models.customer import CustomerModel
from app.models.account import AccountModel

router = APIRouter()


@router.post("/invite", response_model=AccountResponse, status_code=status.HTTP_201_CREATED)
async def invite_account(
    invite_data: AccountInvite,
    current_customer: CustomerModel = Depends(get_current_customer),
    current_account: AccountModel = Depends(get_current_account),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Invite a new team member to the customer account.
    
    Requires:
    - can_invite_users permission
    
    Sends invitation email with token.
    """
    service = AccountService(db)
    account = await service.invite_account(
        current_customer.id,
        current_account.id,
        invite_data
    )
    return account


@router.post("/accept-invitation", response_model=AccountResponse)
async def accept_invitation(
    invitation_data: AccountAcceptInvitation,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Accept team invitation and activate account.
    
    Requires:
    - Valid invitation token
    - Password meeting requirements
    """
    service = AccountService(db)
    account = await service.accept_invitation(
        invitation_data.invitation_token,
        invitation_data.password
    )
    return account


@router.post("/login", response_model=AccountLoginResponse)
async def login_account(
    credentials: AccountLogin,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Authenticate an account (team member) and return access token.
    
    Returns:
    - JWT access token
    - Account profile data
    """
    service = AccountService(db)
    account = await service.authenticate_account(
        credentials.email,
        credentials.password
    )
    
    # Create access token
    access_token = create_access_token(
        data={
            "sub": account.id,
            "email": account.email,
            "customer_id": account.customer_id,
            "type": "account"
        }
    )
    
    return AccountLoginResponse(
        access_token=access_token,
        token_type="bearer",
        account=account
    )


@router.get("/me", response_model=AccountResponse)
async def get_current_account_profile(
    current_account: AccountModel = Depends(get_current_account)
):
    """
    Get current authenticated account profile.
    """
    return current_account


@router.put("/me", response_model=AccountResponse)
async def update_account_profile(
    update_data: AccountUpdate,
    current_account: AccountModel = Depends(get_current_account),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Update current account profile.
    """
    service = AccountService(db)
    updated_account = await service.update_account(
        current_account.id,
        update_data
    )
    return updated_account


@router.get("/", response_model=AccountListResponse)
async def list_accounts(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    current_customer: CustomerModel = Depends(get_current_customer),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    List all accounts for the current customer.
    
    Supports pagination.
    """
    service = AccountService(db)
    accounts, total = await service.list_accounts(
        current_customer.id,
        page,
        page_size
    )
    
    return AccountListResponse(
        accounts=accounts,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/{account_id}", response_model=AccountResponse)
async def get_account(
    account_id: str,
    current_customer: CustomerModel = Depends(get_current_customer),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Get specific account by ID.
    
    Account must belong to current customer.
    """
    service = AccountService(db)
    account = await service.get_account(account_id)
    
    # Verify account belongs to current customer
    if account.customer_id != current_customer.id:
        from app.core.exceptions import PermissionDeniedException
        raise PermissionDeniedException("Access denied to this account")
    
    return account


@router.put("/{account_id}/role", response_model=AccountResponse)
async def update_account_role(
    account_id: str,
    role_data: AccountRoleUpdate,
    current_account: AccountModel = Depends(get_current_account),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Update account role.
    
    Requires:
    - can_manage_roles permission
    """
    service = AccountService(db)
    updated_account = await service.update_role(
        account_id,
        role_data.role,
        current_account.id
    )
    return updated_account


@router.put("/{account_id}/permissions", response_model=AccountResponse)
async def update_account_permissions(
    account_id: str,
    permissions_data: AccountPermissionsUpdate,
    current_account: AccountModel = Depends(get_current_account),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Update account permissions.
    
    Requires:
    - can_manage_roles permission
    """
    service = AccountService(db)
    updated_account = await service.update_permissions(
        account_id,
        permissions_data.permissions,
        current_account.id
    )
    return updated_account


@router.delete("/{account_id}/deactivate")
async def deactivate_account(
    account_id: str,
    current_account: AccountModel = Depends(get_current_account),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Deactivate account.
    
    Requires:
    - can_manage_users permission
    """
    service = AccountService(db)
    success = await service.deactivate_account(
        account_id,
        current_account.id
    )
    
    if success:
        return {"message": "Account deactivated successfully"}
    else:
        from app.core.exceptions import DatabaseException
        raise DatabaseException("Failed to deactivate account")


@router.delete("/{account_id}")
async def delete_account(
    account_id: str,
    current_account: AccountModel = Depends(get_current_account),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Delete account permanently.
    
    Requires:
    - Owner role
    """
    service = AccountService(db)
    success = await service.delete_account(
        account_id,
        current_account.id
    )
    
    if success:
        return {"message": "Account deleted successfully"}
    else:
        from app.core.exceptions import DatabaseException
        raise DatabaseException("Failed to delete account")
