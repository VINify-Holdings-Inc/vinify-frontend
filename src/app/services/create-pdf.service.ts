import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Correct import for autoTable plugin
import { disclaimer } from './disclaimer';
import { DateFormatPipe } from '../pipes/date-format.pipe'
import { CapitalizePipe } from '../pipes/capitalize.pipe';
@Injectable({
  providedIn: 'root', // Makes this service globally available
})
export class CreatePDFService {
  private capitalizePipe = new CapitalizePipe();
  constructor(private dateFormate: DateFormatPipe,) { }
  generatePDF(
    companyName: string,
    logoUrl: string,
    tableData: any[],
    fileName: string = 'Vehicle_History_Report.pdf'
  ): void {
    const doc = new jsPDF({ orientation: 'landscape' });

    // Add Logo
    const img = new Image();
    img.src = logoUrl;
    const addFooter = () => {
        
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 1;
      doc.setDrawColor(69, 67, 67);
      doc.setLineWidth(.1);
      doc.line(14, footerY-14, 284, footerY-14); 
      //doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('*This report is for private use only and may not be resold, shared, or used for commercial purposes or third-party distribution. ', 15, footerY - 10);
      doc.text('All rights reserved. Title Alarm, LLC (c) 2019-2025', 15, footerY - 5);
      doc.text('Page ' + (doc as any).internal.getNumberOfPages(), 276, footerY - 5);
      
    };
    img.onload = () => {
    
      const logoWidth = 37; // Adjust width
      const logoHeight = 7; // Adjust height
      doc.addImage(img, 'PNG', 10, 15, logoWidth, logoHeight);

      // Add Title
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.setFont('helvetica', 'bold');
      doc.text('Vehicle History Report', 122, 20);
      addFooter();

      // Add Dynamic Table Data
      const tableColumn = ['VINs', 'Date','Type','Brand Name(s)','State'];
      const tableRows = tableData.map((item) => [
        item.vin ? item.vin : "-",
        (item.titleBrandDate ? this.dateFormate.transform(item.titleBrandDate, 'DD MMM YYYY') : '-'),
        item.alertType ? item.alertType : "-",
        item?.brand ? item?.brand?.split(' - ')[0]:"-",
        item.state ? item.state : "-",
      ]);

      (doc as any).autoTable({
        startY: 35, // Starting position for the table
        theme: 'grid',
        head: [tableColumn],
        body: tableRows,
        headStyles: {
          fillColor: [207, 75, 95], // Set header background color to red (RGB)
          fontSize: 8,
        },
        bodyStyles: {
          fontSize: 7, // Set font size for table data
        },
        margin: { top: 28 },
        didDrawCell: (data: any) => {
          if (data.section === 'body' && data.column.index === 0) {
            const rowData: any = data.row.raw;
            const xPos = data.cell.x+.9 ; // Adjust x to position the dot inside cell
            const yPos = data.cell.y + 3; // Adjust y for vertical alignment
            let isOld = rowData?.isOld;
            // Set dot color (Red if old, Grey otherwise)
            doc.setFillColor(isOld ? 128:207 , isOld ? 128:75 , isOld ? 128:95);
            doc.circle(xPos, yPos, .5, 'F'); // Draw dot
          }
        }
        ,
        didDrawPage: (data: any) => {
          if (data.pageNumber > 1) {
            // Add the header with logo and title on subsequent pages
            const logoWidth = 37; // Adjust width
            const logoHeight = 7; // Adjust height
            doc.addImage(img, 'PNG', 10, 15, logoWidth, logoHeight);

            // Add Title
            doc.setFontSize(16);
            doc.setTextColor(40);
            doc.setFont('helvetica', 'bold');
            doc.text('Vehicle History Report', 122, 20);
            addFooter();
          }
        },
      });
  
      doc.setFontSize(14);
    let  y = (doc as any).lastAutoTable.finalY + 10;
      doc.text('NMVTIS Consumer Access Product Disclaimer', 15, y+10);
      
      // Disclaimer Section (Ensure it spans multiple pages if necessary)
      const finalY =   y+ 20; //(doc as any).lastAutoTable.finalY + 10; // Position after the last table
      let yPosition = finalY;
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const footerHeight = 20; // Reserve 20 units for the footer

      // Split the disclaimer into lines that fit the page width
      const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth + 105);
      // Loop through the disclaimer lines and add them to the PDF, spanning multiple pages if needed
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);

      for (let i = 0; i < disclaimerLines.length; i++) {
        const lineHeight = 5; // Approximate line height
        const remainingSpace = pageHeight - yPosition - footerHeight;
        if (remainingSpace < lineHeight) {
          // Start a new page if remaining space is insufficient
          doc.addPage();
          yPosition = 20; // Reset yPosition to the top margin
        }
        // doc.text(disclaimerLines[i], 10, yPosition); // Add line
        doc.text(disclaimerLines[i], 14, yPosition, { align: 'left' });
        yPosition += lineHeight; // Increment yPosition for the next line
      }
      addFooter();
      // Save PDF
      doc.save(fileName);
    };

    img.onerror = () => {
      console.error('Failed to load the logo image.');
    };
  }
}