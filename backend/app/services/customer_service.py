"""Customer service for business logic."""
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
import secrets
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.repositories.customer_repository import CustomerRepository
from app.models.customer import CustomerModel, SubscriptionPlan, SubscriptionStatus
from app.schemas.customer import CustomerRegister, CustomerUpdate
from app.core.security import password_handler
from app.core.exceptions import (
    ValidationException,
    NotFoundException,
    DuplicateException,
    AuthenticationException
)


class CustomerService:
    """Service for customer business logic."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.repository = CustomerRepository(db)
    
    async def register_customer(self, customer_data: CustomerRegister) -> CustomerModel:
        """Register a new customer."""
        # Check if email already exists
        existing = await self.repository.find_by_email(customer_data.email)
        if existing:
            raise DuplicateException("Email already registered")
        
        # Hash password
        password_hash = password_handler.hash_password(customer_data.password)
        
        # Generate verification token
        verification_token = secrets.token_urlsafe(32)
        
        # Set trial end date (14 days from now)
        trial_end_date = datetime.utcnow() + timedelta(days=14)
        
        # Create customer
        customer_dict = {
            "email": customer_data.email.lower(),
            "password_hash": password_hash,
            "company_name": customer_data.company_name,
            "contact_name": customer_data.contact_name,
            "phone": customer_data.phone,
            "website": customer_data.website,
            "verification_token": verification_token,
            "trial_end_date": trial_end_date,
            "subscription_plan": SubscriptionPlan.FREE,
            "subscription_status": SubscriptionStatus.TRIAL,
        }
        
        customer = await self.repository.create(customer_dict)
        
        # TODO: Send verification email
        # await self.send_verification_email(customer.email, verification_token)
        
        return customer
    
    async def authenticate_customer(self, email: str, password: str) -> CustomerModel:
        """Authenticate customer and return customer object."""
        # Find customer
        customer = await self.repository.find_by_email(email)
        if not customer:
            raise AuthenticationException("Invalid email or password")
        
        # Check if customer is active
        if not customer.is_active:
            raise AuthenticationException("Account is deactivated")
        
        # Verify password
        if not password_handler.verify_password(password, customer.password_hash):
            raise AuthenticationException("Invalid email or password")
        
        # Update last login
        await self.repository.update_last_login(customer.id)
        
        return customer
    
    async def get_customer(self, customer_id: str) -> CustomerModel:
        """Get customer by ID."""
        customer = await self.repository.find_by_id(customer_id)
        if not customer:
            raise NotFoundException("Customer not found")
        return customer
    
    async def update_customer(self, customer_id: str, update_data: CustomerUpdate) -> CustomerModel:
        """Update customer profile."""
        customer = await self.get_customer(customer_id)
        
        # Update only provided fields
        update_dict = update_data.model_dump(exclude_unset=True)
        
        updated_customer = await self.repository.update(customer_id, update_dict)
        if not updated_customer:
            raise NotFoundException("Customer not found")
        
        return updated_customer
    
    async def change_password(self, customer_id: str, current_password: str, new_password: str) -> bool:
        """Change customer password."""
        customer = await self.get_customer(customer_id)
        
        # Verify current password
        if not password_handler.verify_password(current_password, customer.password_hash):
            raise AuthenticationException("Current password is incorrect")
        
        # Hash new password
        new_password_hash = password_handler.hash_password(new_password)
        
        # Update password
        await self.repository.update(customer_id, {"password_hash": new_password_hash})
        
        return True
    
    async def verify_email(self, verification_token: str) -> CustomerModel:
        """Verify customer email using token."""
        # Find customer by verification token
        customers = await self.repository.list_customers(
            filters={"verification_token": verification_token}
        )
        
        if not customers[0]:
            raise NotFoundException("Invalid verification token")
        
        customer = customers[0][0]
        
        # Mark as verified
        verified_customer = await self.repository.verify_email(customer.id)
        if not verified_customer:
            raise NotFoundException("Customer not found")
        
        return verified_customer
    
    async def update_subscription(
        self,
        customer_id: str,
        plan: SubscriptionPlan,
        status: SubscriptionStatus
    ) -> CustomerModel:
        """Update customer subscription."""
        customer = await self.get_customer(customer_id)
        
        # Set subscription dates
        start_date = datetime.utcnow()
        end_date = None
        
        if plan != SubscriptionPlan.FREE:
            # Set end date based on plan (1 month for now)
            end_date = start_date + timedelta(days=30)
        
        updated_customer = await self.repository.update_subscription(
            customer_id,
            plan,
            status,
            start_date,
            end_date
        )
        
        if not updated_customer:
            raise NotFoundException("Customer not found")
        
        return updated_customer
    
    async def deactivate_customer(self, customer_id: str) -> bool:
        """Deactivate customer account."""
        customer = await self.get_customer(customer_id)
        return await self.repository.deactivate(customer_id)
    
    async def list_customers(
        self,
        page: int = 1,
        page_size: int = 10,
        filters: Optional[Dict[str, Any]] = None
    ) -> tuple[List[CustomerModel], int]:
        """List customers with pagination."""
        skip = (page - 1) * page_size
        return await self.repository.list_customers(skip, page_size, filters)
    
    async def get_dashboard_stats(self, customer_id: str) -> Dict[str, Any]:
        """Get customer dashboard statistics."""
        customer = await self.get_customer(customer_id)
        
        # TODO: Add more stats from other collections
        # - Total portfolio items
        # - Total blog posts
        # - Total contacts/inquiries
        # - Account count
        
        return {
            "customer": customer,
            "subscription_plan": customer.subscription_plan,
            "subscription_status": customer.subscription_status,
            "trial_days_remaining": self._calculate_trial_days_remaining(customer),
            "account_created_days_ago": (datetime.utcnow() - customer.created_at).days,
        }
    
    def _calculate_trial_days_remaining(self, customer: CustomerModel) -> Optional[int]:
        """Calculate remaining trial days."""
        if customer.subscription_status != SubscriptionStatus.TRIAL:
            return None
        
        if not customer.trial_end_date:
            return None
        
        delta = customer.trial_end_date - datetime.utcnow()
        return max(0, delta.days)
