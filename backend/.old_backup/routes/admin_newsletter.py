from fastapi import APIRouter, Depends, HTTPException, status
from database import newsletter_collection
from auth import get_current_user
from models import SuccessResponse
from typing import Optional
from config.logging_config import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/admin/newsletter", tags=["admin-newsletter"])

@router.get("", response_model=SuccessResponse)
async def get_all_subscribers(
    current_user: dict = Depends(get_current_user),
    status_filter: Optional[str] = "active",
    limit: int = 100,
    skip: int = 0
):
    """
    Get all newsletter subscribers with filtering
    """
    try:
        query = {}
        if status_filter:
            query['status'] = status_filter
        
        subscribers = await newsletter_collection.find(
            query, {"_id": 0}
        ).sort("subscribed_at", -1).skip(skip).limit(limit).to_list(limit)
        
        total = await newsletter_collection.count_documents(query)
        
        return SuccessResponse(
            message="Subscribers retrieved successfully",
            data={"subscribers": subscribers, "total": total, "count": len(subscribers)}
        )
    except Exception as e:
        logger.error(f"Error fetching subscribers: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch subscribers"
        )

@router.delete("/{subscriber_id}", response_model=SuccessResponse)
async def delete_subscriber(
    subscriber_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a newsletter subscriber
    """
    try:
        result = await newsletter_collection.delete_one({"id": subscriber_id})
        
        if result.deleted_count > 0:
            logger.info(f"Subscriber {subscriber_id} deleted by {current_user['username']}")
            return SuccessResponse(
                message="Subscriber deleted successfully",
                data={"id": subscriber_id}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscriber not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting subscriber: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete subscriber"
        )

@router.put("/{subscriber_id}/status", response_model=SuccessResponse)
async def update_subscriber_status(
    subscriber_id: str,
    new_status: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Update subscriber status (active, unsubscribed)
    """
    try:
        valid_statuses = ["active", "unsubscribed"]
        if new_status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        
        result = await newsletter_collection.update_one(
            {"id": subscriber_id},
            {"$set": {"status": new_status}}
        )
        
        if result.modified_count > 0:
            logger.info(f"Subscriber {subscriber_id} status updated to {new_status} by {current_user['username']}")
            return SuccessResponse(
                message=f"Subscriber status updated to {new_status}",
                data={"id": subscriber_id, "status": new_status}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscriber not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating subscriber status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update subscriber status"
        )
