"""
Input validation and sanitization utilities
Provides enhanced security and data integrity
"""
import re
from typing import Optional
import html


def sanitize_string(text: str, max_length: Optional[int] = None) -> str:
    """
    Sanitize string input by removing potentially harmful content
    
    Args:
        text: Input string to sanitize
        max_length: Optional maximum length
        
    Returns:
        Sanitized string
    """
    if not text:
        return ""
    
    # Remove null bytes
    text = text.replace('\x00', '')
    
    # Escape HTML entities to prevent XSS
    text = html.escape(text)
    
    # Strip leading/trailing whitespace
    text = text.strip()
    
    # Enforce max length if specified
    if max_length and len(text) > max_length:
        text = text[:max_length]
    
    return text


def validate_email(email: str) -> bool:
    """
    Validate email format
    
    Args:
        email: Email address to validate
        
    Returns:
        True if valid, False otherwise
    """
    if not email:
        return False
    
    # Basic email regex pattern
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    # Additional checks
    if len(email) > 254:  # Max email length per RFC 5321
        return False
    
    if email.count('@') != 1:
        return False
    
    return bool(re.match(pattern, email))


def validate_phone(phone: str) -> bool:
    """
    Validate phone number format (flexible international format)
    
    Args:
        phone: Phone number to validate
        
    Returns:
        True if valid, False otherwise
    """
    if not phone:
        return True  # Phone is optional in most forms
    
    # Remove common separators
    cleaned = re.sub(r'[\s\-\(\)\.]', '', phone)
    
    # Check if it contains only digits and optional + prefix
    pattern = r'^\+?[0-9]{10,15}$'
    
    return bool(re.match(pattern, cleaned))


def sanitize_form_data(data: dict) -> dict:
    """
    Sanitize all string fields in form data
    
    Args:
        data: Dictionary of form data
        
    Returns:
        Sanitized dictionary
    """
    sanitized = {}
    
    for key, value in data.items():
        if isinstance(value, str):
            sanitized[key] = sanitize_string(value)
        elif isinstance(value, dict):
            sanitized[key] = sanitize_form_data(value)
        elif isinstance(value, list):
            sanitized[key] = [
                sanitize_string(item) if isinstance(item, str) else item
                for item in value
            ]
        else:
            sanitized[key] = value
    
    return sanitized


def validate_url(url: str) -> bool:
    """
    Validate URL format
    
    Args:
        url: URL to validate
        
    Returns:
        True if valid, False otherwise
    """
    if not url:
        return False
    
    # Basic URL regex pattern
    pattern = r'^https?://[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*(/.*)?$'
    
    return bool(re.match(pattern, url))


def detect_spam_patterns(text: str) -> bool:
    """
    Detect common spam patterns in text
    
    Args:
        text: Text to check for spam
        
    Returns:
        True if spam detected, False otherwise
    """
    if not text:
        return False
    
    text_lower = text.lower()
    
    # Common spam indicators
    spam_patterns = [
        r'viagra',
        r'cialis',
        r'casino',
        r'lottery',
        r'click here',
        r'buy now',
        r'limited time',
        r'act now',
        r'100% free',
        r'guaranteed',
        r'no credit card',
        r'weight loss',
        r'crypto investment'
    ]
    
    for pattern in spam_patterns:
        if re.search(pattern, text_lower):
            return True
    
    # Check for excessive links
    link_count = len(re.findall(r'https?://', text))
    if link_count > 3:
        return True
    
    # Check for excessive caps
    if len(text) > 20:
        caps_ratio = sum(1 for c in text if c.isupper()) / len(text)
        if caps_ratio > 0.5:
            return True
    
    return False


def validate_message_length(message: str, min_length: int = 10, max_length: int = 5000) -> tuple[bool, str]:
    """
    Validate message length
    
    Args:
        message: Message to validate
        min_length: Minimum allowed length
        max_length: Maximum allowed length
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not message or len(message.strip()) < min_length:
        return False, f"Message must be at least {min_length} characters long"
    
    if len(message) > max_length:
        return False, f"Message must not exceed {max_length} characters"
    
    return True, ""



def validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Validate password strength with comprehensive requirements
    
    Args:
        password: Password to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not password:
        return False, "Password is required"
    
    # Minimum length
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    # Maximum length (prevent DoS attacks)
    if len(password) > 128:
        return False, "Password must not exceed 128 characters"
    
    # Check for uppercase letter
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    # Check for lowercase letter
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    # Check for digit
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one number"
    
    # Check for special character (optional but recommended)
    # if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
    #     return False, "Password must contain at least one special character"
    
    # Check for common weak passwords
    common_passwords = [
        'password', '12345678', 'password123', 'admin123', 
        'qwerty123', 'abc12345', 'welcome123'
    ]
    if password.lower() in common_passwords:
        return False, "Password is too common. Please choose a stronger password"
    
    return True, ""


def validate_username(username: str) -> tuple[bool, str]:
    """
    Validate username format
    
    Args:
        username: Username to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not username:
        return False, "Username is required"
    
    # Length requirements
    if len(username) < 3:
        return False, "Username must be at least 3 characters long"
    
    if len(username) > 50:
        return False, "Username must not exceed 50 characters"
    
    # Format requirements (alphanumeric, underscore, hyphen)
    if not re.match(r'^[a-zA-Z0-9_-]+$', username):
        return False, "Username can only contain letters, numbers, underscores, and hyphens"
    
    # Must start with a letter
    if not re.match(r'^[a-zA-Z]', username):
        return False, "Username must start with a letter"
    
    return True, ""


def validate_company_name(name: str) -> tuple[bool, str]:
    """
    Validate company name
    
    Args:
        name: Company name to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not name or not name.strip():
        return False, "Company name is required"
    
    # Length requirements
    if len(name.strip()) < 2:
        return False, "Company name must be at least 2 characters long"
    
    if len(name) > 100:
        return False, "Company name must not exceed 100 characters"
    
    return True, ""
