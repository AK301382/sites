import re
from datetime import datetime, timezone
from typing import Optional
import logging

logger = logging.getLogger(__name__)

def serialize_datetime(dt: datetime) -> str:
    """Convert datetime to ISO format string"""
    if isinstance(dt, datetime):
        return dt.isoformat()
    return dt

def deserialize_datetime(dt_str: str) -> datetime:
    """Convert ISO format string to datetime"""
    if isinstance(dt_str, str):
        return datetime.fromisoformat(dt_str)
    return dt_str

def sanitize_slug(text: str) -> str:
    """Convert text to URL-safe slug"""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text

def validate_email(email: str) -> bool:
    """Basic email validation"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def get_client_ip(request) -> Optional[str]:
    """Extract client IP from request"""
    try:
        forwarded = request.headers.get('X-Forwarded-For')
        if forwarded:
            return forwarded.split(',')[0]
        return request.client.host
    except Exception as e:
        logger.error(f"Error getting client IP: {e}")
        return None

def calculate_read_time(content: str) -> int:
    """Calculate reading time in minutes (avg 200 words/min)"""
    words = len(content.split())
    minutes = max(1, round(words / 200))
    return minutes