from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class CompetitorBase(BaseModel):
    name: str
    website: str
    market_share: float = Field(ge=0, le=100)
    price_range: str
    customer_count: str
    strengths: List[str]
    weaknesses: List[str]
    description: Optional[str] = None  # Make description optional

class CompetitorCreate(CompetitorBase):
    pass

class Competitor(CompetitorBase):
    id: str
    created_at: datetime
    updated_at: datetime

class Analysis(BaseModel):
    analysis_date: datetime
    market_positions: dict
    share_trends: dict
    similarity_scores: List[List[float]]

class AnalysisRequest(BaseModel):
    competitor_ids: List[str]
    start_date: datetime
    end_date: datetime
    analysis_type: str = Field(description="Type of analysis: 'market_share', 'sentiment', or 'full'")

class MarketTrend(BaseModel):
    trend_name: str
    impact_score: float = Field(ge=-1, le=1)
    description: str
    date_identified: datetime
    sources: List[str]
