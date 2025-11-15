from fastapi import APIRouter, HTTPException, Request, status
from models import ContactSubmission, ContactCreate, SuccessResponse
from database import contacts_collection
from email_service import email_service
from utils import get_client_ip
from config.logging_config import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/contact", tags=["contact"])

@router.post("", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact_form(contact_data: ContactCreate, request: Request):
    """
    Submit contact form
    - Validates input data
    - Saves to database
    - Sends email notification to admin
    """
    try:
        # Create contact submission with metadata
        contact = ContactSubmission(
            **contact_data.model_dump(),
            ip_address=get_client_ip(request)
        )
        
        # Convert to dict and serialize datetime
        doc = contact.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        # Save to database
        result = await contacts_collection.insert_one(doc)
        
        if result.inserted_id:
            # Send email notification (async, non-blocking)
            await email_service.send_contact_notification(doc)
            
            logger.info("contact_form_submitted", contact_id=contact.id, email=contact.email, ip=contact.ip_address)
            
            return SuccessResponse(
                message="Thank you for contacting us! We'll get back to you within 24 hours.",
                data={"id": contact.id}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save contact submission"
            )
            
    except Exception as e:
        logger.error("contact_form_error", error=str(e), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your request. Please try again."
        )

@router.get("/submissions")
async def get_contact_submissions(status: str = None, limit: int = 50, skip: int = 0):
    """
    Get contact submissions (Admin endpoint - add auth in production)
    """
    try:
        query = {}
        if status:
            query['status'] = status
        
        contacts = await contacts_collection.find(
            query, {"_id": 0}
        ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        
        return SuccessResponse(
            message="Contact submissions retrieved successfully",
            data={"contacts": contacts, "count": len(contacts)}
        )
    except Exception as e:
        logger.error("fetch_contacts_error", error=str(e), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch contact submissions"
        )