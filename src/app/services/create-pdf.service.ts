import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Correct import for autoTable plugin
import { disclaimer } from './disclaimer';
import {DateFormatPipe} from '../pipes/date-format.pipe'

@Injectable({
  providedIn: 'root', // Makes this service globally available
})
export class CreatePDFService {
  constructor(private dateFormate:DateFormatPipe){}
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
      const logoWidth = 37; // Adjust width
      const logoHeight = 7; // Adjust height
      doc.addImage(img, 'PNG', 10, 15, logoWidth, logoHeight);

      // Add Title
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.setFont('helvetica', 'bold');
      doc.text('Vehicle History Report', 70, 20);

      // Title Records Section
      // doc.setFontSize(12);
      // doc.setFont('helvetica', 'bold');
      // doc.text('Title Records', 10, 30);

      // Add Dynamic Table Data
      const tableColumn = ['VINs','Year', 'Make','Alert Date', 'State', 'Status'  ];
      const tableRows = tableData.map((item) => [
        item.vin,
        item.modelYear,
        item.model,
        this.dateFormate.transform(item.alertDate, 'DD MMM YYYY') || 'N/A', 
        item.state,
        item.status,
         
      ]);

      (doc as any).autoTable({
        startY: 35, // Starting position for the table
        theme: 'grid',
        head: [tableColumn],
        body: tableRows,
        headStyles: {
          fillColor: [207, 75, 95], // Set header background color to red (RGB)
          //textColor: [255, 255, 255], // Optional: Set header text color to white
        },
        margin: { top: 28 },
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
            doc.text('Vehicle History Report', 70, 20);
      
          }
        },
      });

      // Disclaimer Section (Ensure it spans multiple pages if necessary)
      const finalY = (doc as any).lastAutoTable.finalY + 10; // Position after the last table
      let yPosition = finalY;
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const footerHeight = 20; // Reserve 20 units for the footer

      // Split the disclaimer into lines that fit the page width
      const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth + 105);
      //console.log("pageWidth",pageWidth);
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

      // Save PDF
      doc.save(fileName);
    };

    img.onerror = () => {
      console.error('Failed to load the logo image.');
    };
  }
}