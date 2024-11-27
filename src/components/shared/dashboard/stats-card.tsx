import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Define the type for the props
type StatsCardProps = {
    title: string;
    value: string | number;
    trend: number;
    description: string;
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, description }) => {
    const isPositive = trend >= 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;
    const trendColor = isPositive ? 'text-green-500' : 'text-red-500';

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
                </div>
                <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                    <TrendIcon className={`w-6 h-6 ${trendColor}`} />
                </div>
            </div>
            <div className="mt-4">
                <div className="flex items-center">
          <span className={`text-sm ${trendColor} font-medium`}>
            {trend}%
          </span>
                    <span className="ml-2 text-sm text-gray-500">
            {description}
          </span>
                </div>
            </div>
        </Card>
    );
};

export default StatsCard;
