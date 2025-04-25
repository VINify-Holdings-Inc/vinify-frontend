import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { disclaimer } from './disclaimer';
import { DateFormatPipe } from '../pipes/date-format.pipe';
import { CapitalizePipe } from '../pipes/capitalize.pipe';

@Injectable({
  providedIn: 'root',
})
export class CreatePDFService {
  private capitalizePipe = new CapitalizePipe();

  constructor(private dateFormate: DateFormatPipe) { }

  generatePDF(
    companyName: string,
    logoUrl: string,
    tableData: any[],
    fileName: string = 'Vehicle_History_Report.pdf'
  ): void {
    const doc = new jsPDF({ orientation: 'landscape' });

    const img = new Image();
    img.src = logoUrl;

    const checkImg = new Image();
    checkImg.src = '/assets/fonts/tick.png';

    const addFooter = () => {
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 1;
      doc.setDrawColor(69, 67, 67);
      doc.setLineWidth(0.1);
      doc.line(14, footerY - 14, 284, footerY - 14);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('*This report is for private use only and may not be resold, shared, or used for commercial purposes or third-party distribution.', 15, footerY - 10);
      doc.text('VINify, Title Alarm, LLC', 15, footerY - 5);
      doc.text('Page ' + (doc as any).internal.getNumberOfPages(), 276, footerY - 5);
    };

    const addHeader = () => {
      const logoWidth = 30.5;
      const logoHeight = 8.5;
      doc.addImage(img, 'PNG', 10, 15, logoWidth, logoHeight);
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.setFont('helvetica', 'bold');
      doc.text('Vehicle History Report', 122, 20);
    };

    img.onload = checkImg.onload = () => {
      addHeader();
      addFooter(); 
      const tableColumn = ['VINs', 'Title', 'Brand', 'JSI'];
      const tableRows = tableData.map((item) => [
        item.vin ? item.vin : " ",
        item.Title ? ' ' : null,
        item.Brand ? " " : null,
        item.JSI ? " " : null,
        item.isOld ? item.isOld :false
      ]);

      (doc as any).autoTable({
        startY: 36,
        theme: 'grid',
        head: [tableColumn],
        body: tableRows,
        headStyles: {
          fillColor: [207, 75, 95],
          fontSize: 8,
        },
        bodyStyles: {
          fontSize: 7,
        },
        margin: { top: 28 },
        columnStyles: {
          0: { cellWidth: 70 },
          1: { cellWidth: 70 },
          2: { cellWidth: 70 },
          3: { cellWidth: 70 },
        },
        didDrawCell: (data: any) => {
          const rowData: any = data.row.raw; 
          // Draw circle if VIN is marked as old
          if (data.section === 'body' && data.column.index === 0) {
            const xPos = data.cell.x + 0.9;
            const yPos = data.cell.y + 3;
            const isOld = rowData[4];
            doc.setFillColor(isOld ? 128 : 207, isOld ? 128 : 75, isOld ? 128 : 95);

            doc.circle(xPos, yPos, 0.5, 'F');
          }

          // Draw checkmark image if the value is truthy
          const colIndex = data.column.index;
          if (
            data.section === 'body' &&
            [1, 2, 3].includes(colIndex) &&
            rowData[colIndex] // Check if the value is truthy
          ) {
            const imgX = data.cell.x + 2;
            const imgY = data.cell.y + 1.5;
            const imgSize = 3;
            doc.addImage(checkImg, 'PNG', imgX, imgY, imgSize, imgSize);
          }
        },
        didDrawPage: (data: any) => {
          if (data.pageNumber > 1) {
            addHeader();
            addFooter();
          }
        },
      });

      doc.setFontSize(14);
      let y = (doc as any).lastAutoTable.finalY + 10;
      doc.text('NMVTIS Consumer Access Product Disclaimer', 15, y + 10);

      const finalY = y + 20;
      let yPosition = finalY;
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const footerHeight = 20;

      const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth + 105);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);

      for (let i = 0; i < disclaimerLines.length; i++) {
        const lineHeight = 5;
        const remainingSpace = pageHeight - yPosition - footerHeight;
        if (remainingSpace < lineHeight) {
          doc.addPage();
          addHeader();
          yPosition = 35;
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100);
        }
        doc.text(disclaimerLines[i], 14, yPosition, { align: 'left' });
        yPosition += lineHeight;
      }

      addFooter();
      doc.save(fileName);
    };

    img.onerror = () => {
      console.error('Failed to load the logo image.');
    };

    checkImg.onerror = () => {
      console.error('Failed to load the checkmark image.');
    };
  }
}
