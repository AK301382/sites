"""Contact form endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.contact import ContactCreate, ContactResponse
from app.schemas.common import SuccessResponse
from app.services import ContactService
from app.api.deps import get_contact_service, get_client_ip
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/contacts", tags=["Contact Form"])


@router.post(
    "/",
    response_model=ContactResponse,
    status_code=status.HTTP_201_CREATED,
)
async def submit_contact(
    contact: ContactCreate,
    ip_address: str = Depends(get_client_ip),
    service: ContactService = Depends(get_contact_service)
):
    """Submit a contact form."""
    try:
        result = await service.create_submission(contact.model_dump(), ip_address)
        return result
    except Exception as e:
        logger.error(f"Error creating contact submission: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit contact form"
        )
