"""Account service for business logic."""
from typing import Optional, Dict, Any, List
import secrets
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.repositories.account_repository import AccountRepository
from app.repositories.customer_repository import CustomerRepository
from app.models.account import AccountModel, AccountRole, AccountStatus, AccountPermissions
from app.schemas.account import AccountInvite, AccountUpdate, AccountRoleUpdate
from app.core.security import password_handler
from app.core.exceptions import (
    ValidationException,
    NotFoundException,
    DuplicateException,
    AuthenticationException,
    PermissionDeniedException
)


class AccountService:
    """Service for account (team member) business logic."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.repository = AccountRepository(db)
        self.customer_repository = CustomerRepository(db)
    
    def _get_role_permissions(self, role: AccountRole) -> AccountPermissions:
        """Get default permissions based on role."""
        if role == AccountRole.OWNER:
            # Owner has all permissions
            return AccountPermissions(
                can_view_portfolio=True,
                can_create_portfolio=True,
                can_edit_portfolio=True,
                can_delete_portfolio=True,
                can_view_blog=True,
                can_create_blog=True,
                can_edit_blog=True,
                can_delete_blog=True,
                can_view_services=True,
                can_manage_services=True,
                can_view_contacts=True,
                can_export_contacts=True,
                can_view_newsletter=True,
                can_invite_users=True,
                can_manage_users=True,
                can_manage_roles=True,
                can_view_settings=True,
                can_edit_settings=True,
                can_view_billing=True,
                can_manage_billing=True,
            )
        elif role == AccountRole.ADMIN:
            # Admin has most permissions except billing
            return AccountPermissions(
                can_view_portfolio=True,
                can_create_portfolio=True,
                can_edit_portfolio=True,
                can_delete_portfolio=True,
                can_view_blog=True,
                can_create_blog=True,
                can_edit_blog=True,
                can_delete_blog=True,
                can_view_services=True,
                can_manage_services=True,
                can_view_contacts=True,
                can_export_contacts=True,
                can_view_newsletter=True,
                can_invite_users=True,
                can_manage_users=True,
                can_manage_roles=False,
                can_view_settings=True,
                can_edit_settings=True,
                can_view_billing=False,
                can_manage_billing=False,
            )
        elif role == AccountRole.MEMBER:
            # Member has standard access
            return AccountPermissions(
                can_view_portfolio=True,
                can_create_portfolio=True,
                can_edit_portfolio=True,
                can_delete_portfolio=False,
                can_view_blog=True,
                can_create_blog=True,
                can_edit_blog=True,
                can_delete_blog=False,
                can_view_services=True,
                can_manage_services=False,
                can_view_contacts=True,
                can_export_contacts=False,
                can_view_newsletter=True,
                can_invite_users=False,
                can_manage_users=False,
                can_manage_roles=False,
                can_view_settings=True,
                can_edit_settings=False,
                can_view_billing=False,
                can_manage_billing=False,
            )
        else:  # VIEWER
            # Viewer has read-only access
            return AccountPermissions(
                can_view_portfolio=True,
                can_view_blog=True,
                can_view_services=True,
                can_view_contacts=True,
                can_view_newsletter=True,
                can_view_settings=True,
            )
    
    async def invite_account(
        self,
        customer_id: str,
        inviter_account_id: str,
        invite_data: AccountInvite
    ) -> AccountModel:
        """Invite a new account to join customer's team."""
        # Verify customer exists
        customer = await self.customer_repository.find_by_id(customer_id)
        if not customer:
            raise NotFoundException("Customer not found")
        
        # Check if email already exists for this customer
        existing = await self.repository.find_by_email(invite_data.email, customer_id)
        if existing:
            raise DuplicateException("Account with this email already exists for this customer")
        
        # Generate invitation token
        invitation_token = secrets.token_urlsafe(32)
        
        # Get role-based permissions
        permissions = self._get_role_permissions(invite_data.role)
        
        # Create account
        account_dict = {
            "customer_id": customer_id,
            "email": invite_data.email.lower(),
            "full_name": invite_data.full_name,
            "role": invite_data.role,
            "permissions": permissions.model_dump(),
            "invitation_token": invitation_token,
            "invited_by": inviter_account_id,
            "invitation_sent_at": None,  # Will be set when email is sent
            "status": AccountStatus.PENDING,
        }
        
        account = await self.repository.create(account_dict)
        
        # TODO: Send invitation email
        # await self.send_invitation_email(account.email, invitation_token)
        
        return account
    
    async def accept_invitation(self, invitation_token: str, password: str) -> AccountModel:
        """Accept invitation and activate account."""
        # Find account by invitation token
        account = await self.repository.find_by_invitation_token(invitation_token)
        if not account:
            raise NotFoundException("Invalid invitation token")
        
        if account.status != AccountStatus.PENDING:
            raise ValidationException("Invitation already accepted or expired")
        
        # Hash password
        password_hash = password_handler.hash_password(password)
        
        # Accept invitation
        activated_account = await self.repository.accept_invitation(invitation_token, password_hash)
        if not activated_account:
            raise NotFoundException("Account not found")
        
        return activated_account
    
    async def authenticate_account(self, email: str, password: str) -> AccountModel:
        """Authenticate account and return account object."""
        # Find account
        account = await self.repository.find_by_email(email)
        if not account:
            raise AuthenticationException("Invalid email or password")
        
        # Check if account is active
        if not account.is_active or account.status != AccountStatus.ACTIVE:
            raise AuthenticationException("Account is not active")
        
        # Check if password is set
        if not account.password_hash:
            raise AuthenticationException("Please accept your invitation first")
        
        # Verify password
        if not password_handler.verify_password(password, account.password_hash):
            raise AuthenticationException("Invalid email or password")
        
        # Update last login
        await self.repository.update_last_login(account.id)
        
        return account
    
    async def get_account(self, account_id: str) -> AccountModel:
        """Get account by ID."""
        account = await self.repository.find_by_id(account_id)
        if not account:
            raise NotFoundException("Account not found")
        return account
    
    async def get_accounts_by_customer(self, customer_id: str) -> List[AccountModel]:
        """Get all accounts for a customer."""
        return await self.repository.find_by_customer(customer_id)
    
    async def update_account(self, account_id: str, update_data: AccountUpdate) -> AccountModel:
        """Update account profile."""
        account = await self.get_account(account_id)
        
        # Update only provided fields
        update_dict = update_data.model_dump(exclude_unset=True)
        
        updated_account = await self.repository.update(account_id, update_dict)
        if not updated_account:
            raise NotFoundException("Account not found")
        
        return updated_account
    
    async def update_role(
        self,
        account_id: str,
        new_role: AccountRole,
        updater_account_id: str
    ) -> AccountModel:
        """Update account role (requires owner/admin permission)."""
        # Get account to update
        account = await self.get_account(account_id)
        
        # Get updater account
        updater = await self.get_account(updater_account_id)
        
        # Check if updater has permission
        if not updater.permissions.can_manage_roles:
            raise PermissionDeniedException("You don't have permission to change roles")
        
        # Cannot change owner role
        if account.role == AccountRole.OWNER:
            raise PermissionDeniedException("Cannot change owner role")
        
        # Update role and permissions
        permissions = self._get_role_permissions(new_role)
        
        updated_account = await self.repository.update(account_id, {
            "role": new_role,
            "permissions": permissions.model_dump()
        })
        
        if not updated_account:
            raise NotFoundException("Account not found")
        
        return updated_account
    
    async def update_permissions(
        self,
        account_id: str,
        permissions: AccountPermissions,
        updater_account_id: str
    ) -> AccountModel:
        """Update account permissions (requires owner/admin permission)."""
        # Get account to update
        account = await self.get_account(account_id)
        
        # Get updater account
        updater = await self.get_account(updater_account_id)
        
        # Check if updater has permission
        if not updater.permissions.can_manage_roles:
            raise PermissionDeniedException("You don't have permission to change permissions")
        
        # Cannot change owner permissions
        if account.role == AccountRole.OWNER:
            raise PermissionDeniedException("Cannot change owner permissions")
        
        updated_account = await self.repository.update_permissions(
            account_id,
            permissions.model_dump()
        )
        
        if not updated_account:
            raise NotFoundException("Account not found")
        
        return updated_account
    
    async def deactivate_account(self, account_id: str, deactivator_account_id: str) -> bool:
        """Deactivate account (requires admin permission)."""
        # Get account to deactivate
        account = await self.get_account(account_id)
        
        # Get deactivator account
        deactivator = await self.get_account(deactivator_account_id)
        
        # Check if deactivator has permission
        if not deactivator.permissions.can_manage_users:
            raise PermissionDeniedException("You don't have permission to deactivate accounts")
        
        # Cannot deactivate owner
        if account.role == AccountRole.OWNER:
            raise PermissionDeniedException("Cannot deactivate owner account")
        
        return await self.repository.deactivate(account_id)
    
    async def delete_account(self, account_id: str, deleter_account_id: str) -> bool:
        """Delete account permanently (requires owner permission)."""
        # Get account to delete
        account = await self.get_account(account_id)
        
        # Get deleter account
        deleter = await self.get_account(deleter_account_id)
        
        # Only owner can delete accounts
        if deleter.role != AccountRole.OWNER:
            raise PermissionDeniedException("Only owner can delete accounts")
        
        # Cannot delete owner
        if account.role == AccountRole.OWNER:
            raise PermissionDeniedException("Cannot delete owner account")
        
        return await self.repository.delete(account_id)
    
    async def list_accounts(
        self,
        customer_id: str,
        page: int = 1,
        page_size: int = 10,
        filters: Optional[Dict[str, Any]] = None
    ) -> tuple[List[AccountModel], int]:
        """List accounts with pagination."""
        skip = (page - 1) * page_size
        return await self.repository.list_accounts(customer_id, skip, page_size, filters)
