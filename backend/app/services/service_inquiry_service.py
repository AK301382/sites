"""Service inquiry service - Business logic for service inquiries and consultations."""
from app.repositories.service_repository import ServiceRepository
from app.models.service import ServiceInquiry, ConsultationBooking
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class ServiceInquiryService:
    """Service for handling service inquiries and consultation bookings."""
    
    def __init__(self, inquiry_repository: ServiceRepository, consultation_repository: ServiceRepository):
        self.inquiry_repository = inquiry_repository
        self.consultation_repository = consultation_repository
    
    # Service Inquiry methods
    async def create_inquiry(self, data: dict, ip_address: Optional[str] = None) -> ServiceInquiry:
        """Create a new service inquiry."""
        if ip_address:
            data['ip_address'] = ip_address
        
        inquiry = ServiceInquiry(**data)
        result = await self.inquiry_repository.create(inquiry.model_dump())
        logger.info(f"Service inquiry created: {result['id']} for {inquiry.service_type}")
        return ServiceInquiry(**result)
    
    async def get_all_inquiries(self, skip: int = 0, limit: int = 50) -> List[ServiceInquiry]:
        """Get all service inquiries."""
        results = await self.inquiry_repository.find_many(skip=skip, limit=limit, sort=[("created_at", -1)])
        return [ServiceInquiry(**r) for r in results]
    
    async def get_inquiries_by_status(self, status: str, skip: int = 0, limit: int = 50) -> List[ServiceInquiry]:
        """Get inquiries by status."""
        results = await self.inquiry_repository.find_by_status(status, skip, limit)
        return [ServiceInquiry(**r) for r in results]
    
    async def get_inquiries_by_service_type(self, service_type: str, skip: int = 0, limit: int = 50) -> List[ServiceInquiry]:
        """Get inquiries by service type."""
        results = await self.inquiry_repository.find_by_service_type(service_type, skip, limit)
        return [ServiceInquiry(**r) for r in results]
    
    async def update_inquiry_status(self, inquiry_id: str, status: str) -> Optional[ServiceInquiry]:
        """Update inquiry status."""
        result = await self.inquiry_repository.update_status(inquiry_id, status)
        if result:
            return ServiceInquiry(**result)
        return None
    
    # Consultation Booking methods
    async def create_consultation(self, data: dict, ip_address: Optional[str] = None) -> ConsultationBooking:
        """Create a new consultation booking."""
        if ip_address:
            data['ip_address'] = ip_address
        
        booking = ConsultationBooking(**data)
        result = await self.consultation_repository.create(booking.model_dump())
        logger.info(f"Consultation booking created: {result['id']} for {booking.preferred_date}")
        return ConsultationBooking(**result)
    
    async def get_all_consultations(self, skip: int = 0, limit: int = 50) -> List[ConsultationBooking]:
        """Get all consultation bookings."""
        results = await self.consultation_repository.find_many(skip=skip, limit=limit, sort=[("created_at", -1)])
        return [ConsultationBooking(**r) for r in results]
    
    async def get_consultations_by_status(self, status: str, skip: int = 0, limit: int = 50) -> List[ConsultationBooking]:
        """Get consultations by status."""
        results = await self.consultation_repository.find_by_status(status, skip, limit)
        return [ConsultationBooking(**r) for r in results]
    
    async def update_consultation_status(self, consultation_id: str, status: str) -> Optional[ConsultationBooking]:
        """Update consultation status."""
        result = await self.consultation_repository.update_status(consultation_id, status)
        if result:
            return ConsultationBooking(**result)
        return None
    
    async def get_inquiry_count(self) -> int:
        """Get total count of inquiries."""
        return await self.inquiry_repository.count()
    
    async def get_consultation_count(self) -> int:
        """Get total count of consultations."""
        return await self.consultation_repository.count()
