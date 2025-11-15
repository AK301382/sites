from fastapi import APIRouter, HTTPException, status
from models import BlogPost, BlogPostCreate, BlogPostUpdate, SuccessResponse
from database import blog_collection
from datetime import datetime, timezone
from config.logging_config import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/blog", tags=["blog"])

@router.post("", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def create_blog_post(post_data: BlogPostCreate):
    """
    Create new blog post (Admin endpoint - add auth in production)
    """
    try:
        # Check for duplicate slug
        existing = await blog_collection.find_one({"slug": post_data.slug})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Blog post with this slug already exists"
            )
        
        # Create blog post
        post = BlogPost(
            **post_data.model_dump(),
            published_at=datetime.now(timezone.utc)
        )
        
        # Convert to dict and serialize datetimes
        doc = post.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        if doc['published_at']:
            doc['published_at'] = doc['published_at'].isoformat()
        
        # Save to database
        result = await blog_collection.insert_one(doc)
        
        if result.inserted_id:
            logger.info(f"Blog post created: {post.id} - {post.title}")
            return SuccessResponse(
                message="Blog post created successfully",
                data={"id": post.id, "slug": post.slug}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create blog post"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating blog post: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating blog post"
        )

@router.get("", response_model=SuccessResponse)
async def get_blog_posts(
    category: str = None,
    featured: bool = None,
    status: str = "published",
    limit: int = 50,
    skip: int = 0
):
    """
    Get blog posts with filtering
    """
    try:
        query = {"status": status} if status else {}
        if category:
            query['category'] = category
        if featured is not None:
            query['featured'] = featured
        
        posts = await blog_collection.find(
            query, {"_id": 0}
        ).sort("published_at", -1).skip(skip).limit(limit).to_list(limit)
        
        return SuccessResponse(
            message="Blog posts retrieved successfully",
            data={"posts": posts, "count": len(posts)}
        )
    except Exception as e:
        logger.error(f"Error fetching blog posts: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch blog posts"
        )

@router.get("/{slug}", response_model=SuccessResponse)
async def get_blog_post_by_slug(slug: str):
    """
    Get single blog post by slug
    """
    try:
        post = await blog_collection.find_one(
            {"slug": slug, "status": "published"},
            {"_id": 0}
        )
        
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Blog post not found"
            )
        
        return SuccessResponse(
            message="Blog post retrieved successfully",
            data={"post": post}
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching blog post: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch blog post"
        )

@router.put("/{post_id}", response_model=SuccessResponse)
async def update_blog_post(post_id: str, update_data: BlogPostUpdate):
    """
    Update blog post (Admin endpoint - add auth in production)
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
        result = await blog_collection.update_one(
            {"id": post_id},
            {"$set": update_fields}
        )
        
        if result.modified_count > 0:
            logger.info(f"Blog post updated: {post_id}")
            return SuccessResponse(
                message="Blog post updated successfully",
                data={"id": post_id}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Blog post not found"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating blog post: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating blog post"
        )

@router.delete("/{post_id}", response_model=SuccessResponse)
async def delete_blog_post(post_id: str):
    """
    Delete blog post (Admin endpoint - add auth in production)
    """
    try:
        result = await blog_collection.delete_one({"id": post_id})
        
        if result.deleted_count > 0:
            logger.info(f"Blog post deleted: {post_id}")
            return SuccessResponse(
                message="Blog post deleted successfully",
                data={"id": post_id}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Blog post not found"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting blog post: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while deleting blog post"
        )