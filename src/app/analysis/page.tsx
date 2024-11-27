import * as React from 'react';
import { Card } from '@/components/ui/card';
import LoadingState from '@/components/ui/loading-state';
import ErrorState from '@/components/ui/error-state';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { api } from '@/lib/api-client';

interface Competitor {
    id: string;
    name: string;
    market_share: number;
    [key: string]: any;
}

interface CompetitorData {
    name: string;
    marketShare: number;
    sentiment: number;
    strength: number;
}

interface MarketAnalysis {
    market_positions: {
        [key: string]: {
            uniqueness_score: number;
            market_position: string;
        };
    };
}

interface Trend {
    description: string;
    // Add other trend properties as needed
}

interface AnalysisData {
    competitors: CompetitorData[];
    marketAnalysis: MarketAnalysis;
    trends: Trend[];
}

interface SentimentResponse {
    sentiment_score: number;
}

const AnalysisPage: React.FC = () => {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    const [analysisData, setAnalysisData] = React.useState<AnalysisData | null>(null);

    const fetchAnalysisData = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all competitors
            const competitors: Competitor[] = await api.competitors.getAll();

            // Get market analysis
            const marketAnalysis: MarketAnalysis = await api.analysis.performMarketAnalysis({
                competitor_ids: competitors.map(c => c.id),
                start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                end_date: new Date(),
                analysis_type: 'full'
            });

            // Get sentiment analysis for each competitor
            const sentimentPromises = competitors.map(comp =>
                api.analysis.analyzeSentiment(comp.id)
            );
            const sentiments: SentimentResponse[] = await Promise.all(sentimentPromises);

            // Prepare data for visualization
            const competitorData: CompetitorData[] = competitors.map((comp, index) => ({
                name: comp.name,
                marketShare: comp.market_share,
                sentiment: sentiments[index].sentiment_score,
                strength: marketAnalysis.market_positions[comp.name]?.uniqueness_score || 0
            }));

            const trends = await api.analysis.getMarketTrends();

            setAnalysisData({
                competitors: competitorData,
                marketAnalysis,
                trends
            });

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        void fetchAnalysisData();
    }, []);

    if (loading) {
        return <LoadingState message="Analyzing market data..." />;
    }

    if (error) {
        return <ErrorState message={error} retry={fetchAnalysisData} />;
    }

    if (!analysisData || analysisData.competitors.length === 0) {
        return <ErrorState message="No data available" retry={fetchAnalysisData} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Market Analysis</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <Card className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Market Share Distribution</h2>
                        <BarChart width={500} height={300} data={analysisData.competitors}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="marketShare" fill="#8884d8" name="Market Share %" />
                        </BarChart>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Sentiment Analysis</h2>
                        <LineChart width={500} height={300} data={analysisData.competitors}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="sentiment" stroke="#82ca9d" name="Sentiment Score" />
                        </LineChart>
                    </Card>
                </div>

                <Card className="p-6 mb-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Competitive Analysis</h2>
                    <div className="flex justify-center">
                        <RadarChart width={600} height={400} data={analysisData.competitors}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="name" />
                            <PolarRadiusAxis />
                            <Radar name="Market Share" dataKey="marketShare" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Radar name="Sentiment" dataKey="sentiment" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                            <Radar name="Strength" dataKey="strength" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                            <Legend />
                        </RadarChart>
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-blue-700">Market Position</h3>
                            <p className="mt-2 text-sm text-blue-600">
                                {analysisData.competitors[0] &&
                                    analysisData.marketAnalysis.market_positions[analysisData.competitors[0].name]?.market_position ||
                                    'No position data available'}
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-green-700">Growth Opportunities</h3>
                            <p className="mt-2 text-sm text-green-600">
                                {analysisData.trends[0]?.description || 'No trends available'}
                            </p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-yellow-700">Areas for Improvement</h3>
                            <p className="mt-2 text-sm text-yellow-600">
                                Based on sentiment analysis and market position
                            </p>
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default AnalysisPage;