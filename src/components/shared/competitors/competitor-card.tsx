import * as React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Share2, Users, DollarSign } from 'lucide-react';
import type { Competitor } from '@/types';

interface CompetitorCardProps {
    competitor: Competitor;
}

const CompetitorCard: React.FC<CompetitorCardProps> = ({ competitor }) => {
    const isPositive = (competitor.trend || 0) >= 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{competitor.name}</h3>
                    <div className="flex items-center mt-1">
                        <Share2 className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-600">
                            {competitor.market_share}% Market Share
                        </span>
                    </div>
                </div>
                {competitor.trend !== undefined && (
                    <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        <TrendIcon className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">{competitor.trend}%</span>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span className="text-sm">{competitor.price_range}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">{competitor.customer_count} Customers</span>
                </div>
            </div>

            <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">Key Strengths</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                    {competitor.strengths.map((strength, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                        >
                            {strength}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">Key Weaknesses</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                    {competitor.weaknesses.map((weakness, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs"
                        >
                            {weakness}
                        </span>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default CompetitorCard;