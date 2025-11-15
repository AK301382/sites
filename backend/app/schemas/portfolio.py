"""Portfolio schemas."""
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime


class PortfolioCreate(BaseModel):
    """Schema for creating a portfolio item."""
    title: str = Field(..., min_length=3, max_length=200)
    slug: str = Field(..., min_length=3, max_length=200)
    client: str = Field(..., max_length=100)
    category: str
    short_description: str = Field(..., max_length=300)
    full_description: str
    challenge: Optional[str] = None
    solution: Optional[str] = None
    results: Optional[List[str]] = None
    technologies: List[str]
    image_url: str
    gallery_images: Optional[List[str]] = None
    project_url: Optional[HttpUrl] = None
    completion_date: Optional[str] = None
    featured: bool = Field(default=False)


class PortfolioUpdate(BaseModel):
    """Schema for updating a portfolio item."""
    title: Optional[str] = None
    client: Optional[str] = None
    category: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    challenge: Optional[str] = None
    solution: Optional[str] = None
    results: Optional[List[str]] = None
    technologies: Optional[List[str]] = None
    image_url: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    project_url: Optional[HttpUrl] = None
    completion_date: Optional[str] = None
    featured: Optional[bool] = None
    status: Optional[str] = None


class PortfolioResponse(BaseModel):
    """Schema for portfolio item response."""
    id: str
    title: str
    slug: str
    client: str
    category: str
    short_description: str
    full_description: str
    challenge: Optional[str] = None
    solution: Optional[str] = None
    results: Optional[List[str]] = None
    technologies: List[str]
    image_url: str
    gallery_images: Optional[List[str]] = None
    project_url: Optional[HttpUrl] = None
    completion_date: Optional[str] = None
    featured: bool
    status: str
    created_at: datetime
    updated_at: datetime
