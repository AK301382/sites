"""Admin service inquiry management endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.schemas.service import ServiceInquiryResponse, ConsultationBookingResponse
from app.schemas.common import PaginationParams
from app.services import ServiceInquiryService
from app.api.deps import get_service_inquiry_service
from app.core.dependencies import get_current_admin_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin/services", tags=["Admin - Services"])


@router.get("/inquiries", response_model=List[ServiceInquiryResponse])
async def get_all_inquiries(
    pagination: PaginationParams = Depends(),
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    current_user: dict = Depends(get_current_admin_user),
    service: ServiceInquiryService = Depends(get_service_inquiry_service)
):
    """Get all service inquiries."""
    if status_filter:
        inquiries = await service.get_inquiries_by_status(status_filter, pagination.skip, pagination.limit)
    else:
        inquiries = await service.get_all_inquiries(pagination.skip, pagination.limit)
    
    return inquiries


@router.patch("/inquiries/{inquiry_id}/status", response_model=ServiceInquiryResponse)
async def update_inquiry_status(
    inquiry_id: str,
    new_status: str = Query(..., description="New status (new, contacted, quoted, closed)"),
    current_user: dict = Depends(get_current_admin_user),
    service: ServiceInquiryService = Depends(get_service_inquiry_service)
):
    """Update inquiry status."""
    result = await service.update_inquiry_status(inquiry_id, new_status)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service inquiry not found"
        )
    
    return result


@router.get("/consultations", response_model=List[ConsultationBookingResponse])
async def get_all_consultations(
    pagination: PaginationParams = Depends(),
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    current_user: dict = Depends(get_current_admin_user),
    service: ServiceInquiryService = Depends(get_service_inquiry_service)
):
    """Get all consultation bookings."""
    if status_filter:
        consultations = await service.get_consultations_by_status(status_filter, pagination.skip, pagination.limit)
    else:
        consultations = await service.get_all_consultations(pagination.skip, pagination.limit)
    
    return consultations


@router.patch("/consultations/{consultation_id}/status", response_model=ConsultationBookingResponse)
async def update_consultation_status(
    consultation_id: str,
    new_status: str = Query(..., description="New status (pending, confirmed, completed, cancelled)"),
    current_user: dict = Depends(get_current_admin_user),
    service: ServiceInquiryService = Depends(get_service_inquiry_service)
):
    """Update consultation status."""
    result = await service.update_consultation_status(consultation_id, new_status)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultation booking not found"
        )
    
    return result
