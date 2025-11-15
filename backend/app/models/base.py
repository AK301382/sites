"""Base model classes and utilities."""
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime, timezone
import uuid
from typing import Optional


class BaseDBModel(BaseModel):
    """Base model for database documents."""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SoftDeleteMixin(BaseModel):
    """Mixin for soft delete functionality."""
    is_deleted: bool = Field(default=False)
    deleted_at: Optional[datetime] = None
