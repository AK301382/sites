"""Portfolio item model."""
from pydantic import BaseModel, Field, HttpUrl, ConfigDict
from datetime import datetime, timezone
from typing import Optional, List
import uuid


class PortfolioItem(BaseModel):
    """Portfolio project model."""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = Field(..., min_length=3, max_length=200)
    slug: str = Field(..., min_length=3, max_length=200)
    client: str = Field(..., max_length=100)
    category: str  # web-design, mobile-app, branding, etc.
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
    status: str = Field(default="published")  # draft, published, archived
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
