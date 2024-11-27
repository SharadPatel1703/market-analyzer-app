// lib/api-client.ts
import { cache } from './cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Type definitions
export interface Competitor {
    id: string;
    name: string;
    website: string;
    market_share: number;
    price_range: string;
    customer_count: string;
    strengths: string[];
    weaknesses: string[];
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface CompetitorCreate {
    name: string;
    website: string;
    market_share: number;
    price_range: string;
    customer_count: string;
    strengths: string[];
    weaknesses: string[];
    description?: string;
}

export interface MarketTrend {
    trend_name: string;
    impact_score: number;
    description: string;
    date_identified: string;
    sources: string[];
}

export interface AnalysisRequest {
    competitor_ids: string[];
    start_date: Date;
    end_date: Date;
    analysis_type: 'market_share' | 'sentiment' | 'full';
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

export interface SentimentAnalysis {
    sentiment_score: number;
    mention_count: number;
    analysis_date: string;
}

export interface CompetitorReport {
    competitor_name: string;
    market_position: {
        uniqueness_score: number;
        market_position: 'unique' | 'standard';
        closest_competitors: string[];
    };
    sentiment_analysis: SentimentAnalysis;
    report_date: string;
    recommendations: string[];
}

export class APIError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'APIError';
    }
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const cacheKey = options.method === 'GET' ? url : null;

    try {
        if (cacheKey) {
            const cachedData = cache.get<T>(cacheKey);
            if (cachedData) return cachedData;
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.detail || errorMessage;
            } catch {
                errorMessage += ` - ${response.statusText}`;
            }
            throw new APIError(response.status, errorMessage);
        }

        const data = await response.json();

        if (cacheKey) {
            cache.set(cacheKey, data);
        }

        return data as T;
    } catch (error) {
        if (error instanceof APIError) throw error;
        throw new APIError(
            500,
            error instanceof Error ? error.message : 'An unexpected error occurred'
        );
    }
}

export const api = {
    competitors: {
        getAll: (): Promise<Competitor[]> =>
            fetchAPI('/competitors/'),

        getById: (id: string): Promise<Competitor> =>
            fetchAPI(`/competitors/${id}/`),

        create: (data: CompetitorCreate): Promise<Competitor> => {
            cache.remove('/competitors/');
            return fetchAPI('/competitors/', {
                method: 'POST',
                body: JSON.stringify({
                    ...data,
                    description: data.description || `${data.name} - ${data.price_range}`
                }),
            });
        },

        update: (id: string, data: CompetitorCreate): Promise<Competitor> => {
            cache.remove('/competitors/');
            cache.remove(`/competitors/${id}/`);
            return fetchAPI(`/competitors/${id}/`, {
                method: 'PUT',
                body: JSON.stringify({
                    ...data,
                    description: data.description || `${data.name} - ${data.price_range}`
                }),
            });
        },

        delete: (id: string): Promise<void> => {
            cache.remove('/competitors/');
            return fetchAPI(`/competitors/${id}/`, {
                method: 'DELETE',
            });
        },
    },

    analysis: {
        getMarketTrends: (): Promise<MarketTrend[]> =>
            fetchAPI('/analysis/trends/'),

        compareCompetitors: (competitorIds: string[]): Promise<{
            comparison_date: string;
            feature_comparison: Record<string, number>;
            competitors: string[];
        }> => fetchAPI('/analysis/competitor-comparison/', {
            method: 'POST',
            body: JSON.stringify({ competitor_ids: competitorIds }),
        }),

        analyzeSentiment: (competitorId: string): Promise<SentimentAnalysis> =>
            fetchAPI(`/analysis/sentiment-analysis/${competitorId}/`, {
                method: 'POST',
                body: JSON.stringify({}),
            }),

        getReport: (competitorId: string): Promise<CompetitorReport> =>
            fetchAPI(`/analysis/reports/${competitorId}/`),

        performMarketAnalysis: async (data: AnalysisRequest): Promise<Analysis> => {
            try {
                return await fetchAPI('/analysis/market-analysis/', {
                    method: 'POST',
                    body: JSON.stringify({
                        ...data,
                        start_date: data.start_date.toISOString(),
                        end_date: data.end_date.toISOString(),
                    }),
                });
            } catch (error) {
                if (error instanceof APIError && error.status === 400) {
                    console.error('Market Analysis Error:', error);
                    throw new APIError(
                        400,
                        'Failed to perform market analysis. Please ensure all competitors exist and try again.'
                    );
                }
                throw error;
            }
        },
    },
};