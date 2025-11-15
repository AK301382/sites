"""Admin blog management endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.blog import BlogPostCreate, BlogPostUpdate, BlogPostResponse
from app.schemas.common import SuccessResponse
from app.services import BlogService
from app.api.deps import get_blog_service
from app.core.dependencies import get_current_admin_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin/blog", tags=["Admin - Blog"])


@router.post("/", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
async def create_blog_post(
    post: BlogPostCreate,
    current_user: dict = Depends(get_current_admin_user),
    service: BlogService = Depends(get_blog_service)
):
    """Create a new blog post."""
    try:
        result = await service.create_post(post.model_dump())
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )


@router.put("/{post_id}", response_model=BlogPostResponse)
async def update_blog_post(
    post_id: str,
    update_data: BlogPostUpdate,
    current_user: dict = Depends(get_current_admin_user),
    service: BlogService = Depends(get_blog_service)
):
    """Update a blog post."""
    result = await service.update_post(post_id, update_data.model_dump(exclude_unset=True))
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    return result


@router.delete("/{post_id}", response_model=SuccessResponse)
async def delete_blog_post(
    post_id: str,
    current_user: dict = Depends(get_current_admin_user),
    service: BlogService = Depends(get_blog_service)
):
    """Delete a blog post."""
    success = await service.delete_post(post_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog post not found"
        )
    
    return SuccessResponse(
        success=True,
        message="Blog post deleted successfully"
    )
