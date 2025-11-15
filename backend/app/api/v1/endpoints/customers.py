"""Customer API endpoints."""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.schemas.customer import (
    CustomerRegister,
    CustomerLogin,
    CustomerUpdate,
    CustomerPasswordChange,
    CustomerResponse,
    CustomerLoginResponse,
)
from app.services.customer_service import CustomerService
from app.api.deps import get_database, get_current_customer
from app.core.security import create_access_token
from app.models.customer import CustomerModel

router = APIRouter()


@router.post("/register", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
async def register_customer(
    customer_data: CustomerRegister,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Register a new customer account.
    
    Creates a new customer with:
    - Free trial (14 days)
    - Email verification token
    - Hashed password
    """
    service = CustomerService(db)
    customer = await service.register_customer(customer_data)
    return customer


@router.post("/login", response_model=CustomerLoginResponse)
async def login_customer(
    credentials: CustomerLogin,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Authenticate a customer and return access token.
    
    Returns:
    - JWT access token
    - Customer profile data
    """
    service = CustomerService(db)
    customer = await service.authenticate_customer(
        credentials.email,
        credentials.password
    )
    
    # Create access token
    access_token = create_access_token(
        data={
            "sub": customer.id,
            "email": customer.email,
            "type": "customer"
        }
    )
    
    return CustomerLoginResponse(
        access_token=access_token,
        token_type="bearer",
        customer=customer
    )


@router.get("/me", response_model=CustomerResponse)
async def get_current_customer_profile(
    current_customer: CustomerModel = Depends(get_current_customer)
):
    """
    Get current authenticated customer profile.
    """
    return current_customer


@router.put("/me", response_model=CustomerResponse)
async def update_customer_profile(
    update_data: CustomerUpdate,
    current_customer: CustomerModel = Depends(get_current_customer),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Update current customer profile.
    """
    service = CustomerService(db)
    updated_customer = await service.update_customer(
        current_customer.id,
        update_data
    )
    return updated_customer


@router.post("/change-password")
async def change_customer_password(
    password_data: CustomerPasswordChange,
    current_customer: CustomerModel = Depends(get_current_customer),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Change customer password.
    
    Requires current password for verification.
    """
    service = CustomerService(db)
    await service.change_password(
        current_customer.id,
        password_data.current_password,
        password_data.new_password
    )
    return {"message": "Password changed successfully"}


@router.get("/verify-email/{token}")
async def verify_customer_email(
    token: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Verify customer email using verification token.
    """
    service = CustomerService(db)
    customer = await service.verify_email(token)
    return {
        "message": "Email verified successfully",
        "customer_id": customer.id
    }


@router.get("/dashboard/stats")
async def get_customer_dashboard_stats(
    current_customer: CustomerModel = Depends(get_current_customer),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Get dashboard statistics for current customer.
    
    Returns:
    - Subscription info
    - Trial status
    - Usage statistics
    """
    service = CustomerService(db)
    stats = await service.get_dashboard_stats(current_customer.id)
    return stats
