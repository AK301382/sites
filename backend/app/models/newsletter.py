"""Newsletter subscription model."""
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from datetime import datetime, timezone
from typing import Optional
import uuid


class NewsletterSubscription(BaseModel):
    """Newsletter subscription model."""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    status: str = Field(default="active")  # active, unsubscribed
    subscribed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ip_address: Optional[str] = None
    source: Optional[str] = Field(default="website")  # website, landing_page, etc.
