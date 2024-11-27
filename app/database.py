# app/database.py
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from .config import settings

class Database:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

    async def connect_to_database(self):
        """Create database connection."""
        try:
            self.client = AsyncIOMotorClient(settings.MONGODB_URL)
            self.db = self.client[settings.DATABASE_NAME]
            # Test the connection
            await self.client.admin.command('ping')
            print("✅ Connected to MongoDB!")
        except Exception as e:
            print(f"❌ Could not connect to MongoDB: {e}")
            raise e

    async def close_database_connection(self):
        """Close database connection."""
        if self.client is not None:
            self.client.close()
            print("Closed MongoDB connection.")

    def get_database(self) -> AsyncIOMotorDatabase:
        if self.db is None:
            raise Exception("Database not initialized. Call connect_to_database first.")
        return self.db

# Create a database instance
db = Database()