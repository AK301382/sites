"""Customer repository for data access."""
from typing import Optional, List, Dict, Any
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.base import BaseRepository
from app.models.customer import CustomerModel, SubscriptionPlan, SubscriptionStatus
import uuid


class CustomerRepository(BaseRepository):
    """Repository for customer data access."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db["customers"])
    
    async def create(self, customer_data: Dict[str, Any]) -> CustomerModel:
        """Create a new customer."""
        customer_dict = {
            "id": str(uuid.uuid4()),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "subscription_plan": SubscriptionPlan.FREE,
            "subscription_status": SubscriptionStatus.TRIAL,
            "is_active": True,
            "is_verified": False,
            "settings": {},
            **customer_data
        }
        
        await self.collection.insert_one(customer_dict)
        return CustomerModel(**customer_dict)
    
    async def find_by_email(self, email: str) -> Optional[CustomerModel]:
        """Find customer by email."""
        customer = await self.collection.find_one({"email": email.lower()})
        return CustomerModel(**customer) if customer else None
    
    async def find_by_id(self, customer_id: str) -> Optional[CustomerModel]:
        """Find customer by ID."""
        customer = await self.collection.find_one({"id": customer_id})
        return CustomerModel(**customer) if customer else None
    
    async def update(self, customer_id: str, update_data: Dict[str, Any]) -> Optional[CustomerModel]:
        """Update customer."""
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.collection.find_one_and_update(
            {"id": customer_id},
            {"$set": update_data},
            return_document=True
        )
        
        return CustomerModel(**result) if result else None
    
    async def update_last_login(self, customer_id: str) -> None:
        """Update customer's last login timestamp."""
        await self.collection.update_one(
            {"id": customer_id},
            {"$set": {"last_login": datetime.utcnow(), "updated_at": datetime.utcnow()}}
        )
    
    async def verify_email(self, customer_id: str) -> Optional[CustomerModel]:
        """Mark customer email as verified."""
        result = await self.collection.find_one_and_update(
            {"id": customer_id},
            {
                "$set": {
                    "is_verified": True,
                    "verification_token": None,
                    "updated_at": datetime.utcnow()
                }
            },
            return_document=True
        )
        return CustomerModel(**result) if result else None
    
    async def update_subscription(
        self,
        customer_id: str,
        plan: SubscriptionPlan,
        status: SubscriptionStatus,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Optional[CustomerModel]:
        """Update customer subscription."""
        update_data = {
            "subscription_plan": plan,
            "subscription_status": status,
            "updated_at": datetime.utcnow()
        }
        
        if start_date:
            update_data["subscription_start_date"] = start_date
        if end_date:
            update_data["subscription_end_date"] = end_date
        
        result = await self.collection.find_one_and_update(
            {"id": customer_id},
            {"$set": update_data},
            return_document=True
        )
        
        return CustomerModel(**result) if result else None
    
    async def deactivate(self, customer_id: str) -> bool:
        """Deactivate customer account."""
        result = await self.collection.update_one(
            {"id": customer_id},
            {
                "$set": {
                    "is_active": False,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0
    
    async def list_customers(
        self,
        skip: int = 0,
        limit: int = 10,
        filters: Optional[Dict[str, Any]] = None
    ) -> tuple[List[CustomerModel], int]:
        """List customers with pagination."""
        query = filters or {}
        
        cursor = self.collection.find(query).skip(skip).limit(limit).sort("created_at", -1)
        customers = [CustomerModel(**doc) async for doc in cursor]
        total = await self.collection.count_documents(query)
        
        return customers, total
    
    async def count_by_subscription_plan(self, plan: SubscriptionPlan) -> int:
        """Count customers by subscription plan."""
        return await self.collection.count_documents({"subscription_plan": plan})
    
    async def get_trial_expiring_soon(self, days: int = 3) -> List[CustomerModel]:
        """Get customers whose trial is expiring soon."""
        from datetime import timedelta
        
        cutoff_date = datetime.utcnow() + timedelta(days=days)
        
        cursor = self.collection.find({
            "subscription_status": SubscriptionStatus.TRIAL,
            "trial_end_date": {"$lte": cutoff_date, "$gte": datetime.utcnow()}
        })
        
        return [CustomerModel(**doc) async for doc in cursor]
