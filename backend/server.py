"""
DEPRECATED: This file is kept for backward compatibility with supervisor.
The main application now lives in app/main.py

This file simply imports and re-exports the app from the new structure.
"""
from app.main import app

__all__ = ["app"]
