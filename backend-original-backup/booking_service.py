"""
Booking Service - Smart Availability Management
Handles time slot calculations and overlap detection
"""

from datetime import datetime, timedelta
from typing import List, Dict, Optional
import logging
import re

logger = logging.getLogger(__name__)


def parse_duration(duration_str: str) -> int:
    """
    Parse duration string to minutes
    
    Examples:
        "45 min" → 45
        "1 Std" → 60
        "90 mins" → 90
        "1.5 Std" → 90
    
    Args:
        duration_str: Duration string in various formats
    
    Returns:
        Duration in minutes (default 60 if parsing fails)
    """
    try:
        # Extract number from string (including decimals)
        numbers = re.findall(r'\d+\.?\d*', duration_str)
        if numbers:
            minutes = float(numbers[0])
            
            # Check if it's hours (Std/hour/h)
            if any(word in duration_str.lower() for word in ['std', 'hour', ' h ']):
                minutes = minutes * 60
            
            return int(minutes)
    except Exception as e:
        logger.warning(f"Failed to parse duration '{duration_str}': {str(e)}")
    
    return 60  # Default 60 minutes


def time_to_minutes(time_str: str) -> int:
    """
    Convert time string to minutes from midnight
    
    Examples:
        "09:00" → 540
        "14:30" → 870
    
    Args:
        time_str: Time in HH:MM format
    
    Returns:
        Minutes from midnight
    """
    try:
        hour, minute = map(int, time_str.split(':'))
        return hour * 60 + minute
    except Exception as e:
        logger.error(f"Failed to convert time '{time_str}': {str(e)}")
        return 0


def minutes_to_time(minutes: int) -> str:
    """
    Convert minutes from midnight to time string
    
    Examples:
        540 → "09:00"
        870 → "14:30"
    
    Args:
        minutes: Minutes from midnight
    
    Returns:
        Time string in HH:MM format
    """
    hour = minutes // 60
    minute = minutes % 60
    return f"{hour:02d}:{minute:02d}"


def check_overlap(start1: int, duration1: int, start2: int, duration2: int) -> bool:
    """
    Check if two time slots overlap
    
    Args:
        start1: Start time in minutes from midnight
        duration1: Duration in minutes
        start2: Start time in minutes from midnight
        duration2: Duration in minutes
    
    Returns:
        True if overlapping, False otherwise
    
    Example:
        10:00-11:00 and 10:30-11:30 → True (overlap)
        10:00-11:00 and 11:00-12:00 → False (no overlap)
    """
    end1 = start1 + duration1
    end2 = start2 + duration2
    
    # Two slots overlap if one starts before the other ends
    # No overlap: end1 <= start2 OR end2 <= start1
    return not (end1 <= start2 or end2 <= start1)


def generate_time_slots(
    start_hour: int = 9,
    end_hour: int = 19,
    interval: int = 30
) -> List[str]:
    """
    Generate all possible time slots for a day
    
    Args:
        start_hour: Opening hour (default 9 AM)
        end_hour: Closing hour (default 7 PM)
        interval: Slot interval in minutes (default 30 min)
    
    Returns:
        List of time strings (e.g., ["09:00", "09:30", "10:00", ...])
    """
    slots = []
    current = start_hour * 60  # Convert to minutes
    end = end_hour * 60
    
    while current < end:
        slots.append(minutes_to_time(current))
        current += interval
    
    return slots


