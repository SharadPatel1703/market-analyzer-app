import {saveAs}  from 'file-saver';
import * as XLSX from 'xlsx';

export class ExportService {
    static exportToExcel(data: any[], fileName: string): void {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(dataBlob, `${fileName}.xlsx`);
    }

    static exportToCSV(data: any[], fileName: string): void {
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header => JSON.stringify(row[header])).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${fileName}.csv`);
    }

    static exportToPDF(data: any[], fileName: string): void {
        // Implementation would go here using a PDF library
        // For now, we'll just console.log
        console.log('PDF export not implemented yet');
    }
}