export interface Competitor {
    revenue?: number;
    id: string;
    name: string;
    website: string;
    market_share: number;
    price_range: string;
    customer_count: string;
    strengths: string[];
    weaknesses: string[];
    created_at: string;
    updated_at: string;
}

export interface CompetitorCardProps {
    competitor: Competitor;
}

export interface MarketStats {
    totalMarketSize: string;
    activeCompetitors: number;
    marketGrowth: number;
}

export interface MarketAnalysis {
    share_trends: {
        trends: {
            growing: number;
        };
    };
}

export interface Analysis {
    analysis_date: string;
    market_positions: {
        [key: string]: {
            uniqueness_score: number;
            similar_competitors: string[];
        };
    };
    share_trends: {
        trend_period: string;
        trends: {
            growing: number;
            declining: number;
            stable: number;
        };
    };
    similarity_scores: number[][];
}
export interface AnalysisRequest {
    competitor_ids: string[];
    start_date: Date;
    end_date: Date;
    analysis_type: 'market_share' | 'sentiment' | 'full';  // Literal union type
}