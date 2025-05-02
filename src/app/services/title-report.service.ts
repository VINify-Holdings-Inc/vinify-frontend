import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { disclaimer } from './disclaimer';
import { DateFormatPipe } from '../pipes/date-format.pipe';
import { CapitalizePipe } from '../pipes/capitalize.pipe';

@Injectable({
  providedIn: 'root'
})
export class TitleReportService {

  private capitalizePipe = new CapitalizePipe();

  constructor(private dateFormate: DateFormatPipe) {}

  generatePDF(
    companyName: string,
    logoUrl: string,
    tableData: any[],
    fileName: string = 'Vehicle_History_Report.pdf',
    vinFor: any
  ): void {
    const doc = new jsPDF({ orientation: 'landscape' });

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
      doc.text('Vehicle History Report', 120, 20);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`VIN: ${vinFor}`, 120, 25);
    };

    const img = new Image();
    img.src = logoUrl;

    img.onload = () => {
      addHeader();
      addFooter();

      const tableColumn = ['Status', 'Date', 'Type', 'Brand Name(s)', 'Odometer', 'State', 'City', 'Description', 'Export', 'RPTG Entity', 'Mobile', 'Email'];
      const tableRows = tableData.map((item) => [
        item.status || " ",
        item.titleBrandDate ? this.dateFormate.transform(item.titleBrandDate, 'DD MMM YYYY') : " ",
        item.alertType ? `${item.alertType} hellow` : "hellow", // ✨ Add "hellow"
        item.alertType === 'Title' ? " " : (item.brand ? item.brand.split(' - ')[0] : " "),
        item.odometer || " ",
        item.state || " ",
        item.city || " ",
        item.description || " ",
        item.export ? this.capitalizePipe.transform(item.export) : " ",
        item.rptgEntity || " ",
        item.mobile || " ",
        item.email || " ",
        item.isDel || false,
      ]);

      (doc as any).autoTable({
        startY: 30,
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
          1: { cellWidth: 30 },
        },

        didParseCell: (data: any) => {
          if (data.section === 'body' && data.row.raw[12] == 1) {
            data.cell.styles.fillColor = [246, 225, 228];
          }
        },

        didDrawCell: (data: any) => {
          if (data.section === 'body' && data.column.index === 2) { // ✨ "Type" column
            const { x, y, width, height } = data.cell;
            doc.setDrawColor(255, 0, 0); // Red rectangle
            doc.setLineWidth(0.3);
            doc.rect(x, y, width, height); // Draw rectangle
          }
        },

        didDrawPage: (data: any) => {
          if (data.pageNumber > 1) {
            addHeader();
            addFooter();
          }
        },
      });

      // Disclaimer Section
      doc.setFontSize(14);
      let y = (doc as any).lastAutoTable.finalY + 10;
      doc.text('NMVTIS Consumer Access Product Disclaimer', 15, y + 10);

      let yPosition = y + 20;
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
  }
}
  