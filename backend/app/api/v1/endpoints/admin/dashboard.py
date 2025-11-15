"""Admin dashboard endpoints."""
from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_admin_user
from app.services import ContactService, NewsletterService, PortfolioService, BlogService, ServiceInquiryService
from app.api.deps import (
    get_contact_service,
    get_newsletter_service,
    get_portfolio_service,
    get_blog_service,
    get_service_inquiry_service,
)
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin/dashboard", tags=["Admin - Dashboard"])


@router.get("/stats")
async def get_dashboard_stats(
    current_user: dict = Depends(get_current_admin_user),
    contact_service: ContactService = Depends(get_contact_service),
    newsletter_service: NewsletterService = Depends(get_newsletter_service),
    portfolio_service: PortfolioService = Depends(get_portfolio_service),
    blog_service: BlogService = Depends(get_blog_service),
    service_inquiry_service: ServiceInquiryService = Depends(get_service_inquiry_service),
):
    """Get dashboard statistics."""
    # Get counts from all services
    contact_count = await contact_service.get_count()
    newsletter_count = await newsletter_service.get_count()
    inquiry_count = await service_inquiry_service.get_inquiry_count()
    consultation_count = await service_inquiry_service.get_consultation_count()
    
    return {
        "contacts": contact_count,
        "newsletter_subscribers": newsletter_count,
        "service_inquiries": inquiry_count,
        "consultation_bookings": consultation_count,
    }
