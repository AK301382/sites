"""Admin contact management endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.schemas.contact import ContactResponse
from app.schemas.common import PaginationParams, SuccessResponse
from app.services import ContactService
from app.api.deps import get_contact_service
from app.core.dependencies import get_current_admin_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin/contacts", tags=["Admin - Contacts"])


@router.get("/", response_model=List[ContactResponse])
async def get_all_contacts(
    pagination: PaginationParams = Depends(),
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    current_user: dict = Depends(get_current_admin_user),
    service: ContactService = Depends(get_contact_service)
):
    """Get all contact submissions."""
    if status_filter:
        contacts = await service.get_by_status(status_filter, pagination.skip, pagination.limit)
    else:
        contacts = await service.get_all_submissions(pagination.skip, pagination.limit)
    
    return contacts


@router.patch("/{contact_id}/status", response_model=ContactResponse)
async def update_contact_status(
    contact_id: str,
    status: str = Query(..., description="New status (new, read, replied, archived)"),
    current_user: dict = Depends(get_current_admin_user),
    service: ContactService = Depends(get_contact_service)
):
    """Update contact submission status."""
    result = await service.update_status(contact_id, status)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact submission not found"
        )
    
    return result
