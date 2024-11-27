// components/competitors/CompetitorAnalysis.tsx
import React, { useState } from 'react';
import { useToast } from '@/contexts/toast-context';
import { Competitor, Analysis } from '@/types';
import {AnalysisRequest, api} from "@/lib/api-client";

interface CompetitorAnalysisProps {
    competitors: Competitor[];
}

export const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ competitors }) => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<Analysis | null>(null);

    const performAnalysis = async () => {
        try {
            setLoading(true);

            if (!competitors.length) {
                throw new Error('No competitors available for analysis');
            }

            const analysisRequest: AnalysisRequest = {
                competitor_ids: competitors.map(c => c.id),
                start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                end_date: new Date(),
                analysis_type: 'full' as const  // Explicitly type as 'full'
            };

            const result = await api.analysis.performMarketAnalysis(analysisRequest);
            setAnalysis(result);

            addToast({
                title: 'Success',
                message: 'Market analysis has been successfully performed',
                type: 'success'
            });
        } catch (error) {
            console.error('Analysis error:', error);
            addToast({
                title: 'Error',
                message: error instanceof Error ? error.message : 'Failed to perform market analysis',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!competitors.length) {
        return (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Add competitors to perform market analysis</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Market Analysis</h2>
                <button
                    onClick={performAnalysis}
                    disabled={loading}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Analyzing...' : 'Perform Analysis'}
                </button>
            </div>

            {analysis && (
                <div className="space-y-6">
                    {/* Market Positions */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium mb-4">Market Positions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(analysis.market_positions).map(([name, data]) => (
                                <div key={name} className="p-4 border rounded-md">
                                    <h4 className="font-medium">{name}</h4>
                                    <p className="text-sm text-gray-500">
                                        Uniqueness Score: {(data.uniqueness_score * 100).toFixed(1)}%
                                    </p>
                                    {data.similar_competitors.length > 0 && (
                                        <p className="text-sm text-gray-500">
                                            Similar to: {data.similar_competitors.join(', ')}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Market Trends */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium mb-4">Market Trends</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 border rounded-md bg-green-50">
                                <p className="text-sm text-gray-600">Growing</p>
                                <p className="text-2xl font-semibold text-green-600">
                                    {analysis.share_trends.trends.growing}
                                </p>
                            </div>
                            <div className="p-4 border rounded-md bg-red-50">
                                <p className="text-sm text-gray-600">Declining</p>
                                <p className="text-2xl font-semibold text-red-600">
                                    {analysis.share_trends.trends.declining}
                                </p>
                            </div>
                            <div className="p-4 border rounded-md bg-blue-50">
                                <p className="text-sm text-gray-600">Stable</p>
                                <p className="text-2xl font-semibold text-blue-600">
                                    {analysis.share_trends.trends.stable}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};