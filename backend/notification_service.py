"""
Notification Service - Manages in-app notifications for users
Supports multi-language notifications with automatic translation
"""

import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, List
from translation_service import translation_service

logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self, db):
        self.db = db
    
    async def create_notification(
        self,
        user_id: str,
        notification_type: str,
        title_text: str,
        message_text: str,
        appointment_id: Optional[str] = None,
        source_lang: str = 'de'
    ) -> Dict:
        """
        Create a notification for a user with automatic translation
        
        Args:
            user_id: User ID to send notification to
            notification_type: Type of notification (appointment_confirmed, appointment_reminder, etc.)
            title_text: Notification title (in source language, default German)
            message_text: Notification message (in source language, default German)
            appointment_id: Optional appointment ID reference
            source_lang: Source language code (default 'de')
        
        Returns:
            Created notification dict
        """
        try:
            # Translate title and message to all languages
            title_translations = await translation_service.translate_to_all_languages(title_text, source_lang)
            message_translations = await translation_service.translate_to_all_languages(message_text, source_lang)
            
            # Import uuid here to avoid circular imports
            import uuid
            
            notification = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "type": notification_type,
                "title_de": title_translations.get('de', title_text),
                "title_en": title_translations.get('en', title_text),
                "title_fr": title_translations.get('fr', title_text),
                "message_de": message_translations.get('de', message_text),
                "message_en": message_translations.get('en', message_text),
                "message_fr": message_translations.get('fr', message_text),
                "appointment_id": appointment_id,
                "is_read": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            
            # Save to database
            await self.db.notifications.insert_one(notification)
            
            logger.info(f"Notification created for user {user_id}: {notification_type}")
            return notification
            
        except Exception as e:
            logger.error(f"Error creating notification: {str(e)}")
            raise
    
    async def get_user_notifications(
        self,
        user_id: str,
        limit: int = 50,
        unread_only: bool = False
    ) -> List[Dict]:
        """
        Get notifications for a user
        
        Args:
            user_id: User ID
            limit: Maximum number of notifications to return
            unread_only: If True, only return unread notifications
        
        Returns:
            List of notifications
        """
        try:
            query = {"user_id": user_id}
            
            if unread_only:
                query["is_read"] = False
            
            notifications = await self.db.notifications.find(
                query,
                {"_id": 0}
            ).sort("created_at", -1).limit(limit).to_list(limit)
            
            return notifications
            
        except Exception as e:
            logger.error(f"Error getting notifications: {str(e)}")
            return []
    
    async def get_unread_count(self, user_id: str) -> int:
        """
        Get count of unread notifications for a user
        
        Args:
            user_id: User ID
        
        Returns:
            Number of unread notifications
        """
        try:
            count = await self.db.notifications.count_documents({
                "user_id": user_id,
                "is_read": False
            })
            return count
            
        except Exception as e:
            logger.error(f"Error counting unread notifications: {str(e)}")
            return 0
    
    async def mark_as_read(self, notification_id: str, user_id: str) -> bool:
        """
        Mark a notification as read
        
        Args:
            notification_id: Notification ID
            user_id: User ID (for security check)
        
        Returns:
            True if successful, False otherwise
        """
        try:
            result = await self.db.notifications.update_one(
                {"id": notification_id, "user_id": user_id},
                {"$set": {"is_read": True}}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            logger.error(f"Error marking notification as read: {str(e)}")
            return False
    
    async def mark_all_as_read(self, user_id: str) -> int:
        """
        Mark all notifications as read for a user
        
        Args:
            user_id: User ID
        
        Returns:
            Number of notifications marked as read
        """
        try:
            result = await self.db.notifications.update_many(
                {"user_id": user_id, "is_read": False},
                {"$set": {"is_read": True}}
            )
            
            return result.modified_count
            
        except Exception as e:
            logger.error(f"Error marking all notifications as read: {str(e)}")
            return 0
    
    async def delete_notification(self, notification_id: str, user_id: str) -> bool:
        """
        Delete a notification
        
        Args:
            notification_id: Notification ID
            user_id: User ID (for security check)
        
        Returns:
            True if successful, False otherwise
        """
        try:
            result = await self.db.notifications.delete_one({
                "id": notification_id,
                "user_id": user_id
            })
            
            return result.deleted_count > 0
            
        except Exception as e:
            logger.error(f"Error deleting notification: {str(e)}")
            return False
    
    async def cleanup_old_notifications(self) -> int:
        """
        Delete notifications older than 2 days after their appointment date
        
        Returns:
            Number of notifications deleted
        """
        try:
            # Get all notifications with appointment_id
            notifications = await self.db.notifications.find(
                {"appointment_id": {"$ne": None}},
                {"_id": 0}
            ).to_list(10000)
            
            deleted_count = 0
            current_date = datetime.now(timezone.utc).date()
            
            for notif in notifications:
                appointment = await self.db.appointments.find_one(
                    {"id": notif["appointment_id"]},
                    {"_id": 0}
                )
                
                if appointment:
                    # Parse appointment date
                    from datetime import datetime as dt
                    appt_date = dt.strptime(appointment["appointment_date"], "%Y-%m-%d").date()
                    
                    # Check if 2 days have passed since appointment date
                    days_passed = (current_date - appt_date).days
                    
                    if days_passed >= 2:
                        # Delete notification
                        result = await self.db.notifications.delete_one({"id": notif["id"]})
                        if result.deleted_count > 0:
                            deleted_count += 1
            
            if deleted_count > 0:
                logger.info(f"Cleaned up {deleted_count} old notifications")
            
            return deleted_count
            
        except Exception as e:
            logger.error(f"Error cleaning up old notifications: {str(e)}")
            return 0
