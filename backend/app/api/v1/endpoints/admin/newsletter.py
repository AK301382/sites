"""Admin newsletter management endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.newsletter import NewsletterResponse
from app.schemas.common import PaginationParams
from app.services import NewsletterService
from app.api.deps import get_newsletter_service
from app.core.dependencies import get_current_admin_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin/newsletter", tags=["Admin - Newsletter"])


@router.get("/subscribers", response_model=List[NewsletterResponse])
async def get_subscribers(
    pagination: PaginationParams = Depends(),
    current_user: dict = Depends(get_current_admin_user),
    service: NewsletterService = Depends(get_newsletter_service)
):
    """Get all active newsletter subscribers."""
    subscribers = await service.get_active_subscribers(pagination.skip, pagination.limit)
    return subscribers
