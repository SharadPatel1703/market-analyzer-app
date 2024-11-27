import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = "Market Research API"
    PROJECT_VERSION: str = "1.0.0"
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "market_research")

    # CORS Configuration
    CORS_ORIGINS = [
        "http://localhost:3000",  # Next.js frontend in development
        # "https://your-production-frontend.vercel.app"  # Add your production URL later
    ]

    # Model Settings
    EMBEDDING_MODEL = "all-MiniLM-L6-v2"  # Lightweight model good for production


settings = Settings()