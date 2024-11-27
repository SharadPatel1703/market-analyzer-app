"use client";
import React from 'react';
import { Card } from '@/components/ui/card';
import StatsCard from '@/components/shared/dashboard/stats-card';
import LoadingState from '@/components/ui/loading-state';
import ErrorState from '@/components/ui/error-state';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { api } from '@/lib/api-client';

type DashboardData = {
    competitorCount: number;
    averageSentiment: number;
    trendCount: number;
};

type Competitor = {
    id: string;
    name: string;
};

type MarketTrend = {
    trend_name: string;
    impact_score: number;
};

type Sentiment = {
    sentiment_score: number;
};

const DashboardPage: React.FC = () => {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(null);
    const [trends, setTrends] = React.useState<MarketTrend[]>([]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const competitors: Competitor[] = await api.competitors.getAll();
            const marketTrends: MarketTrend[] = await api.analysis.getMarketTrends();

            const sentimentPromises = competitors.map((comp: Competitor) =>
                api.analysis.analyzeSentiment(comp.id)
            );
            const sentiments: Sentiment[] = await Promise.all(sentimentPromises);

            const avgSentiment =
                sentiments.reduce((acc, curr) => acc + curr.sentiment_score, 0) / sentiments.length;

            setDashboardData({
                competitorCount: competitors.length,
                averageSentiment: avgSentiment,
                trendCount: marketTrends.length,
            });

            setTrends(marketTrends);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return <LoadingState message="Loading dashboard data..." />;
    }

    if (error) {
        return <ErrorState message={error} retry={fetchDashboardData} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
                    {dashboardData && (
                        <>
                            <StatsCard
                                title="Active Competitors"
                                value={dashboardData.competitorCount.toString()}
                                trend={12}
                                description="vs last month"
                            />
                            <StatsCard
                                title="Market Trends"
                                value={dashboardData.trendCount.toString()}
                                trend={8}
                                description="vs last month"
                            />
                            <StatsCard
                                title="Average Sentiment"
                                value={dashboardData.averageSentiment.toFixed(1)}
                                trend={5}
                                description="vs last month"
                            />
                        </>
                    )}
                </div>

                <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Market Trends</h3>
                    <div className="h-[300px]">
                        <LineChart width={800} height={300} data={trends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="trend_name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="impact_score"
                                stroke="#8884d8"
                                name="Impact Score"
                            />
                        </LineChart>
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default DashboardPage;
