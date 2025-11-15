"""
Rate limiting middleware for API endpoints
Prevents abuse and ensures fair resource usage
"""
from fastapi import HTTPException, Request, status
from datetime import datetime, timedelta
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)


class SimpleRateLimiter:
    """
    In-memory rate limiter for API endpoints
    For production, consider using Redis for distributed rate limiting
    """
    
    def __init__(self):
        # Store: {ip_address: [(timestamp, endpoint), ...]}
        self.requests = defaultdict(list)
        # Cleanup interval
        self.last_cleanup = datetime.now()
        self.cleanup_interval = timedelta(minutes=5)
    
    def _cleanup_old_requests(self):
        """Remove old request records to prevent memory buildup"""
        now = datetime.now()
        
        if now - self.last_cleanup < self.cleanup_interval:
            return
        
        cutoff_time = now - timedelta(hours=1)
        
        for ip in list(self.requests.keys()):
            self.requests[ip] = [
                (timestamp, endpoint) 
                for timestamp, endpoint in self.requests[ip]
                if timestamp > cutoff_time
            ]
            
            # Remove IP if no recent requests
            if not self.requests[ip]:
                del self.requests[ip]
        
        self.last_cleanup = now
    
    async def check_rate_limit(
        self,
        request: Request,
        max_requests: int = 10,
        window_minutes: int = 1,
        endpoint: str = None
    ):
        """
        Check if request should be rate limited
        
        Args:
            request: FastAPI Request object
            max_requests: Maximum requests allowed in window
            window_minutes: Time window in minutes
            endpoint: Optional specific endpoint (defaults to path)
            
        Raises:
            HTTPException: If rate limit exceeded
        """
        # Cleanup old records periodically
        self._cleanup_old_requests()
        
        # Get client IP
        ip = request.client.host if request.client else "unknown"
        endpoint = endpoint or request.url.path
        
        now = datetime.now()
        window_start = now - timedelta(minutes=window_minutes)
        
        # Get recent requests from this IP to this endpoint
        recent_requests = [
            (timestamp, ep) 
            for timestamp, ep in self.requests[ip]
            if timestamp > window_start and ep == endpoint
        ]
        
        if len(recent_requests) >= max_requests:
            logger.warning(
                f"Rate limit exceeded for IP {ip} on endpoint {endpoint}: "
                f"{len(recent_requests)} requests in {window_minutes} minute(s)"
            )
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Too many requests. Please try again in {window_minutes} minute(s)."
            )
        
        # Record this request
        self.requests[ip].append((now, endpoint))


# Global rate limiter instance
rate_limiter = SimpleRateLimiter()


# Convenience functions for common rate limits
async def rate_limit_strict(request: Request, endpoint: str = None):
    """Strict rate limit: 5 requests per minute"""
    await rate_limiter.check_rate_limit(
        request, 
        max_requests=5, 
        window_minutes=1,
        endpoint=endpoint
    )


async def rate_limit_moderate(request: Request, endpoint: str = None):
    """Moderate rate limit: 10 requests per minute"""
    await rate_limiter.check_rate_limit(
        request, 
        max_requests=10, 
        window_minutes=1,
        endpoint=endpoint
    )


async def rate_limit_lenient(request: Request, endpoint: str = None):
    """Lenient rate limit: 30 requests per 5 minutes"""
    await rate_limiter.check_rate_limit(
        request, 
        max_requests=30, 
        window_minutes=5,
        endpoint=endpoint
    )
