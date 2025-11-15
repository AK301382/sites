"""Blog post model."""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
from typing import Optional, List
import uuid


class BlogPost(BaseModel):
    """Blog post model."""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str = Field(..., min_length=3, max_length=200)
    slug: str = Field(..., min_length=3, max_length=200)
    excerpt: str = Field(..., max_length=300)
    content: str
    author: str = Field(..., max_length=100)
    category: str
    tags: List[str] = Field(default_factory=list)
    featured_image: str
    read_time: int  # in minutes
    featured: bool = Field(default=False)
    status: str = Field(default="published")  # draft, published, archived
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    published_at: Optional[datetime] = None
