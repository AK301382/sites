"""Contact service - Business logic for contact submissions."""
from app.repositories.contact_repository import ContactRepository
from app.models.contact import ContactSubmission
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class ContactService:
    """Service for handling contact form submissions."""
    
    def __init__(self, repository: ContactRepository):
        self.repository = repository
    
    async def create_submission(self, data: dict, ip_address: Optional[str] = None) -> ContactSubmission:
        """Create a new contact submission."""
        # Add IP address if provided
        if ip_address:
            data['ip_address'] = ip_address
        
        # Create model instance for validation
        submission = ContactSubmission(**data)
        
        # Save to database
        result = await self.repository.create(submission.model_dump())
        
        logger.info(f"Contact submission created: {result['id']} from {submission.email}")
        return ContactSubmission(**result)
    
    async def get_all_submissions(self, skip: int = 0, limit: int = 50) -> List[ContactSubmission]:
        """Get all contact submissions."""
        results = await self.repository.find_many(skip=skip, limit=limit, sort=[("created_at", -1)])
        return [ContactSubmission(**r) for r in results]
    
    async def get_by_status(self, status: str, skip: int = 0, limit: int = 50) -> List[ContactSubmission]:
        """Get submissions by status."""
        results = await self.repository.find_by_status(status, skip, limit)
        return [ContactSubmission(**r) for r in results]
    
    async def update_status(self, submission_id: str, status: str) -> Optional[ContactSubmission]:
        """Update submission status."""
        result = await self.repository.update_status(submission_id, status)
        if result:
            return ContactSubmission(**result)
        return None
    
    async def get_count(self) -> int:
        """Get total count of submissions."""
        return await self.repository.count()
