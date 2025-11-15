"""Blog endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.schemas.blog import BlogPostResponse
from app.schemas.common import PaginationParams
from app.services import BlogService
from app.api.deps import get_blog_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/blog", tags=["Blog"])


@router.get("/", response_model=List[BlogPostResponse])
async def get_blog_posts(
    pagination: PaginationParams = Depends(),
    service: BlogService = Depends(get_blog_service)
):
    """Get all published blog posts."""
    posts = await service.get_all_posts(pagination.skip, pagination.limit)
    return posts


@router.get("/featured", response_model=List[BlogPostResponse])
async def get_featured_posts(
    limit: int = 3,
    service: BlogService = Depends(get_blog_service)
):
    """Get featured blog posts."""
    posts = await service.get_featured(limit)
    return posts


@router.get("/search", response_model=List[BlogPostResponse])
async def search_blog_posts(
    q: str = Query(..., min_length=2, description="Search query"),
    pagination: PaginationParams = Depends(),
    service: BlogService = Depends(get_blog_service)
):
    """Search blog posts by text."""
    posts = await service.search_posts(q, pagination.skip, pagination.limit)
    return posts


@router.get("/category/{category}", response_model=List[BlogPostResponse])
async def get_posts_by_category(
    category: str,
    pagination: PaginationParams = Depends(),
    service: BlogService = Depends(get_blog_service)
):
    """Get blog posts by category."""
    posts = await service.get_by_category(category, pagination.skip, pagination.limit)
    return posts


@router.get("/{slug}", response_model=BlogPostResponse)
async def get_blog_post(
    slug: str,
    service: BlogService = Depends(get_blog_service)
):
    """Get blog post by slug."""
    post = await service.get_by_slug(slug)
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog post '{slug}' not found"
        )
    
    return post
