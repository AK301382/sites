"""Base repository with common CRUD operations."""
from typing import List, Optional, Dict, Any
from motor.motor_asyncio import AsyncIOMotorCollection
from datetime import datetime, timezone


class BaseRepository:
    """Base repository with common database operations."""
    
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection
    
    async def create(self, data: dict) -> dict:
        """Create a new document."""
        result = await self.collection.insert_one(data)
        data['_id'] = str(result.inserted_id)
        return data
    
    async def find_by_id(self, doc_id: str) -> Optional[dict]:
        """Find a document by ID."""
        return await self.collection.find_one({"id": doc_id})
    
    async def find_one(self, query: dict) -> Optional[dict]:
        """Find one document matching query."""
        return await self.collection.find_one(query)
    
    async def find_many(self, query: dict = None, skip: int = 0, limit: int = 50, sort: List[tuple] = None) -> List[dict]:
        """Find multiple documents matching query."""
        query = query or {}
        cursor = self.collection.find(query).skip(skip).limit(limit)
        if sort:
            cursor = cursor.sort(sort)
        return await cursor.to_list(length=limit)
    
    async def count(self, query: dict = None) -> int:
        """Count documents matching query."""
        query = query or {}
        return await self.collection.count_documents(query)
    
    async def update(self, doc_id: str, update_data: dict) -> Optional[dict]:
        """Update a document by ID."""
        update_data['updated_at'] = datetime.now(timezone.utc)
        result = await self.collection.find_one_and_update(
            {"id": doc_id},
            {"$set": update_data},
            return_document=True
        )
        return result
    
    async def delete(self, doc_id: str) -> bool:
        """Delete a document by ID."""
        result = await self.collection.delete_one({"id": doc_id})
        return result.deleted_count > 0
    
    async def delete_many(self, query: dict) -> int:
        """Delete multiple documents matching query."""
        result = await self.collection.delete_many(query)
        return result.deleted_count
