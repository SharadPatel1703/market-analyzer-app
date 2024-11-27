import { z } from 'zod';

export const competitorSchema = z.object({
    name: z.string().min(1, 'Company name is required'),
    website: z.string().url('Must be a valid URL'),
    marketShare: z.union([z.number(), z.string()]).transform(val =>
        typeof val === 'string' ? parseFloat(val) || 0 : val
    ),
    priceRange: z.string().min(1, 'Price range is required'),
    customerCount: z.string().min(1, 'Customer count is required'),
    strengths: z.array(z.string()).min(1, 'At least one strength is required'),
    weaknesses: z.array(z.string()).min(1, 'At least one weakness is required')
});

export type CompetitorFormData = {
    name: string;
    website: string;
    marketShare: number | string;
    priceRange: string;
    customerCount: string;
    strengths: string[];
    weaknesses: string[];
};