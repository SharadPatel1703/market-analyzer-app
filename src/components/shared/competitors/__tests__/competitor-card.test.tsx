import { render, screen } from '@testing-library/react';
import CompetitorCard from '../competitor-card';

describe('CompetitorCard', () => {
    const mockCompetitor = {
        name: 'Test Company',
        marketShare: 25,
        trend: 5.2,
        customersCount: '50K+',
        priceRange: '$50-$200/mo',
        strengths: ['Quality', 'Service']
    };

    it('renders competitor information correctly', () => {
        render(<CompetitorCard competitor={mockCompetitor} />);

        // Check using more specific queries
        expect(screen.getByRole('heading', { name: 'Test Company' })).toBeInTheDocument();
        expect(screen.getByText(/50K\+/)).toBeInTheDocument();
        expect(screen.getByText(/\$50-\$200\/mo/)).toBeInTheDocument();

        // Check strengths
        mockCompetitor.strengths.forEach(strength => {
            expect(screen.getByText(strength)).toBeInTheDocument();
        });
    });

    it('displays positive trend with correct color', () => {
        render(<CompetitorCard competitor={mockCompetitor} />);
        const trendElement = screen.getByText(/5.2%/).closest('div');
        expect(trendElement).toHaveClass('text-green-500');
    });

    it('displays negative trend with correct color', () => {
        const negativeCompetitor = {
            ...mockCompetitor,
            trend: -2.5
        };
        render(<CompetitorCard competitor={negativeCompetitor} />);
        const trendElement = screen.getByText(/-2.5%/).closest('div');
        expect(trendElement).toHaveClass('text-red-500');
    });
});