async def get_blocked_slots(
    db,
    artist_id: str,
    date: str,
    exclude_appointment_id: Optional[str] = None
) -> List[Dict]:
    """
    Get all blocked time slots for an artist on a specific date
    
    Args:
        db: MongoDB database instance
        artist_id: Artist ID
        date: Date in YYYY-MM-DD format
        exclude_appointment_id: Appointment ID to exclude (for rescheduling)
    
    Returns:
        List of blocked slots with start time and duration
        Example: [{"start": "10:00", "duration": 45}, ...]
    """
    query = {
        "artist_id": artist_id,
        "appointment_date": date,
        "status": {"$in": ["pending", "confirmed"]}  # Ignore cancelled/completed
    }
    
    if exclude_appointment_id:
        query["id"] = {"$ne": exclude_appointment_id}
    
    # Get all appointments for this artist on this date
    appointments = await db.appointments.find(query, {"_id": 0}).to_list(1000)
    
    blocked_slots = []
    
    for appt in appointments:
        # Get service details to know duration
        service = await db.services.find_one({"id": appt["service_id"]}, {"_id": 0})
        
        if service:
            duration = parse_duration(service.get("duration", "60 min"))
            
            blocked_slots.append({
                "start": appt["appointment_time"],
                "duration": duration,
                "appointment_id": appt["id"]
            })
            
            logger.debug(
                f"Blocked slot: {appt['appointment_time']} "
                f"for {duration} min (appointment {appt['id']})"
            )
    
    return blocked_slots


def filter_available_slots(
    all_slots: List[str],
    blocked_slots: List[Dict],
    required_duration: int,
    buffer_time: int = 10
) -> List[str]:
    """
    Filter available time slots based on blocked slots and duration
    
    Args:
        all_slots: All possible time slots
        blocked_slots: Currently blocked slots
        required_duration: Required duration for the service
        buffer_time: Buffer time between appointments (default 10 min)
    
    Returns:
        List of available time slots
    
    Example:
        If 10:00-11:00 is blocked and service needs 45 min:
        - 09:00 is available (ends at 09:45, buffer until 09:55)
        - 09:30 is NOT available (ends at 10:15, overlaps with 10:00)
        - 11:00 is available (starts after blocked slot)
    """
    available = []
    
    for slot in all_slots:
        slot_minutes = time_to_minutes(slot)
        is_available = True
        
        # Check if this slot + duration + buffer overlaps with any blocked slot
        for blocked in blocked_slots:
            blocked_start = time_to_minutes(blocked["start"])
            blocked_duration = blocked["duration"] + buffer_time
            
            # Check overlap
            if check_overlap(
                slot_minutes,
                required_duration + buffer_time,
                blocked_start,
                blocked_duration
            ):
                is_available = False
                logger.debug(
                    f"Slot {slot} not available: overlaps with "
                    f"{blocked['start']} ({blocked['duration']}min)"
                )
                break
        
        if is_available:
            available.append(slot)
    
    return available


def get_business_hours(date_str: str) -> Dict[str, int]:
    """
    Get business hours for a specific date
    Can be extended to support different hours for different days
    
    Args:
        date_str: Date in YYYY-MM-DD format
    
    Returns:
        Dictionary with start_hour and end_hour
    """
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d")
        weekday = date.weekday()
        
        # Monday-Friday: 9:00-19:00
        if weekday < 5:
            return {"start_hour": 9, "end_hour": 19}
        
        # Saturday: 10:00-17:00
        elif weekday == 5:
            return {"start_hour": 10, "end_hour": 17}
        
        # Sunday: Closed
        else:
            return {"start_hour": 0, "end_hour": 0}
    
    except Exception as e:
        logger.error(f"Error getting business hours: {str(e)}")
        # Default hours
        return {"start_hour": 9, "end_hour": 19}


def is_valid_booking_date(date_str: str) -> tuple[bool, str]:
    """
    Validate if a date is valid for booking
    
    Args:
        date_str: Date in YYYY-MM-DD format
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d").date()
        today = datetime.now().date()
        
        # Cannot book in the past
        if date < today:
            return False, "Cannot book appointments in the past"
        
        # Cannot book more than 3 months in advance
        max_date = today + timedelta(days=90)
        if date > max_date:
            return False, "Cannot book more than 3 months in advance"
        
        # Check if business is open on this day
        hours = get_business_hours(date_str)
        if hours["start_hour"] == 0:
            return False, "Business is closed on this day (Sunday)"
        
        return True, ""
    
    except Exception as e:
        return False, f"Invalid date format: {str(e)}"
