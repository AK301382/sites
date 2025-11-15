"""Blog service - Business logic for blog management."""
from app.repositories.blog_repository import BlogRepository
from app.models.blog import BlogPost
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class BlogService:
    """Service for handling blog posts."""
    
    def __init__(self, repository: BlogRepository):
        self.repository = repository
    
    async def create_post(self, data: dict) -> BlogPost:
        """Create a new blog post."""
        # Check if slug already exists
        existing = await self.repository.find_by_slug(data.get('slug'))
        if existing:
            raise ValueError(f"Blog post with slug '{data.get('slug')}' already exists")
        
        post = BlogPost(**data)
        result = await self.repository.create(post.model_dump())
        logger.info(f"Blog post created: {result['id']}")
        return BlogPost(**result)
    
    async def get_all_posts(self, skip: int = 0, limit: int = 50) -> List[BlogPost]:
        """Get all published blog posts."""
        results = await self.repository.find_published(skip, limit)
        return [BlogPost(**r) for r in results]
    
    async def get_by_slug(self, slug: str) -> Optional[BlogPost]:
        """Get blog post by slug."""
        result = await self.repository.find_by_slug(slug)
        if result:
            return BlogPost(**result)
        return None
    
    async def get_by_category(self, category: str, skip: int = 0, limit: int = 50) -> List[BlogPost]:
        """Get blog posts by category."""
        results = await self.repository.find_by_category(category, skip, limit)
        return [BlogPost(**r) for r in results]
    
    async def get_featured(self, limit: int = 3) -> List[BlogPost]:
        """Get featured blog posts."""
        results = await self.repository.find_featured(limit)
        return [BlogPost(**r) for r in results]
    
    async def search_posts(self, search_term: str, skip: int = 0, limit: int = 50) -> List[BlogPost]:
        """Search blog posts by text."""
        results = await self.repository.search(search_term, skip, limit)
        return [BlogPost(**r) for r in results]
    
    async def update_post(self, post_id: str, update_data: dict) -> Optional[BlogPost]:
        """Update a blog post."""
        result = await self.repository.update(post_id, update_data)
        if result:
            logger.info(f"Blog post updated: {post_id}")
            return BlogPost(**result)
        return None
    
    async def delete_post(self, post_id: str) -> bool:
        """Delete a blog post."""
        success = await self.repository.delete(post_id)
        if success:
            logger.info(f"Blog post deleted: {post_id}")
        return success
