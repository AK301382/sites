"""Data access layer - Repository pattern."""
from .contact_repository import ContactRepository
from .newsletter_repository import NewsletterRepository
from .portfolio_repository import PortfolioRepository
from .blog_repository import BlogRepository
from .service_repository import ServiceRepository
from .user_repository import UserRepository
from .customer_repository import CustomerRepository
from .account_repository import AccountRepository

__all__ = [
    "ContactRepository",
    "NewsletterRepository",
    "PortfolioRepository",
    "BlogRepository",
    "ServiceRepository",
    "UserRepository",
    "CustomerRepository",
    "AccountRepository",
]