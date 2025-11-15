import logging
from typing import Optional
from datetime import datetime
from config.settings import settings

logger = logging.getLogger(__name__)

class EmailService:
    """Email service for sending notifications"""
    
    def __init__(self):
        self.admin_email = settings.ADMIN_EMAIL_RECIPIENT
        self.from_email = settings.FROM_EMAIL
        # In production, integrate with SendGrid, AWS SES, or similar
        self.enabled = settings.EMAIL_ENABLED
    
    async def send_contact_notification(self, contact_data: dict) -> bool:
        """Send email notification when contact form is submitted"""
        try:
            if not self.enabled:
                logger.info(f"[EMAIL SIMULATION] New contact from: {contact_data.get('name')} ({contact_data.get('email')})")
                logger.info(f"[EMAIL SIMULATION] Message: {contact_data.get('message')}")
                return True
            
            # TODO: Implement actual email sending with SendGrid/SES
            # Example with SendGrid:
            # from sendgrid import SendGridAPIClient
            # from sendgrid.helpers.mail import Mail
            # message = Mail(
            #     from_email=self.from_email,
            #     to_emails=self.admin_email,
            #     subject=f"New Contact Form Submission from {contact_data['name']}",
            #     html_content=self._format_contact_email(contact_data)
            # )
            # sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            # response = sg.send(message)
            # return response.status_code == 202
            
            return True
            
        except Exception as e:
            logger.error(f"Error sending contact notification: {e}")
            return False
    
    async def send_newsletter_confirmation(self, email: str) -> bool:
        """Send confirmation email for newsletter subscription"""
        try:
            if not self.enabled:
                logger.info(f"[EMAIL SIMULATION] Newsletter confirmation sent to: {email}")
                return True
            
            # TODO: Implement actual email sending
            return True
            
        except Exception as e:
            logger.error(f"Error sending newsletter confirmation: {e}")
            return False
    
    
    async def send_service_inquiry_notification(self, inquiry_data: dict) -> bool:
        """Send email notification when service inquiry is submitted"""
        try:
            if not self.enabled:
                logger.info(f"[EMAIL SIMULATION] New service inquiry from: {inquiry_data.get('name')} ({inquiry_data.get('email')})")
                logger.info(f"[EMAIL SIMULATION] Service: {inquiry_data.get('service_type')}")
                logger.info(f"[EMAIL SIMULATION] Budget: {inquiry_data.get('budget_range', 'Not specified')}")
                return True
            
            # TODO: Implement actual email sending
            return True
            
        except Exception as e:
            logger.error(f"Error sending service inquiry notification: {e}")
            return False
    
    async def send_consultation_booking_notification(self, booking_data: dict) -> bool:
        """Send email notification when consultation is booked"""
        try:
            if not self.enabled:
                logger.info(f"[EMAIL SIMULATION] New consultation booking from: {booking_data.get('name')} ({booking_data.get('email')})")
                logger.info(f"[EMAIL SIMULATION] Service: {booking_data.get('service_interested')}")
                logger.info(f"[EMAIL SIMULATION] Date: {booking_data.get('preferred_date')} at {booking_data.get('preferred_time')}")
                return True
            
            # TODO: Implement actual email sending
            return True
            
        except Exception as e:
            logger.error(f"Error sending consultation booking notification: {e}")
            return False
    def _format_contact_email(self, contact_data: dict) -> str:
        """Format contact form data as HTML email"""
        return f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #2563eb;">New Contact Form Submission</h2>
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Name:</strong> {contact_data.get('name')}</p>
                    <p><strong>Email:</strong> {contact_data.get('email')}</p>
                    <p><strong>Phone:</strong> {contact_data.get('phone', 'Not provided')}</p>
                    <p><strong>Company:</strong> {contact_data.get('company', 'Not provided')}</p>
                    <p><strong>Service:</strong> {contact_data.get('service', 'Not specified')}</p>
                    <p><strong>Budget:</strong> {contact_data.get('budget', 'Not specified')}</p>
                    <p><strong>Timeline:</strong> {contact_data.get('timeline', 'Not specified')}</p>
                </div>
                <div style="margin: 20px 0;">
                    <h3 style="color: #2563eb;">Message:</h3>
                    <p style="background: #fff; padding: 15px; border-left: 4px solid #2563eb;">
                        {contact_data.get('message')}
                    </p>
                </div>
                <p style="color: #6b7280; font-size: 12px;">
                    Submitted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}
                </p>
            </body>
        </html>
        """

email_service = EmailService()