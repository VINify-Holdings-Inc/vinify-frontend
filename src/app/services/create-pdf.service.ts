import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Correct import
import { disclaimer } from './disclaimer';

@Injectable({
  providedIn: 'root', // Makes this service globally available
})
export class CreatePDFService {
  generatePDF(
    companyName: string,
    logoUrl: string,
    tableData: any[],
    fileName: string = 'Vehicle_History_Report.pdf'
  ): void {
    const doc = new jsPDF();

    // Add Logo
    const img = new Image();
    img.src = logoUrl;

    img.onload = () => {
      const logoWidth = 40; // Adjust width
      const logoHeight = 15; // Adjust height
      doc.addImage(img, 'PNG', 10, 10, logoWidth, logoHeight);

      // Add Title
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.setFont('helvetica', 'bold');
      doc.text('Vehicle History Report', 60, 15);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('VIN: 1FAHP2E82HG133621', 60, 25);

      // Draw Header Background (Optional)
      // const headerHeight = 20;
      // doc.setFillColor(242, 246, 255); // Light Blue
      // doc.rect(0, 0, doc.internal.pageSize.width, headerHeight, 'F');

      // Vehicle Specifications Section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text('Vehicle Specifications', 10, 40);

      (doc as any).autoTable({
        startY: 45,
        theme: 'grid',
        head: [],
        body: [
          ['VIN', '1FAHP2E82HG133621'],
          ['Year', '2017'],
          ['Make', 'Ford'],
          ['Model', 'Taurus'],
          ['Fuel Type', 'Gasoline'],
        ],
        didDrawPage: (data: any) => {
          // Add header to every page if table spans multiple pages
          if (data.pageNumber > 1) {
            doc.addImage(img, 'PNG', 10, 10, logoWidth, logoHeight);
            doc.setFontSize(16);
            doc.text('Vehicle History Report', 60, 15);
          }
        },
      });

      // Title Records Section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Title Records', 10, (doc as any).lastAutoTable.finalY + 10);

      // Add Dynamic Table Data
      const tableColumn = ['Date', 'State', 'Status', 'Year', 'Make', 'VIN'];
      const tableRows = tableData.map((item) => [
        item.alertDate,
        item.state,
        item.status,
        item.modelYear,
        item.model,
        item.vin,
      ]);

      (doc as any).autoTable({
        startY: (doc as any).lastAutoTable.finalY + 25, // Continue after last table
        theme: 'grid',
        head: [tableColumn],
        body: tableRows,
        didDrawPage: (data: any) => {
          // Add a header to every page if table spans multiple pages
          if (data.pageNumber > 1) {
            doc.addImage(img, 'PNG', 10, 10, logoWidth, logoHeight);
            doc.setFontSize(16);
            doc.text('Vehicle History Report', 60, 15);

            // Ensure the new table starts from y: 20 on the new page
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Title Records', 10, 20); // Reset the title position for the new page
          }
        },
      });

      // Disclaimer Section (Ensure it doesn't overflow to the next page)
      const finalY = (doc as any).lastAutoTable.finalY + 20;
      const remainingSpace = doc.internal.pageSize.height - finalY;

      if (remainingSpace < 20) {
        doc.addPage(); // Add a new page if there's not enough space for disclaimer
      }

      const disclaimerLines = doc.splitTextToSize(disclaimer, doc.internal.pageSize.width - 20);
      const yPosition = remainingSpace < 20 ? 20 : finalY;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100);
      doc.text(disclaimerLines, 10, yPosition);

      // Save PDF
      doc.save(fileName);
    };

    img.onerror = () => {
      console.error('Failed to load the logo image.');
    };
  }
}
