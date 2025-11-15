"""Shared API dependencies."""
from fastapi import Depends, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_database
from app.repositories import (
    UserRepository,
    CustomerRepository,
    AccountRepository,
    ContactRepository,
    NewsletterRepository,
    PortfolioRepository,
    BlogRepository,
    ServiceRepository,
)
from app.services import (
    UserService,
    CustomerService,
    AccountService,
    ContactService,
    NewsletterService,
    PortfolioService,
    BlogService,
    ServiceInquiryService,
    AuthService,
)
from app.core.security import password_handler, jwt_handler


# Repository Dependencies
def get_user_repository(db: AsyncIOMotorDatabase = Depends(get_database)) -> UserRepository:
    """Get user repository instance."""
    return UserRepository(db)


def get_customer_repository(db: AsyncIOMotorDatabase = Depends(get_database)) -> CustomerRepository:
    """Get customer repository instance."""
    return CustomerRepository(db)


def get_account_repository(db: AsyncIOMotorDatabase = Depends(get_database)) -> AccountRepository:
    """Get account repository instance."""
    return AccountRepository(db)


def get_contact_repository(db: AsyncIOMotorDatabase = Depends(get_database)) -> ContactRepository:
    """Get contact repository instance."""
    return ContactRepository(db)


def get_newsletter_repository(db: AsyncIOMotorDatabase = Depends(get_database)) -> NewsletterRepository:
    """Get newsletter repository instance."""
    return NewsletterRepository(db)


def get_portfolio_repository(db: AsyncIOMotorDatabase = Depends(get_database)) -> PortfolioRepository:
    """Get portfolio repository instance."""
    return PortfolioRepository(db)


def get_blog_repository(db: AsyncIOMotorDatabase = Depends(get_database)) -> BlogRepository:
    """Get blog repository instance."""
    return BlogRepository(db)


def get_service_inquiry_repository(db: AsyncIOMotorDatabase = Depends(get_database)) -> ServiceRepository:
    """Get service inquiry repository instance."""
    return ServiceRepository(db)


def get_consultation_repository(db: AsyncIOMotorDatabase = Depends(get_database)) -> ServiceRepository:
    """Get consultation repository instance."""
    return ServiceRepository(db)


# Service Dependencies
def get_user_service(repo: UserRepository = Depends(get_user_repository)) -> UserService:
    """Get user service instance."""
    return UserService(repo)


def get_customer_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> CustomerService:
    """Get customer service instance."""
    return CustomerService(db)


def get_account_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> AccountService:
    """Get account service instance."""
    return AccountService(db)


def get_contact_service(repo: ContactRepository = Depends(get_contact_repository)) -> ContactService:
    """Get contact service instance."""
    return ContactService(repo)


def get_newsletter_service(repo: NewsletterRepository = Depends(get_newsletter_repository)) -> NewsletterService:
    """Get newsletter service instance."""
    return NewsletterService(repo)


def get_portfolio_service(repo: PortfolioRepository = Depends(get_portfolio_repository)) -> PortfolioService:
    """Get portfolio service instance."""
    return PortfolioService(repo)


def get_blog_service(repo: BlogRepository = Depends(get_blog_repository)) -> BlogService:
    """Get blog service instance."""
    return BlogService(repo)


def get_service_inquiry_service(
    inquiry_repo: ServiceRepository = Depends(get_service_inquiry_repository),
    consultation_repo: ServiceRepository = Depends(get_consultation_repository)
) -> ServiceInquiryService:
    """Get service inquiry service instance."""
    return ServiceInquiryService(inquiry_repo, consultation_repo)


def get_auth_service(
    user_service: UserService = Depends(get_user_service),
    account_service: AccountService = Depends(get_account_service)
) -> AuthService:
    """Get auth service instance."""
    return AuthService(user_service, account_service, password_handler, jwt_handler)


# Utility Dependencies
def get_client_ip(request: Request) -> str:
    """Get client IP address from request."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0]
    return request.client.host if request.client else "unknown"


# Authentication Dependencies
from fastapi import HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from config.settings import settings

security = HTTPBearer()


async def get_current_customer(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get current authenticated customer from JWT token."""
    token = credentials.credentials
    
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        user_id: str = payload.get("sub")
        user_type: str = payload.get("type")
        
        if not user_id or user_type != "customer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get customer from database
        from app.repositories.customer_repository import CustomerRepository
        customer_repo = CustomerRepository(db)
        customer = await customer_repo.find_by_id(user_id)
        
        if not customer:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Customer not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not customer.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Customer account is deactivated",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return customer
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_account(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get current authenticated account (team member) from JWT token."""
    token = credentials.credentials
    
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        user_id: str = payload.get("sub")
        user_type: str = payload.get("type")
        
        if not user_id or user_type != "account":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get account from database
        from app.repositories.account_repository import AccountRepository
        account_repo = AccountRepository(db)
        account = await account_repo.find_by_id(user_id)
        
        if not account:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not account.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return account
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )