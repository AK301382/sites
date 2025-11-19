"""
Notification Cleanup Scheduler
Automatically removes notifications 2 days after appointment date
"""

import asyncio
import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

logger = logging.getLogger(__name__)

class NotificationCleanupScheduler:
    def __init__(self, notification_service):
        self.notification_service = notification_service
        self.scheduler = AsyncIOScheduler()
    
    async def cleanup_task(self):
        """
        Run cleanup task - delete notifications 2 days after appointment date
        """
        try:
            logger.info("Starting notification cleanup task...")
            deleted_count = await self.notification_service.cleanup_old_notifications()
            
            if deleted_count > 0:
                logger.info(f"Notification cleanup complete: {deleted_count} notifications deleted")
            else:
                logger.debug("Notification cleanup complete: no old notifications found")
                
        except Exception as e:
            logger.error(f"Error in notification cleanup task: {str(e)}")
    
    def start(self):
        """
        Start the scheduler - runs cleanup every day at 2 AM
        """
        try:
            # Run cleanup every day at 2:00 AM
            self.scheduler.add_job(
                self.cleanup_task,
                trigger=CronTrigger(hour=2, minute=0),
                id='notification_cleanup',
                name='Cleanup old notifications',
                replace_existing=True
            )
            
            self.scheduler.start()
            logger.info("Notification cleanup scheduler started (runs daily at 2:00 AM)")
            
        except Exception as e:
            logger.error(f"Error starting notification cleanup scheduler: {str(e)}")
    
    def shutdown(self):
        """
        Shutdown the scheduler
        """
        try:
            self.scheduler.shutdown()
            logger.info("Notification cleanup scheduler stopped")
        except Exception as e:
            logger.error(f"Error stopping notification cleanup scheduler: {str(e)}")

# Global scheduler instance
cleanup_scheduler = None

def initialize_cleanup_scheduler(notification_service):
    """
    Initialize and start the cleanup scheduler
    """
    global cleanup_scheduler
    cleanup_scheduler = NotificationCleanupScheduler(notification_service)
    cleanup_scheduler.start()
    return cleanup_scheduler

def shutdown_cleanup_scheduler():
    """
    Shutdown the cleanup scheduler
    """
    global cleanup_scheduler
    if cleanup_scheduler:
        cleanup_scheduler.shutdown()
