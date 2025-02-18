import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  downloadFile(records: { vin: string }[]): void {
    // Get the current date in YYYYMMDD format
    const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');

    // Build the file content dynamically
    let fileContent = `CMY        ${records.length}${currentDate}            \n`;

    // Append records dynamically by extracting the `vin`
    records.forEach(record => {
      fileContent += `${record.vin}  \n`;
    });

    // Convert content to Blob
    const blob = new Blob([fileContent], { type: 'text/plain' });

    // Create download link
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'MY.T.CINQ.INPUT.TXT';

    // Append to DOM and trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
