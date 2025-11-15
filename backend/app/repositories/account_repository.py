"""Account repository for data access."""
from typing import Optional, List, Dict, Any
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.repositories.base import BaseRepository
from app.models.account import AccountModel, AccountRole, AccountStatus
import uuid


class AccountRepository(BaseRepository):
    """Repository for account (team member) data access."""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db["accounts"])
    
    async def create(self, account_data: Dict[str, Any]) -> AccountModel:
        """Create a new account."""
        account_dict = {
            "id": str(uuid.uuid4()),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "status": AccountStatus.PENDING,
            "is_active": True,
            **account_data
        }
        
        await self.collection.insert_one(account_dict)
        return AccountModel(**account_dict)
    
    async def find_by_email(self, email: str, customer_id: Optional[str] = None) -> Optional[AccountModel]:
        """Find account by email (optionally scoped to customer)."""
        query = {"email": email.lower()}
        if customer_id:
            query["customer_id"] = customer_id
        
        account = await self.collection.find_one(query)
        return AccountModel(**account) if account else None
    
    async def find_by_id(self, account_id: str) -> Optional[AccountModel]:
        """Find account by ID."""
        account = await self.collection.find_one({"id": account_id})
        return AccountModel(**account) if account else None
    
    async def find_by_invitation_token(self, token: str) -> Optional[AccountModel]:
        """Find account by invitation token."""
        account = await self.collection.find_one({"invitation_token": token})
        return AccountModel(**account) if account else None
    
    async def find_by_customer(self, customer_id: str) -> List[AccountModel]:
        """Find all accounts for a customer."""
        cursor = self.collection.find({"customer_id": customer_id}).sort("created_at", -1)
        return [AccountModel(**doc) async for doc in cursor]
    
    async def update(self, account_id: str, update_data: Dict[str, Any]) -> Optional[AccountModel]:
        """Update account."""
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.collection.find_one_and_update(
            {"id": account_id},
            {"$set": update_data},
            return_document=True
        )
        
        return AccountModel(**result) if result else None
    
    async def update_last_login(self, account_id: str) -> None:
        """Update account's last login timestamp."""
        await self.collection.update_one(
            {"id": account_id},
            {"$set": {"last_login": datetime.utcnow(), "updated_at": datetime.utcnow()}}
        )
    
    async def accept_invitation(
        self,
        invitation_token: str,
        password_hash: str
    ) -> Optional[AccountModel]:
        """Accept invitation and activate account."""
        result = await self.collection.find_one_and_update(
            {"invitation_token": invitation_token},
            {
                "$set": {
                    "password_hash": password_hash,
                    "status": AccountStatus.ACTIVE,
                    "invitation_accepted_at": datetime.utcnow(),
                    "invitation_token": None,
                    "updated_at": datetime.utcnow()
                }
            },
            return_document=True
        )
        
        return AccountModel(**result) if result else None
    
    async def update_role(self, account_id: str, role: AccountRole) -> Optional[AccountModel]:
        """Update account role."""
        result = await self.collection.find_one_and_update(
            {"id": account_id},
            {"$set": {"role": role, "updated_at": datetime.utcnow()}},
            return_document=True
        )
        
        return AccountModel(**result) if result else None
    
    async def update_permissions(self, account_id: str, permissions: Dict[str, Any]) -> Optional[AccountModel]:
        """Update account permissions."""
        result = await self.collection.find_one_and_update(
            {"id": account_id},
            {"$set": {"permissions": permissions, "updated_at": datetime.utcnow()}},
            return_document=True
        )
        
        return AccountModel(**result) if result else None
    
    async def deactivate(self, account_id: str) -> bool:
        """Deactivate account."""
        result = await self.collection.update_one(
            {"id": account_id},
            {
                "$set": {
                    "is_active": False,
                    "status": AccountStatus.INACTIVE,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0
    
    async def delete(self, account_id: str) -> bool:
        """Delete account permanently."""
        result = await self.collection.delete_one({"id": account_id})
        return result.deleted_count > 0
    
    async def count_by_customer(self, customer_id: str) -> int:
        """Count accounts for a customer."""
        return await self.collection.count_documents({"customer_id": customer_id})
    
    async def count_by_role(self, customer_id: str, role: AccountRole) -> int:
        """Count accounts by role for a customer."""
        return await self.collection.count_documents({
            "customer_id": customer_id,
            "role": role
        })
    
    async def list_accounts(
        self,
        customer_id: str,
        skip: int = 0,
        limit: int = 10,
        filters: Optional[Dict[str, Any]] = None
    ) -> tuple[List[AccountModel], int]:
        """List accounts with pagination."""
        query = {"customer_id": customer_id}
        if filters:
            query.update(filters)
        
        cursor = self.collection.find(query).skip(skip).limit(limit).sort("created_at", -1)
        accounts = [AccountModel(**doc) async for doc in cursor]
        total = await self.collection.count_documents(query)
        
        return accounts, total
