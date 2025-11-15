from pydantic import BaseModel, Field, EmailStr, HttpUrl, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import uuid

# ==================== Contact Form Models ====================
class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    service: Optional[str] = None
    message: str = Field(..., min_length=10, max_length=2000)
    budget: Optional[str] = None
    timeline: Optional[str] = None
    status: str = Field(default="new")  # new, read, replied, archived
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ip_address: Optional[str] = None

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    service: Optional[str] = None
    message: str = Field(..., min_length=10, max_length=2000)
    budget: Optional[str] = None
    timeline: Optional[str] = None

# ==================== Newsletter Models ====================
class NewsletterSubscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    status: str = Field(default="active")  # active, unsubscribed
    subscribed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ip_address: Optional[str] = None
    source: Optional[str] = Field(default="website")  # website, landing_page, etc.

class NewsletterCreate(BaseModel):
    email: EmailStr

# ==================== Portfolio Models ====================
class PortfolioItem(BaseModel):
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

class PortfolioCreate(BaseModel):
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

# ==================== Blog Models ====================
class BlogPost(BaseModel):
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

class BlogPostCreate(BaseModel):
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

# ==================== Service Inquiry Models ====================
class ServiceInquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    service_type: str = Field(..., description="Type of service interested in")
    message: str = Field(..., min_length=10, max_length=2000)
    budget_range: Optional[str] = None
    timeline: Optional[str] = None
    status: str = Field(default="new")  # new, contacted, quoted, closed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ip_address: Optional[str] = None

class ServiceInquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    service_type: str
    message: str = Field(..., min_length=10, max_length=2000)
    budget_range: Optional[str] = None
    timeline: Optional[str] = None

# ==================== Consultation Booking Models ====================
class ConsultationBooking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    service_interested: str = Field(..., description="Service they're interested in")
    preferred_date: str = Field(..., description="Preferred consultation date")
    preferred_time: str = Field(..., description="Preferred consultation time")
    message: Optional[str] = Field(None, max_length=1000)
    status: str = Field(default="pending")  # pending, confirmed, completed, cancelled
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ip_address: Optional[str] = None

class ConsultationBookingCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    service_interested: str
    preferred_date: str
    preferred_time: str
    message: Optional[str] = Field(None, max_length=1000)
# ==================== Response Models ====================
class SuccessResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[dict] = None

class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    errors: Optional[List[str]] = None