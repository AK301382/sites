"""Main application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from config.settings import settings
from config.logging_config import configure_logging, get_logger
from middleware.security import SecurityHeadersMiddleware
from database import close_db_connection
from app.api.v1.router import api_router
import logging

# Configure structured logging
configure_logging(settings.LOG_LEVEL)
logger = get_logger(__name__)

# Initialize Sentry if DSN is provided (optional)
if settings.SENTRY_DSN:
    try:
        import sentry_sdk
        from sentry_sdk.integrations.fastapi import FastApiIntegration
        
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            environment=settings.ENVIRONMENT,
            traces_sample_rate=1.0 if settings.DEBUG else 0.1,
            integrations=[FastApiIntegration()],
            send_default_pii=False,
            before_send=lambda event, hint: event if settings.ENVIRONMENT != "development" else None,
        )
        logger.info("✅ Sentry error tracking initialized")
    except ImportError:
        logger.info("ℹ️  Sentry SDK not installed - error tracking disabled")


def create_application() -> FastAPI:
    """Create and configure the FastAPI application."""
    
    app = FastAPI(
        title=settings.APP_NAME,
        description="Professional agency backend API with customer management",
        version=settings.APP_VERSION,
        debug=settings.DEBUG,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
    )
    
    # Add middleware (order matters - first added is executed last)
    # 1. Security headers (outermost)
    app.add_middleware(SecurityHeadersMiddleware)
    
    # 2. Response compression
    app.add_middleware(GZipMiddleware, minimum_size=1000)
    
    # 3. CORS middleware (innermost)
    app.add_middleware(
        CORSMiddleware,
        allow_credentials=True,
        allow_origins=settings.cors_origins_list,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include API router with /api prefix
    app.include_router(api_router, prefix="/api")
    
    # Health check endpoints
    @app.get("/")
    async def root():
        return {
            "message": "Kawesh API is running",
            "version": settings.APP_VERSION,
            "status": "healthy"
        }
    
    @app.get("/health")
    async def health_check():
        return {
            "status": "healthy",
            "message": "All systems operational"
        }
    
    # Startup event
    @app.on_event("startup")
    async def startup_event():
        logger.info(f"🚀 {settings.APP_NAME} starting up...")
        logger.info(f"📍 Environment: {settings.ENVIRONMENT}")
        logger.info(f"🔧 Debug mode: {settings.DEBUG}")
        logger.info("✅ Database connection established")
        logger.info("✅ All routes registered")
        logger.info(f"📚 API documentation available at /api/docs")
    
    # Shutdown event
    @app.on_event("shutdown")
    async def shutdown_event():
        logger.info(f"🔴 Shutting down {settings.APP_NAME}...")
        await close_db_connection()
        logger.info("✅ Database connection closed")
    
    return app


# Create the application instance
app = create_application()
