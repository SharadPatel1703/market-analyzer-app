import React, { useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import { ExportService } from '@/lib/export-service';

interface ExportButtonProps {
    data: any[];  // You can make this more specific based on your data structure
    fileName: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, fileName }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
        switch (format) {
            case 'excel':
                ExportService.exportToExcel(data, fileName);
                break;
            case 'csv':
                ExportService.exportToCSV(data, fileName);
                break;
            case 'pdf':
                ExportService.exportToPDF(data, fileName);
                break;
        }
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <Download className="w-4 h-4 mr-2" />
                Export
                <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                    role="menu"
                    aria-orientation="vertical"
                >
                    <div className="py-1" role="none">
                        <button
                            onClick={() => handleExport('excel')}
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            role="menuitem"
                        >
                            Export to Excel
                        </button>
                        <button
                            onClick={() => handleExport('csv')}
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            role="menuitem"
                        >
                            Export to CSV
                        </button>
                        <button
                            onClick={() => handleExport('pdf')}
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            role="menuitem"
                        >
                            Export to PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExportButton;