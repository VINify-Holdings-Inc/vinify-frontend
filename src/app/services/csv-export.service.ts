import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class CsvExportService {

  constructor() {}

  exportToCsv(jsonData: any[], filename: string): void {
    if (!jsonData || jsonData.length === 0) {
      console.warn('No data available to export.');
      return;
    }

    // Extract headers dynamically
    const headers = Object.keys(jsonData[0]).join(',');

    // Convert JSON to CSV rows
    const csvRows = jsonData.map(item =>
      Object.values(item).map(value => `"${value ?? ''}"`).join(',')
    );

    // Combine headers and rows
    const csvContent = [headers, ...csvRows].join('\n');

    // Convert to Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  }
}
