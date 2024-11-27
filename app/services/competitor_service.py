# app/services/competitor_service.py
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..models.schemas import CompetitorCreate, Competitor

class CompetitorService:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.collection = self.db.competitors

    async def create_competitor(self, competitor: CompetitorCreate) -> Competitor:
        competitor_dict = competitor.dict()
        competitor_dict.update({
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })

        result = await self.collection.insert_one(competitor_dict)
        competitor_dict["id"] = str(result.inserted_id)
        return Competitor(**competitor_dict)

    async def get_all_competitors(self) -> list[Competitor]:
        competitors = []
        cursor = self.collection.find({})
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            competitors.append(Competitor(**doc))
        return competitors

    async def get_competitor(self, competitor_id: str) -> Competitor:
        doc = await self.collection.find_one({"_id": ObjectId(competitor_id)})
        if doc:
            doc["id"] = str(doc.pop("_id"))
            return Competitor(**doc)
        return None

    async def update_competitor(self, competitor_id: str, competitor: CompetitorCreate) -> Competitor:
        competitor_dict = competitor.dict()
        competitor_dict["updated_at"] = datetime.utcnow()

        result = await self.collection.update_one(
            {"_id": ObjectId(competitor_id)},
            {"$set": competitor_dict}
        )

        if result.modified_count:
            return await self.get_competitor(competitor_id)
        return None

    async def delete_competitor(self, competitor_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(competitor_id)})
        return result.deleted_count > 0