from fastapi import APIRouter, HTTPException, Request, status
from models import NewsletterSubscription, NewsletterCreate, SuccessResponse
from database import newsletter_collection
from email_service import email_service
from utils import get_client_ip
from config.logging_config import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/newsletter", tags=["newsletter"])

@router.post("/subscribe", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def subscribe_to_newsletter(subscription_data: NewsletterCreate, request: Request):
    """
    Subscribe to newsletter
    - Checks for duplicate subscriptions
    - Saves to database
    - Sends confirmation email
    """
    try:
        # Check if email already exists
        existing = await newsletter_collection.find_one(
            {"email": subscription_data.email, "status": "active"},
            {"_id": 0}
        )
        
        if existing:
            return SuccessResponse(
                message="You're already subscribed to our newsletter!"
            )
        
        # Create new subscription
        subscription = NewsletterSubscription(
            **subscription_data.model_dump(),
            ip_address=get_client_ip(request)
        )
        
        # Convert to dict and serialize datetime
        doc = subscription.model_dump()
        doc['subscribed_at'] = doc['subscribed_at'].isoformat()
        
        # Save to database
        result = await newsletter_collection.insert_one(doc)
        
        if result.inserted_id:
            # Send confirmation email
            await email_service.send_newsletter_confirmation(subscription.email)
            
            logger.info(f"Newsletter subscription: {subscription.email}")
            
            return SuccessResponse(
                message="Thank you for subscribing! Check your email for confirmation.",
                data={"id": subscription.id}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save subscription"
            )
            
    except Exception as e:
        logger.error(f"Error subscribing to newsletter: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred. Please try again."
        )

@router.post("/unsubscribe")
async def unsubscribe_from_newsletter(email: str):
    """
    Unsubscribe from newsletter
    """
    try:
        result = await newsletter_collection.update_one(
            {"email": email},
            {"$set": {"status": "unsubscribed"}}
        )
        
        if result.modified_count > 0:
            return SuccessResponse(
                message="You've been unsubscribed successfully."
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email not found in our newsletter list"
            )
            
    except Exception as e:
        logger.error(f"Error unsubscribing from newsletter: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred. Please try again."
        )

@router.get("/subscribers")
async def get_subscribers(status: str = "active", limit: int = 100, skip: int = 0):
    """
    Get newsletter subscribers (Admin endpoint - add auth in production)
    """
    try:
        query = {"status": status} if status else {}
        
        subscribers = await newsletter_collection.find(
            query, {"_id": 0}
        ).sort("subscribed_at", -1).skip(skip).limit(limit).to_list(limit)
        
        return SuccessResponse(
            message="Subscribers retrieved successfully",
            data={"subscribers": subscribers, "count": len(subscribers)}
        )
    except Exception as e:
        logger.error(f"Error fetching subscribers: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch subscribers"
        )