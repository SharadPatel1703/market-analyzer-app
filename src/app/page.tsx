'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const HomePage = () => {
    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                        Market Research Analyzer
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Track competitors, analyze market trends, and make data-driven decisions
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <Link href="/competitors" className="block">
                        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                Competitors
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Track and analyze your competitors
                            </p>
                        </Card>
                    </Link>

                    <Link href="/analysis" className="block">
                        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                Market Analysis
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </h2>
                            <p className="mt-2 text-gray-600">
                                View market trends and insights
                            </p>
                        </Card>
                    </Link>

                    <Link href="/dashboard" className="block">
                        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                Dashboard
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Overview of key metrics
                            </p>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;