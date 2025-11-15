"""Newsletter service - Business logic for newsletter subscriptions."""
from app.repositories.newsletter_repository import NewsletterRepository
from app.models.newsletter import NewsletterSubscription
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class NewsletterService:
    """Service for handling newsletter subscriptions."""
    
    def __init__(self, repository: NewsletterRepository):
        self.repository = repository
    
    async def subscribe(self, email: str, ip_address: Optional[str] = None, source: str = "website") -> NewsletterSubscription:
        """Subscribe to newsletter."""
        # Check if already subscribed
        existing = await self.repository.find_by_email(email)
        if existing:
            if existing['status'] == 'active':
                logger.info(f"Email already subscribed: {email}")
                return NewsletterSubscription(**existing)
            else:
                # Reactivate subscription
                updated = await self.repository.update(existing['id'], {"status": "active"})
                logger.info(f"Reactivated subscription: {email}")
                return NewsletterSubscription(**updated)
        
        # Create new subscription
        subscription = NewsletterSubscription(
            email=email,
            ip_address=ip_address,
            source=source
        )
        result = await self.repository.create(subscription.model_dump())
        logger.info(f"New newsletter subscription: {email}")
        return NewsletterSubscription(**result)
    
    async def unsubscribe(self, email: str) -> bool:
        """Unsubscribe from newsletter."""
        result = await self.repository.unsubscribe(email)
        if result:
            logger.info(f"Unsubscribed: {email}")
            return True
        return False
    
    async def get_active_subscribers(self, skip: int = 0, limit: int = 100) -> List[NewsletterSubscription]:
        """Get all active subscribers."""
        results = await self.repository.find_active_subscribers(skip, limit)
        return [NewsletterSubscription(**r) for r in results]
    
    async def get_count(self) -> int:
        """Get total count of active subscribers."""
        return await self.repository.count({"status": "active"})
