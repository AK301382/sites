"""
Structured logging configuration.
Uses structlog if available, falls back to standard logging.
"""
import sys
import logging

# Try to import structlog (optional dependency)
try:
    import structlog
    from structlog.stdlib import LoggerFactory
    STRUCTLOG_AVAILABLE = True
except ImportError:
    STRUCTLOG_AVAILABLE = False


def configure_logging(log_level: str = "INFO"):
    """
    Configure logging for the application.
    Uses structlog if available, otherwise standard logging.
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    """
    # Configure standard library logging
    logging.basicConfig(
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        stream=sys.stdout,
        level=getattr(logging, log_level.upper()),
    )
    
    # Configure structlog if available
    if STRUCTLOG_AVAILABLE:
        try:
            structlog.configure(
                processors=[
                    # Add log level to event dict
                    structlog.stdlib.add_log_level,
                    # Add logger name to event dict
                    structlog.stdlib.add_logger_name,
                    # Add timestamp
                    structlog.processors.TimeStamper(fmt="iso"),
                    # Stack traces for exceptions
                    structlog.processors.StackInfoRenderer(),
                    structlog.processors.format_exc_info,
                    # Format as JSON for production, pretty print for development
                    structlog.processors.JSONRenderer() if log_level != "DEBUG"
                    else structlog.dev.ConsoleRenderer(colors=True)
                ],
                wrapper_class=structlog.stdlib.BoundLogger,
                context_class=dict,
                logger_factory=LoggerFactory(),
                cache_logger_on_first_use=True,
            )
        except Exception as e:
            logging.warning(f"Failed to configure structlog: {e}")


def get_logger(name: str = None):
    """
    Get a logger instance.
    Returns structlog logger if available, otherwise standard logger.
    
    Args:
        name: Logger name (usually __name__)
    
    Returns:
        Logger instance
    """
    if STRUCTLOG_AVAILABLE:
        return structlog.get_logger(name)
    else:
        return logging.getLogger(name)