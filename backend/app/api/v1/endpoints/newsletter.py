"""Newsletter subscription endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.newsletter import NewsletterCreate, NewsletterResponse
from app.schemas.common import SuccessResponse
from app.services import NewsletterService
from app.api.deps import get_newsletter_service, get_client_ip
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/newsletter", tags=["Newsletter"])


@router.post(
    "/subscribe",
    response_model=NewsletterResponse,
    status_code=status.HTTP_201_CREATED,
)
async def subscribe(
    data: NewsletterCreate,
    ip_address: str = Depends(get_client_ip),
    service: NewsletterService = Depends(get_newsletter_service)
):
    """Subscribe to newsletter."""
    try:
        result = await service.subscribe(data.email, ip_address)
        return result
    except Exception as e:
        logger.error(f"Error subscribing to newsletter: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to subscribe"
        )


@router.post(
    "/unsubscribe",
    response_model=SuccessResponse,
)
async def unsubscribe(
    data: NewsletterCreate,
    service: NewsletterService = Depends(get_newsletter_service)
):
    """Unsubscribe from newsletter."""
    success = await service.unsubscribe(data.email)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email not found in subscription list"
        )
    
    return SuccessResponse(
        success=True,
        message="Successfully unsubscribed from newsletter"
    )
