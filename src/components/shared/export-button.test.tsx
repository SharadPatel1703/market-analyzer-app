import { render, screen, fireEvent } from '@testing-library/react';
import ExportButton from './export-button';
import { ExportService } from '@/lib/export-service';
import '@testing-library/jest-dom';

// Mock the ExportService
jest.mock('@/lib/export-service', () => ({
    ExportService: {
        exportToExcel: jest.fn(),
        exportToCSV: jest.fn(),
        exportToPDF: jest.fn(),
    }
}));

describe('ExportButton', () => {
    const mockData = [{ id: 1, name: 'Test' }];
    const mockFileName = 'test-export';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders export button correctly', () => {
        render(<ExportButton data={mockData} fileName={mockFileName} />);
        expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
    });

    it('shows export options when clicked', async () => {
        render(<ExportButton data={mockData} fileName={mockFileName} />);

        // Click the main export button
        fireEvent.click(screen.getByRole('button', { name: /export/i }));

        // Check for menu items using getByText instead of getByRole
        expect(screen.getByText('Export to Excel')).toBeInTheDocument();
        expect(screen.getByText('Export to CSV')).toBeInTheDocument();
        expect(screen.getByText('Export to PDF')).toBeInTheDocument();
    });

    it('calls correct export function when option is selected', () => {
        render(<ExportButton data={mockData} fileName={mockFileName} />);

        // Open dropdown
        fireEvent.click(screen.getByRole('button', { name: /export/i }));

        // Click export options using getByText
        fireEvent.click(screen.getByText('Export to Excel'));
        expect(ExportService.exportToExcel).toHaveBeenCalledWith(mockData, mockFileName);

        // Need to reopen dropdown as it closes after each selection
        fireEvent.click(screen.getByRole('button', { name: /export/i }));
        fireEvent.click(screen.getByText('Export to CSV'));
        expect(ExportService.exportToCSV).toHaveBeenCalledWith(mockData, mockFileName);

        // Reopen dropdown again
        fireEvent.click(screen.getByRole('button', { name: /export/i }));
        fireEvent.click(screen.getByText('Export to PDF'));
        expect(ExportService.exportToPDF).toHaveBeenCalledWith(mockData, mockFileName);
    });

    // Add a test for closing the dropdown
    it('closes dropdown after selecting an option', () => {
        render(<ExportButton data={mockData} fileName={mockFileName} />);

        // Open dropdown
        fireEvent.click(screen.getByRole('button', { name: /export/i }));
        expect(screen.getByText('Export to Excel')).toBeInTheDocument();

        // Click an option
        fireEvent.click(screen.getByText('Export to Excel'));

        // Verify dropdown is closed
        expect(screen.queryByText('Export to Excel')).not.toBeInTheDocument();
    });

    // Add a test for aria attributes
    it('has correct aria attributes', () => {
        render(<ExportButton data={mockData} fileName={mockFileName} />);

        const button = screen.getByRole('button', { name: /export/i });
        expect(button).toHaveAttribute('aria-expanded', 'false');

        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'true');
    });
});