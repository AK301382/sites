"""
Reminder Scheduler - Sends reminder notifications 2-3 hours before appointments
Runs every 30 minutes to check for upcoming appointments
"""

import asyncio
import logging
from datetime import datetime, timedelta, timezone
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

logger = logging.getLogger(__name__)

class ReminderScheduler:
    """
    Scheduler برای ارسال یادآوری قبل از appointment
    هر 30 دقیقه چک می‌کند
    """
    
    def __init__(self, db, notification_service):
        self.db = db
        self.notification_service = notification_service
        self.scheduler = AsyncIOScheduler()
    
    async def check_upcoming_appointments(self):
        """
        چک می‌کند appointments که 2-3 ساعت دیگر هستند
        """
        try:
            logger.info("Starting reminder check task...")
            
            now = datetime.now(timezone.utc)
            
            # محاسبه بازه زمانی: 2 تا 3 ساعت بعد
            reminder_start = now + timedelta(hours=2)
            reminder_end = now + timedelta(hours=3)
            
            # Query appointments که confirmed هستند و reminder ارسال نشده
            query = {
                "status": "confirmed",  # فقط confirmed appointments
                "reminder_sent": {"$ne": True},  # reminder ارسال نشده
            }
            
            appointments = await self.db.appointments.find(
                query,
                {"_id": 0}
            ).to_list(1000)
            
            sent_count = 0
            
            for appt in appointments:
                try:
                    # Parse appointment datetime
                    appt_date = datetime.strptime(appt["appointment_date"], "%Y-%m-%d")
                    appt_time_parts = appt["appointment_time"].split(":")
                    appt_datetime = appt_date.replace(
                        hour=int(appt_time_parts[0]),
                        minute=int(appt_time_parts[1]),
                        second=0,
                        microsecond=0,
                        tzinfo=timezone.utc
                    )
                    
                    # Check if in reminder window (2-3 hours)
                    if reminder_start <= appt_datetime <= reminder_end:
                        await self.send_reminder(appt)
                        sent_count += 1
                        
                except Exception as e:
                    logger.error(f"Error processing appointment {appt.get('id')}: {str(e)}")
                    continue
            
            if sent_count > 0:
                logger.info(f"Reminder check complete: {sent_count} reminders sent")
            else:
                logger.debug("Reminder check complete: no reminders to send")
                
        except Exception as e:
            logger.error(f"Error in reminder check task: {str(e)}")
    
    async def send_reminder(self, appointment):
        """ارسال reminder notification"""
        try:
            # فقط اگر user_id داشته باشد
            if not appointment.get("user_id"):
                logger.debug(f"Skipping reminder for appointment {appointment['id']} - no user_id")
                return
            
            # Get service details
            service = await self.db.services.find_one(
                {"id": appointment["service_id"]},
                {"_id": 0}
            )
            service_name = service.get("name_de", "Ihr Service") if service else "Ihr Service"
            
            # Get artist details
            artist = await self.db.artists.find_one(
                {"id": appointment["artist_id"]},
                {"_id": 0}
            )
            artist_name = artist.get("name", "Ihr Stylist") if artist else "Ihr Stylist"
            
            # Create notification با German text
            title_text = "Terminerinnerung 🔔"
            message_text = (
                f"Ihr Termin für {service_name} "
                f"mit {artist_name} "
                f"ist in 2 Stunden! "
                f"Datum: {appointment['appointment_date']} "
                f"um {appointment['appointment_time']} Uhr."
            )
            
            # Send notification
            await self.notification_service.create_notification(
                user_id=appointment["user_id"],
                notification_type="appointment_reminder",
                title_text=title_text,
                message_text=message_text,
                appointment_id=appointment["id"]
            )
            
            # Mark reminder as sent
            await self.db.appointments.update_one(
                {"id": appointment["id"]},
                {
                    "$set": {
                        "reminder_sent": True,
                        "reminder_sent_at": datetime.now(timezone.utc).isoformat()
                    }
                }
            )
            
            logger.info(f"Reminder sent for appointment {appointment['id']} to user {appointment['user_id']}")
            
        except Exception as e:
            logger.error(f"Error sending reminder for appointment {appointment.get('id')}: {str(e)}")
    
    def start(self):
        """شروع scheduler - هر 30 دقیقه چک می‌کند"""
        try:
            self.scheduler.add_job(
                self.check_upcoming_appointments,
                trigger=IntervalTrigger(minutes=30),
                id='appointment_reminder',
                name='Check upcoming appointments for reminders',
                replace_existing=True
            )
            
            self.scheduler.start()
            logger.info("Reminder scheduler started (runs every 30 minutes)")
            
        except Exception as e:
            logger.error(f"Error starting reminder scheduler: {str(e)}")
    
    def shutdown(self):
        """متوقف کردن scheduler"""
        try:
            self.scheduler.shutdown()
            logger.info("Reminder scheduler stopped")
        except Exception as e:
            logger.error(f"Error stopping reminder scheduler: {str(e)}")

# Global instance
reminder_scheduler = None

def initialize_reminder_scheduler(db, notification_service):
    """Initialize and start reminder scheduler"""
    global reminder_scheduler
    reminder_scheduler = ReminderScheduler(db, notification_service)
    reminder_scheduler.start()
    return reminder_scheduler

def shutdown_reminder_scheduler():
    """Shutdown reminder scheduler"""
    global reminder_scheduler
    if reminder_scheduler:
        reminder_scheduler.shutdown()
