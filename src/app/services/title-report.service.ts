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
  constructor(private dateFormate: DateFormatPipe) { }
  generatePDF(
    companyName: string,
    logoUrl: string,
    tableData: any[],
    fileName: string = 'Vehicle_History_Report.pdf',
    vinFor: any
  ): void {
    const doc = new jsPDF({ orientation: 'landscape' });
    const urlTextColor: [number, number, number] = [224, 138, 151];
    // const addFooter = () => {
    //   const pageHeight = doc.internal.pageSize.height;
    //   const footerY = pageHeight - 1;
    //   doc.setDrawColor(69, 67, 67);
    //   doc.setLineWidth(.1);
    //   doc.line(14, footerY - 14, 284, footerY - 14);
    //   doc.setFont('helvetica', 'normal');
    //   doc.setFontSize(9);
    //   doc.setTextColor(100);
    //   doc.text('*This report is for private use only and may not be resold, shared, or used for commercial purposes or third-party distribution. ', 15, footerY - 10);
    //   doc.text('VINify, Title Alarm, LLC', 15, footerY - 5);
    //   doc.text('Page ' + (doc as any).internal.getNumberOfPages(), 276, footerY - 5);
    // };
    const addFooter = () => {
      const nmvtlogo = 'assets/images/nmvtis-1.png';
      const today = new Date();
      const pageHeight = doc.internal.pageSize.height;

      const imgWidth = 10;
      const imgHeight = 5;
      const textFontSize = 9;

      const bottomMargin = 2;
      const imgX = 15;
      const imgY = pageHeight - bottomMargin - imgHeight;
      const textX = imgX + imgWidth + 5;
      const textY = imgY + imgHeight - 1;
      const hrY = imgY - 4;

      // Save current color
      const originalColor = doc.getTextColor();

      // Set dark gray
      doc.setDrawColor(67, 66, 66);
      doc.setLineWidth(0.1);
      doc.line(14, hrY, 296, hrY);

      doc.addImage(nmvtlogo, 'PNG', imgX, imgY, imgWidth, imgHeight);

      doc.setTextColor(67, 66, 66);
      doc.setFontSize(textFontSize);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Title Alarm LLC, Marley Nonami Incorporated is an approved NMVTIS Data Provider.',
        textX - 2,
        textY - 1
      );

      const dateheader = this.dateFormate.transform(today, 'DD MMM YYYY');
      const updatedText = `Updated ${dateheader}`;
      doc.text(updatedText, 254, textY - 1);

      // Restore original color
      doc.setTextColor(originalColor);
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

    const checkImg = new Image();
    checkImg.src = '/assets/deleted.png';

    img.onload = () => {
      addHeader();
      addFooter();

      const tableColumn = ['Status', 'Date', 'Type', 'Brand Name(s)', 'Odometer', 'State', 'City', 'Description', 'Export', 'RPTG Entity', 'Mobile', 'Email'];
      const formatPhoneNumber = (phone: string): string => {
        const cleaned = ('' + phone).replace(/\D/g, '');
        if (cleaned.length === 10) {
          return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return phone; // fallback to original if not 10 digits
      };

      const tableRows = tableData.map((item) => [
        item.status || " ",
        item.titleBrandDate ? this.dateFormate.transform(item.titleBrandDate, 'DD MMM YYYY') : " ",
        item.alertType || " ",
        item?.alertType === 'Title' ? " " : (item?.brand ? item.brand.split(' - ')[0] : " "),
        item.odometer || " ",
        item.state || " ",
        item.city || " ",
        item.description || " ",
        item.export ? this.capitalizePipe.transform(item.export) : " ",
        item.rptgEntity || " ",
        formatPhoneNumber(item.mobile || " "),
        item.email || " ",
        item.isDel ? item.isDel : false,      // index 12
        item?.isRead ? item?.isRead : false,  // index 13
        item.weburl || " "                    // index 14: for anchor
      ]);

      (doc as any).autoTable({
        startY: 30,
        theme: 'grid',
        head: [tableColumn],
        body: tableRows,
        headStyles: {
          fillColor: [207, 75, 95],
          fontSize: 8
        },
        bodyStyles: {
          fontSize: 7
        },
        margin: { top: 28 },
        columnStyles: {
          1: { cellWidth: 30 },
          2: { cellWidth: 20 }
        },

        didParseCell: (data: any) => {
          if (data.section === 'body') {
            const isDeleted = data.row.raw[12];
            const isRead = data.row.raw[13];

            // Clear Type column text if deleted
            if (isDeleted && data.column.index === 2) {
              data.cell.text = '';
            }

            // Always clear Status column text (you draw it manually later)
            if (data.column.index === 0) {
              data.cell.text = '';
            }

            // Clear State column to draw anchor manually
            if (data.column.index === 5 && data.row.raw[14] !== " ") {
              data.cell.text = '';
            }
          }
        },

        didDrawCell: (data: any) => {
          const isDeleted = data.row.raw[12];
          const isRead = data.row.raw[13];
          const weburl = data.row.raw[14];

          // Circle before status text (column index 0)
          if (data.section === 'body' && data.column.index === 0) {
            const circleX = data.cell.x + 2.5;
            const circleY = data.cell.y + data.cell.height / 2;

            const textX = circleX + 4;
            const textY = circleY + 1;

            data.cell.text = '';
            doc.setFillColor(isRead ? 128 : 207, isRead ? 128 : 75, isRead ? 128 : 95);
            doc.circle(circleX, circleY, 0.5, 'F');
            doc.setFontSize(7);
            doc.setTextColor(111, 101, 100);
            doc.text(String(data.row.raw[0]), textX, textY);
          }

          // Redraw Type column with image if deleted
          if (data.section === 'body' && data.column.index === 2 && isDeleted) {
            const alertText = data.row.raw[2];
            const textX = data.cell.x + 2;
            const textY = data.cell.y + data.cell.height / 2 + 1;

            doc.setFontSize(7);
            doc.text(String(alertText), textX, textY);

            const imgX = textX + doc.getTextWidth(alertText) + 2;
            const imgY = textY - 2.5;
            doc.addImage(checkImg, 'PNG', imgX, imgY, 8, 3);
          }

          // Draw anchor tag-style link in State column (index 5)
          // Draw anchor-style link in State column (index 5)
          if (data.section === 'body' && data.column.index === 5 && weburl?.trim()) {
            const stateText = data.row.raw[5];
            const textX = data.cell.x + 2;
            const textY = data.cell.y + data.cell.height / 2 + 1;

            // Draw visible link text
            doc.setFontSize(7);
            doc.setTextColor(...urlTextColor);
            doc.textWithLink(stateText, textX, textY, { url: weburl });

            // Make the entire cell clickable
            doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: weburl });

            doc.setTextColor(0); // reset color to default
          }

        },

        didDrawPage: (data: any) => {
          if (data.pageNumber > 1) {
            addHeader();
            addFooter();
          }
        }
      });


      let y = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text('NMVTIS Consumer Access Product Disclaimer', 15, y + 10);

      let yPosition = y + 20;
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const footerHeight = 20;

      const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth + 130);
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
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(disclaimerLines[i], 14, yPosition, { align: 'left' });
        yPosition += lineHeight;
      }
      doc.setTextColor(100);
      addFooter();
      doc.save(fileName);
    };

    img.onerror = () => {
      console.error('Failed to load the logo image.');
    };
  }
}





