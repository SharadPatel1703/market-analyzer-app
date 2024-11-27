# app/routes/competitors.py
from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List
from ..models.schemas import CompetitorCreate, Competitor
from ..services.competitor_service import CompetitorService
from ..database import db

router = APIRouter()

async def get_competitor_service():
    database = db.get_database()
    return CompetitorService(database)

@router.post("/", response_model=Competitor)
async def create_competitor(
    competitor: CompetitorCreate = Body(...),
    service: CompetitorService = Depends(get_competitor_service)
):
    try:
        return await service.create_competitor(competitor)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[Competitor])
async def get_competitors(
    service: CompetitorService = Depends(get_competitor_service)
):
    try:
        return await service.get_all_competitors()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{competitor_id}", response_model=Competitor)
async def get_competitor(
    competitor_id: str,
    service: CompetitorService = Depends(get_competitor_service)
):
    competitor = await service.get_competitor(competitor_id)
    if not competitor:
        raise HTTPException(status_code=404, detail="Competitor not found")
    return competitor

@router.put("/{competitor_id}", response_model=Competitor)
async def update_competitor(
    competitor_id: str,
    competitor: CompetitorCreate,
    service: CompetitorService = Depends(get_competitor_service)
):
    updated = await service.update_competitor(competitor_id, competitor)
    if not updated:
        raise HTTPException(status_code=404, detail="Competitor not found")
    return updated

@router.delete("/{competitor_id}")
async def delete_competitor(
    competitor_id: str,
    service: CompetitorService = Depends(get_competitor_service)
):
    deleted = await service.delete_competitor(competitor_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Competitor not found")
    return {"message": "Competitor deleted successfully"}