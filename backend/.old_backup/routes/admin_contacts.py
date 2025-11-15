from fastapi import APIRouter, Depends, HTTPException, status
from database import contacts_collection
from auth import get_current_user
from models import SuccessResponse
from typing import Optional
from config.logging_config import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/admin/contacts", tags=["admin-contacts"])

@router.get("", response_model=SuccessResponse)
async def get_all_contacts(
    current_user: dict = Depends(get_current_user),
    status_filter: Optional[str] = None,
    limit: int = 100,
    skip: int = 0
):
    """
    Get all contact submissions with filtering
    """
    try:
        query = {}
        if status_filter:
            query['status'] = status_filter
        
        contacts = await contacts_collection.find(
            query, {"_id": 0}
        ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        
        total = await contacts_collection.count_documents(query)
        
        return SuccessResponse(
            message="Contacts retrieved successfully",
            data={"contacts": contacts, "total": total, "count": len(contacts)}
        )
    except Exception as e:
        logger.error(f"Error fetching contacts: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch contacts"
        )

@router.get("/{contact_id}", response_model=SuccessResponse)
async def get_contact_by_id(
    contact_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get single contact by ID
    """
    try:
        contact = await contacts_collection.find_one(
            {"id": contact_id},
            {"_id": 0}
        )
        
        if not contact:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contact not found"
            )
        
        return SuccessResponse(
            message="Contact retrieved successfully",
            data={"contact": contact}
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching contact: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch contact"
        )

@router.put("/{contact_id}/status", response_model=SuccessResponse)
async def update_contact_status(
    contact_id: str,
    new_status: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Update contact status (new, read, replied, archived)
    """
    try:
        valid_statuses = ["new", "read", "replied", "archived"]
        if new_status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        
        result = await contacts_collection.update_one(
            {"id": contact_id},
            {"$set": {"status": new_status}}
        )
        
        if result.modified_count > 0:
            logger.info(f"Contact {contact_id} status updated to {new_status} by {current_user['username']}")
            return SuccessResponse(
                message=f"Contact status updated to {new_status}",
                data={"id": contact_id, "status": new_status}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contact not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating contact status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update contact status"
        )

@router.delete("/{contact_id}", response_model=SuccessResponse)
async def delete_contact(
    contact_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a contact submission
    """
    try:
        result = await contacts_collection.delete_one({"id": contact_id})
        
        if result.deleted_count > 0:
            logger.info(f"Contact {contact_id} deleted by {current_user['username']}")
            return SuccessResponse(
                message="Contact deleted successfully",
                data={"id": contact_id}
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contact not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting contact: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete contact"
        )
