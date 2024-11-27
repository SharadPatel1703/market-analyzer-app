# app/routes/analysis.py
import logging

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List
from ..models.schemas import AnalysisRequest, Analysis, MarketTrend
from ..services.analysis_service import AnalysisService
from ..database import db

router = APIRouter()

async def get_analysis_service():
    database = db.get_database()
    return AnalysisService(database)


@router.post("/market-analysis", response_model=Analysis)
async def analyze_market(
        request: AnalysisRequest = Body(...),
        service: AnalysisService = Depends(get_analysis_service)
):
    try:
        logging.debug(f"Received analysis request: {request.dict()}")

        # Validate competitor existence
        for comp_id in request.competitor_ids:
            try:
                ObjectId(comp_id)  # Validate ID format
            except:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid competitor ID format: {comp_id}"
                )

        result = await service.perform_market_analysis(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logging.error(f"Error in market analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred during market analysis"
        )
@router.get("/trends", response_model=List[MarketTrend])
async def get_market_trends(
    service: AnalysisService = Depends(get_analysis_service)
):
    try:
        return await service.get_market_trends()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/competitor-comparison")
async def compare_competitors(
    competitor_ids: List[str] = Body(...),
    service: AnalysisService = Depends(get_analysis_service)
):
    try:
        return await service.compare_competitors(competitor_ids)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/sentiment-analysis/{competitor_id}")
async def analyze_sentiment(
        competitor_id: str,
        service: AnalysisService = Depends(get_analysis_service)
):
    try:
        # Check if competitor exists
        competitor = await service.competitor_collection.find_one({"_id": competitor_id})
        if not competitor:
            raise HTTPException(
                status_code=404,
                detail=f"Competitor with id {competitor_id} not found"
            )

        return await service.analyze_sentiment(competitor_id)
    except Exception as e:
        logging.error(f"Error in sentiment analysis: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
@router.get("/reports/{competitor_id}")
async def get_competitor_report(
    competitor_id: str,
    service: AnalysisService = Depends(get_analysis_service)
):
    try:
        return await service.generate_competitor_report(competitor_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))