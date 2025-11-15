from fastapi import APIRouter, HTTPException, status
from models import PortfolioItem, PortfolioCreate, PortfolioUpdate, SuccessResponse
from database import portfolio_collection
from datetime import datetime, timezone
from config.logging_config import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/portfolio", tags=["portfolio"])

@router.post("", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def create_portfolio_item(item_data: PortfolioCreate):
    """
    Create new portfolio item (Admin endpoint - add auth in production)
    """
    try:
        # Check for duplicate slug
        existing = await portfolio_collection.find_one({"slug": item_data.slug})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Portfolio item with this slug already exists"
            )
        
        # Create portfolio item
        item = PortfolioItem(**item_data.model_dump())
        
        # Convert to dict and serialize datetimes
        doc = item.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        # Save to database
        result = await portfolio_collection.insert_one(doc)
        
        if result.inserted_id:
            logger.info(f"Portfolio item created: {item.id} - {item.title}")
            return SuccessResponse(
                message="Portfolio item created successfully",
                data={"id": item.id, "slug": item.slug}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create portfolio item"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating portfolio item: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating portfolio item"
        )

@router.get("", response_model=SuccessResponse)
async def get_portfolio_items(
    category: str = None,
    featured: bool = None,
    status: str = "published",
    limit: int = 50,
    skip: int = 0
):
    """
    Get portfolio items with filtering
    """
    try:
        query = {"status": status} if status else {}
        if category:
            query['category'] = category
        if featured is not None:
            query['featured'] = featured
        
        items = await portfolio_collection.find(
            query, {"_id": 0}
        ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        
        return SuccessResponse(
            message="Portfolio items retrieved successfully",
            data={"items": items, "count": len(items)}
        )
    except Exception as e:
        logger.error(f"Error fetching portfolio items: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch portfolio items"
        )

@router.get("/{slug}", response_model=SuccessResponse)
async def get_portfolio_item_by_slug(slug: str):
    """
    Get single portfolio item by slug
    """
    try:
        item = await portfolio_collection.find_one(
            {"slug": slug, "status": "published"},
            {"_id": 0}
        )
        
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Portfolio item not found"
            )
        
        return SuccessResponse(
            message="Portfolio item retrieved successfully",
            data={"item": item}
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching portfolio item: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch portfolio item"
        )

@router.put("/{item_id}", response_model=SuccessResponse)
async def update_portfolio_item(item_id: str, update_data: PortfolioUpdate):
    """
    Update portfolio item (Admin endpoint - add auth in production)
    """
    try:
        # Get only non-None fields
        update_fields = {k: v for k, v in update_data.model_dump().items() if v is not None}
        
        if not update_fields:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update"
            )
        
        # Add updated_at timestamp
        update_fields['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        # Update in database
        result = await portfolio_collection.update_one(
            {"id": item_id},
            {"$set": update_fields}
        )
        
        if result.modified_count > 0:
            logger.info(f"Portfolio item updated: {item_id}")
            return SuccessResponse(
                message="Portfolio item updated successfully",
                data={"id": item_id}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Portfolio item not found"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating portfolio item: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating portfolio item"
        )

@router.delete("/{item_id}", response_model=SuccessResponse)
async def delete_portfolio_item(item_id: str):
    """
    Delete portfolio item (Admin endpoint - add auth in production)
    """
    try:
        result = await portfolio_collection.delete_one({"id": item_id})
        
        if result.deleted_count > 0:
            logger.info(f"Portfolio item deleted: {item_id}")
            return SuccessResponse(
                message="Portfolio item deleted successfully",
                data={"id": item_id}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Portfolio item not found"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting portfolio item: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while deleting portfolio item"
        )