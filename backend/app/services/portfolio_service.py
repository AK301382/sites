"""Portfolio service - Business logic for portfolio management."""
from app.repositories.portfolio_repository import PortfolioRepository
from app.models.portfolio import PortfolioItem
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class PortfolioService:
    """Service for handling portfolio items."""
    
    def __init__(self, repository: PortfolioRepository):
        self.repository = repository
    
    async def create_item(self, data: dict) -> PortfolioItem:
        """Create a new portfolio item."""
        # Check if slug already exists
        existing = await self.repository.find_by_slug(data.get('slug'))
        if existing:
            raise ValueError(f"Portfolio item with slug '{data.get('slug')}' already exists")
        
        item = PortfolioItem(**data)
        result = await self.repository.create(item.model_dump())
        logger.info(f"Portfolio item created: {result['id']}")
        return PortfolioItem(**result)
    
    async def get_all_items(self, skip: int = 0, limit: int = 50) -> List[PortfolioItem]:
        """Get all published portfolio items."""
        results = await self.repository.find_published(skip, limit)
        return [PortfolioItem(**r) for r in results]
    
    async def get_by_slug(self, slug: str) -> Optional[PortfolioItem]:
        """Get portfolio item by slug."""
        result = await self.repository.find_by_slug(slug)
        if result:
            return PortfolioItem(**result)
        return None
    
    async def get_by_category(self, category: str, skip: int = 0, limit: int = 50) -> List[PortfolioItem]:
        """Get portfolio items by category."""
        results = await self.repository.find_by_category(category, skip, limit)
        return [PortfolioItem(**r) for r in results]
    
    async def get_featured(self, limit: int = 6) -> List[PortfolioItem]:
        """Get featured portfolio items."""
        results = await self.repository.find_featured(limit)
        return [PortfolioItem(**r) for r in results]
    
    async def update_item(self, item_id: str, update_data: dict) -> Optional[PortfolioItem]:
        """Update a portfolio item."""
        result = await self.repository.update(item_id, update_data)
        if result:
            logger.info(f"Portfolio item updated: {item_id}")
            return PortfolioItem(**result)
        return None
    
    async def delete_item(self, item_id: str) -> bool:
        """Delete a portfolio item."""
        success = await self.repository.delete(item_id)
        if success:
            logger.info(f"Portfolio item deleted: {item_id}")
        return success
