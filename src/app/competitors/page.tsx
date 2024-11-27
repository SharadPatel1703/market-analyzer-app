'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import CompetitorCard from '@/components/shared/competitors/competitor-card';
import CompetitorModal from '@/components/shared/competitors/competitor-modal';
import LoadingState from '@/components/ui/loading-state';
import ErrorState from '@/components/ui/error-state';
import { Plus } from 'lucide-react';
import { api } from '@/lib/api-client';
import { useModal } from '@/contexts/modal-context';
import { useToast } from '@/contexts/toast-context';
import type { Competitor, MarketStats, MarketAnalysis } from '@/types';
import {CompetitorAnalysis} from "@/components/shared/competitors/CompetitorAnalysis";

// Match interfaces with your form
// interface Competitor {
//     id: string;
//     name: string;
//     website: string;
//     market_share: number;
//     price_range: string;
//     customer_count: string;
//     strengths: string[];
//     weaknesses: string[];
//     revenue?: number;
// }
//
// interface MarketStats {
//     totalMarketSize: string;
//     activeCompetitors: number;
//     marketGrowth: number;
// }
//
// interface MarketAnalysis {
//     share_trends: {
//         trends: {
//             growing: number;
//         };
//     };
// }

const CompetitorsPage: React.FC = () => {
    const { openModal } = useModal();
    const { addToast } = useToast();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    const [competitors, setCompetitors] = React.useState<Competitor[]>([]);
    const [marketStats, setMarketStats] = React.useState<MarketStats | null>(null);

    const fetchCompetitors = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const competitorsData: Competitor[] = await api.competitors.getAll();
            setCompetitors(competitorsData);

            if (competitorsData.length > 0) {
                const analysis: MarketAnalysis = await api.analysis.performMarketAnalysis({
                    competitor_ids: competitorsData.map(c => c.id),
                    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    end_date: new Date(),
                    analysis_type: 'full'
                });

                const totalRevenue = competitorsData.reduce(
                    (sum, competitor) => sum + (competitor.revenue || 0),
                    0
                );

                setMarketStats({
                    totalMarketSize: totalRevenue > 0
                        ? new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            notation: 'compact',
                            maximumFractionDigits: 1
                        }).format(totalRevenue)
                        : '$4.2B',
                    activeCompetitors: competitorsData.length,
                    marketGrowth: analysis.share_trends.trends.growing
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        void fetchCompetitors();
    }, []);

    const handleAddCompetitor = (): void => {
        openModal(
            <CompetitorModal
                onSuccess={fetchCompetitors}
            />
        );
    };

    const handleEditCompetitor = (competitor: Competitor): void => {
        openModal(
            <CompetitorModal
                competitor={competitor}
                onSuccess={fetchCompetitors}
            />
        );
    };

    if (loading) {
        return <LoadingState message="Loading competitors data..." />;
    }

    if (error) {
        return <ErrorState message={error} retry={fetchCompetitors} />;
    }

    if (!competitors.length) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-lg font-medium text-gray-900">No competitors yet</h2>
                        <p className="mt-1 text-sm text-gray-500">Get started by adding your first competitor.</p>
                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={handleAddCompetitor}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Competitor
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Competitor Analysis</h1>
                    <button
                        type="button"
                        onClick={handleAddCompetitor}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Competitor
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {competitors.map((competitor) => (
                        <div
                            key={competitor.id}
                            onClick={() => handleEditCompetitor(competitor)}
                            className="cursor-pointer transition-transform hover:scale-105"
                        >
                            <CompetitorCard competitor={competitor} />
                        </div>
                    ))}
                </div>
                <CompetitorAnalysis competitors={competitors} />

                {marketStats && (
                    <Card className="mt-8 p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Market Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Total Market Size</h3>
                                <p className="mt-1 text-2xl font-semibold text-gray-900">
                                    {marketStats.totalMarketSize}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Active Competitors</h3>
                                <p className="mt-1 text-2xl font-semibold text-gray-900">
                                    {marketStats.activeCompetitors}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Market Growth</h3>
                                <p className="mt-1 text-2xl font-semibold text-green-600">
                                    +{marketStats.marketGrowth}%
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
            </main>
        </div>
    );
};

export default CompetitorsPage;