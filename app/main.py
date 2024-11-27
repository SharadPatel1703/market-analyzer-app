# app/main.py
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import db
from .config import settings
from .routes import competitors, analysis

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

@app.on_event("startup")
async def startup_db_client():
    try:
        await db.connect_to_database()
    except Exception as e:
        print(f"Failed to connect to the database: {e}")
        raise e

@app.on_event("shutdown")
async def shutdown_db_client():
    await db.close_database_connection()

# Include routers
app.include_router(competitors.router, prefix="/api/competitors", tags=["competitors"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])

@app.get("/api/health")
async def health_check():
    try:
        await db.client.admin.command("ping")
        return {
            "status": "healthy",
            "version": settings.PROJECT_VERSION,
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "version": settings.PROJECT_VERSION,
            "database": f"disconnected: {str(e)}"
        }