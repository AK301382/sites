"""Common schemas used across the API."""
from pydantic import BaseModel, Field
from typing import Optional, Any, List, Generic, TypeVar


class SuccessResponse(BaseModel):
    """Standard success response."""
    success: bool = True
    message: str
    data: Optional[Any] = None


class ErrorResponse(BaseModel):
    """Standard error response."""
    success: bool = False
    message: str
    errors: Optional[List[str]] = None


class PaginationParams(BaseModel):
    """Pagination parameters."""
    skip: int = Field(default=0, ge=0)
    limit: int = Field(default=50, ge=1, le=100)


T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response wrapper."""
    items: List[T]
    total: int
    skip: int
    limit: int
    has_more: bool
