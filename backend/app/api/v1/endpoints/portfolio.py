"""Portfolio endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.portfolio import PortfolioResponse
from app.schemas.common import PaginationParams
from app.services import PortfolioService
from app.api.deps import get_portfolio_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])


@router.get("/", response_model=List[PortfolioResponse])
async def get_portfolio_items(
    pagination: PaginationParams = Depends(),
    service: PortfolioService = Depends(get_portfolio_service)
):
    """Get all published portfolio items."""
    items = await service.get_all_items(pagination.skip, pagination.limit)
    return items


@router.get("/featured", response_model=List[PortfolioResponse])
async def get_featured_portfolio(
    limit: int = 6,
    service: PortfolioService = Depends(get_portfolio_service)
):
    """Get featured portfolio items."""
    items = await service.get_featured(limit)
    return items


@router.get("/category/{category}", response_model=List[PortfolioResponse])
async def get_portfolio_by_category(
    category: str,
    pagination: PaginationParams = Depends(),
    service: PortfolioService = Depends(get_portfolio_service)
):
    """Get portfolio items by category."""
    items = await service.get_by_category(category, pagination.skip, pagination.limit)
    return items


@router.get("/{slug}", response_model=PortfolioResponse)
async def get_portfolio_item(
    slug: str,
    service: PortfolioService = Depends(get_portfolio_service)
):
    """Get portfolio item by slug."""
    item = await service.get_by_slug(slug)
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Portfolio item '{slug}' not found"
        )
    
    return item
