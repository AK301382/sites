from fastapi import APIRouter, HTTPException, Request, status, Depends
from models import ServiceInquiry, ServiceInquiryCreate, ConsultationBooking, ConsultationBookingCreate, SuccessResponse
from database import service_inquiries_collection, consultation_bookings_collection
from email_service import email_service
from utils import get_client_ip
from rate_limiter import rate_limit_moderate
from validation import validate_message_length, detect_spam_patterns, sanitize_string
from config.logging_config import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/services", tags=["services"])

@router.post("/inquiry", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def submit_service_inquiry(
    inquiry_data: ServiceInquiryCreate, 
    request: Request,
    _: None = Depends(rate_limit_moderate)
):
    """
    Submit service inquiry form
    - Validates input data
    - Checks for spam
    - Saves to database
    - Sends email notification to admin
    """
    try:
        # Validate message length
        is_valid, error_msg = validate_message_length(inquiry_data.message, min_length=10, max_length=2000)
        if not is_valid:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_msg)
        
        # Check for spam patterns
        if detect_spam_patterns(inquiry_data.message):
            logger.warning(f"Potential spam detected in inquiry from {inquiry_data.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Your message contains prohibited content. Please revise and try again."
            )
        
        # Sanitize input data
        sanitized_data = inquiry_data.model_dump()
        sanitized_data['name'] = sanitize_string(sanitized_data['name'], max_length=100)
        sanitized_data['message'] = sanitize_string(sanitized_data['message'], max_length=2000)
        if sanitized_data.get('company'):
            sanitized_data['company'] = sanitize_string(sanitized_data['company'], max_length=100)
        
        # Create service inquiry with metadata
        inquiry = ServiceInquiry(
            **sanitized_data,
            ip_address=get_client_ip(request)
        )
        
        # Convert to dict and serialize datetime
        doc = inquiry.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        # Save to database
        result = await service_inquiries_collection.insert_one(doc)
        
        if result.inserted_id:
            # Send email notification (async, non-blocking)
            try:
                await email_service.send_service_inquiry_notification(doc)
            except Exception as email_error:
                logger.error(f"Failed to send email notification: {email_error}")
            
            logger.info(f"Service inquiry submitted: {inquiry.id} for {inquiry.service_type} from {inquiry.email}")
            
            return SuccessResponse(
                message="Thank you for your inquiry! Our team will contact you within 24 hours to discuss your project.",
                data={"id": inquiry.id}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save service inquiry"
            )
            
    except Exception as e:
        logger.error(f"Error submitting service inquiry: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your request. Please try again."
        )

@router.post("/book-consultation", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def book_consultation(
    booking_data: ConsultationBookingCreate, 
    request: Request,
    _: None = Depends(rate_limit_moderate)
):
    """
    Book a consultation
    - Validates input data
    - Checks for spam
    - Saves to database
    - Sends confirmation email to user and notification to admin
    """
    try:
        # Validate message if provided
        if booking_data.message:
            is_valid, error_msg = validate_message_length(booking_data.message, min_length=0, max_length=1000)
            if not is_valid:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_msg)
            
            # Check for spam patterns
            if detect_spam_patterns(booking_data.message):
                logger.warning(f"Potential spam detected in consultation booking from {booking_data.email}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Your message contains prohibited content. Please revise and try again."
                )
        
        # Sanitize input data
        sanitized_data = booking_data.model_dump()
        sanitized_data['name'] = sanitize_string(sanitized_data['name'], max_length=100)
        if sanitized_data.get('message'):
            sanitized_data['message'] = sanitize_string(sanitized_data['message'], max_length=1000)
        if sanitized_data.get('company'):
            sanitized_data['company'] = sanitize_string(sanitized_data['company'], max_length=100)
        
        # Create consultation booking with metadata
        booking = ConsultationBooking(
            **sanitized_data,
            ip_address=get_client_ip(request)
        )
        
        # Convert to dict and serialize datetime
        doc = booking.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        # Save to database
        result = await consultation_bookings_collection.insert_one(doc)
        
        if result.inserted_id:
            # Send email notifications (async, non-blocking)
            try:
                await email_service.send_consultation_booking_notification(doc)
            except Exception as email_error:
                logger.error(f"Failed to send email notification: {email_error}")
            
            logger.info(f"Consultation booked: {booking.id} for {booking.service_interested} on {booking.preferred_date} from {booking.email}")
            
            return SuccessResponse(
                message="Your consultation has been booked! We'll send you a confirmation email shortly with meeting details.",
                data={"id": booking.id}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to book consultation"
            )
            
    except Exception as e:
        logger.error(f"Error booking consultation: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your booking. Please try again."
        )

@router.get("/inquiries")
async def get_service_inquiries(status: str = None, service_type: str = None, limit: int = 50, skip: int = 0):
    """
    Get service inquiries (Admin endpoint)
    """
    try:
        query = {}
        if status:
            query['status'] = status
        if service_type:
            query['service_type'] = service_type
        
        inquiries = await service_inquiries_collection.find(
            query, {"_id": 0}
        ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        
        return SuccessResponse(
            message="Service inquiries retrieved successfully",
            data={"inquiries": inquiries, "count": len(inquiries)}
        )
    except Exception as e:
        logger.error(f"Error fetching service inquiries: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch service inquiries"
        )

@router.get("/consultations")
async def get_consultation_bookings(status: str = None, limit: int = 50, skip: int = 0):
    """
    Get consultation bookings (Admin endpoint)
    """
    try:
        query = {}
        if status:
            query['status'] = status
        
        bookings = await consultation_bookings_collection.find(
            query, {"_id": 0}
        ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        
        return SuccessResponse(
            message="Consultation bookings retrieved successfully",
            data={"bookings": bookings, "count": len(bookings)}
        )
    except Exception as e:
        logger.error(f"Error fetching consultation bookings: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch consultation bookings"
        )
