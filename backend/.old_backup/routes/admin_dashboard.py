from fastapi import APIRouter, Depends, HTTPException, status
from database import contacts_collection, newsletter_collection, blog_collection, portfolio_collection
from auth import get_current_user
from models import SuccessResponse
from config.logging_config import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/admin/dashboard", tags=["admin-dashboard"])

@router.get("/stats", response_model=SuccessResponse)
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    """
    Get dashboard statistics
    - Total contacts, newsletter subscribers, blog posts, portfolio items
    - Recent activity counts
    """
    try:
        # Get counts
        total_contacts = await contacts_collection.count_documents({})
        new_contacts = await contacts_collection.count_documents({"status": "new"})
        
        total_subscribers = await newsletter_collection.count_documents({"status": "active"})
        
        total_blog_posts = await blog_collection.count_documents({})
        published_blog_posts = await blog_collection.count_documents({"status": "published"})
        
        total_portfolio = await portfolio_collection.count_documents({})
        published_portfolio = await portfolio_collection.count_documents({"status": "published"})
        
        stats = {
            "contacts": {
                "total": total_contacts,
                "new": new_contacts,
                "read": total_contacts - new_contacts
            },
            "newsletter": {
                "total_subscribers": total_subscribers
            },
            "blog": {
                "total": total_blog_posts,
                "published": published_blog_posts,
                "draft": total_blog_posts - published_blog_posts
            },
            "portfolio": {
                "total": total_portfolio,
                "published": published_portfolio,
                "draft": total_portfolio - published_portfolio
            }
        }
        
        return SuccessResponse(
            message="Dashboard statistics retrieved successfully",
            data=stats
        )
        
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch dashboard statistics"
        )

@router.get("/recent-activity", response_model=SuccessResponse)
async def get_recent_activity(current_user: dict = Depends(get_current_user), limit: int = 10):
    """
    Get recent activity across all collections
    """
    try:
        # Get recent contacts
        recent_contacts = await contacts_collection.find(
            {}, {"_id": 0, "name": 1, "email": 1, "created_at": 1, "status": 1}
        ).sort("created_at", -1).limit(limit).to_list(limit)
        
        # Get recent subscribers
        recent_subscribers = await newsletter_collection.find(
            {}, {"_id": 0, "email": 1, "subscribed_at": 1}
        ).sort("subscribed_at", -1).limit(limit).to_list(limit)
        
        return SuccessResponse(
            message="Recent activity retrieved successfully",
            data={
                "recent_contacts": recent_contacts,
                "recent_subscribers": recent_subscribers
            }
        )
        
    except Exception as e:
        logger.error(f"Error fetching recent activity: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch recent activity"
        )
