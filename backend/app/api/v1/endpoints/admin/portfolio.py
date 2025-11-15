"""Admin portfolio management endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.portfolio import PortfolioCreate, PortfolioUpdate, PortfolioResponse
from app.schemas.common import SuccessResponse
from app.services import PortfolioService
from app.api.deps import get_portfolio_service
from app.core.dependencies import get_current_admin_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin/portfolio", tags=["Admin - Portfolio"])


@router.post("/", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
async def create_portfolio_item(
    item: PortfolioCreate,
    current_user: dict = Depends(get_current_admin_user),
    service: PortfolioService = Depends(get_portfolio_service)
):
    """Create a new portfolio item."""
    try:
        result = await service.create_item(item.model_dump())
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )


@router.put("/{item_id}", response_model=PortfolioResponse)
async def update_portfolio_item(
    item_id: str,
    update_data: PortfolioUpdate,
    current_user: dict = Depends(get_current_admin_user),
    service: PortfolioService = Depends(get_portfolio_service)
):
    """Update a portfolio item."""
    result = await service.update_item(item_id, update_data.model_dump(exclude_unset=True))
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio item not found"
        )
    
    return result


@router.delete("/{item_id}", response_model=SuccessResponse)
async def delete_portfolio_item(
    item_id: str,
    current_user: dict = Depends(get_current_admin_user),
    service: PortfolioService = Depends(get_portfolio_service)
):
    """Delete a portfolio item."""
    success = await service.delete_item(item_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio item not found"
        )
    
    return SuccessResponse(
        success=True,
        message="Portfolio item deleted successfully"
    )
