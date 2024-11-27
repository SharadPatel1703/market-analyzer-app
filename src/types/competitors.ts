export interface Competitor {
    id?: string;
    name: string;
    website: string;
    market_share: number | string;
    price_range: string;
    customer_count: string;
    strengths: string[];
    weaknesses: string[];
    revenue?: number;
}

export interface FormData {
    name: string;
    website: string;
    marketShare: number | string;
    priceRange: string;
    customerCount: string;
    strengths: string[];
    weaknesses: string[];
}