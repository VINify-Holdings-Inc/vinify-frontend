import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Correct import for autoTable plugin
import { disclaimer } from './disclaimer';
import { DateFormatPipe } from '../pipes/date-format.pipe'
import { CapitalizePipe } from '../pipes/capitalize.pipe';

@Injectable({
  providedIn: 'root'
})
export class TitleReportService {

  private capitalizePipe = new CapitalizePipe();
  constructor(private dateFormate: DateFormatPipe,) { }
  generatePDF(
    companyName: string,
    logoUrl: string,
    tableData: any[],
    fileName: string = 'Vehicle_History_Report.pdf',
    vinFor:any
  ): void {
    const doc = new jsPDF({ orientation: 'landscape' });
    const addFooter = () => {
        
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 1;
      doc.setDrawColor(69, 67, 67);
      doc.setLineWidth(.1);
      doc.line(14, footerY-14, 284, footerY-14); 
      //doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9);
      doc.text('*This report is for private use only and may not be resold, shared, or used for commercial purposes or third-party distribution. ', 15, footerY - 10);
      doc.text('All rights reserved. Title Alarm, LLC (c) 2019-2025', 15, footerY - 5);
      doc.text('Page ' + (doc as any).internal.getNumberOfPages(), 276, footerY - 5);
      
    };

    const addHeader =() =>{
     // logo
      const logoWidth = 37; // Adjust width
      const logoHeight = 7; // Adjust height
      doc.addImage(img, 'PNG', 10, 15, logoWidth, logoHeight);
      //Title
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.setFont('helvetica', 'bold');
     // doc.text('Vehicle History Report', 70, 20);
      doc.text('Vehicle History Report', 120, 20);
      doc.setFontSize(10);
       doc.setFont('helvetica', 'normal');
       doc.text(`VIN: ${vinFor}`, 120, 25);
    }


    // Add Logo
    const img = new Image();
    img.src = logoUrl;

    img.onload = () => {
      
      // Add Title
      addHeader();

      addFooter();
      // Add Dynamic Table Data
      const tableColumn = ['Status', 'Date','Type','Brand Name(s)','State','City','Description','Export','RPTG Entity','Mobile','Email'];
      const tableRows = tableData.map((item) => [
        item.status ? item.status :"-",
        (item.titleBrandDate ? this.dateFormate.transform(item.titleBrandDate, 'DD MMM YYYY') : '-'),
        item.alertType ? item.alertType : "-",
        item?.brand ? item?.brand?.split(' - ')[0]:"-",
        item.state ? item.state : "-",
        item.city ? item.city : "-",
        item.description ? item.description :"-",
        item.export ? this.capitalizePipe.transform(item.export) : "-",
        item.rptgEntity ? item.rptgEntity :"-",   
       
        item.mobile ? item.mobile : "-",
        item.email ? item.email : "-",
        
      ]);

      (doc as any).autoTable({
        startY: 35, // Starting position for the table
        theme: 'grid',
        head: [tableColumn],
        body: tableRows,
        headStyles: {
          fillColor: [207, 75, 95], // Set header background color to red (RGB)
          //textColor: [255, 255, 255], // Optional: Set header text color to white
          fontSize: 8,
        },
        bodyStyles: {
          fontSize: 7, // Set font size for table data
        },
        margin: { top: 28 },
        columnStyles: {
          1: { cellWidth: 30 }, // Increases width of the "Date" column (index 0)
         
        },
        didDrawPage: (data: any) => {
          if (data.pageNumber > 1) {
            // Add the header with logo and title on subsequent pages
            const logoWidth = 37; // Adjust width
            const logoHeight = 7; // Adjust height
            doc.addImage(img, 'PNG', 10, 15, logoWidth, logoHeight);

            // Add Title
          //   doc.setFontSize(16);
          //   doc.setTextColor(40);
          //   doc.setFont('helvetica', 'bold');
          //  // doc.text('Vehicle History Report', 70, 20);
          //   doc.text('Vehicle History Report', 120, 20);
            addHeader();
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
                addHeader();
                yPosition = 35; // Reset yPosition to the top margin
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
