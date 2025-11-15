"""Blog post schemas."""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class BlogPostCreate(BaseModel):
    """Schema for creating a blog post."""
    title: str = Field(..., min_length=3, max_length=200)
    slug: str = Field(..., min_length=3, max_length=200)
    excerpt: str = Field(..., max_length=300)
    content: str
    author: str = Field(..., max_length=100)
    category: str
    tags: List[str] = Field(default_factory=list)
    featured_image: str
    read_time: int
    featured: bool = Field(default=False)


class BlogPostUpdate(BaseModel):
    """Schema for updating a blog post."""
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    featured_image: Optional[str] = None
    read_time: Optional[int] = None
    featured: Optional[bool] = None
    status: Optional[str] = None


class BlogPostResponse(BaseModel):
    """Schema for blog post response."""
    id: str
    title: str
    slug: str
    excerpt: str
    content: str
    author: str
    category: str
    tags: List[str]
    featured_image: str
    read_time: int
    featured: bool
    status: str
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
