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
    const nmvtlogo = 'assets/images/nmvtis-1.png';
    const today = new Date();

    let imagesLoaded = 0;

    // const addFooter = () => {
    //   doc.setTextColor(100);
    //   const pageHeight = doc.internal.pageSize.height;
    //   const footerY = pageHeight - 1;
    //   doc.setDrawColor(69, 67, 67);
    //   doc.setLineWidth(0.1);
    //   doc.line(14, footerY - 14, 284, footerY - 14);
    //   doc.setFont('helvetica', 'normal');
    //   doc.setFontSize(9);
    //   doc.text('*This report is for private use only and may not be resold, shared, or used for commercial purposes or third-party distribution.', 15, footerY - 10);
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
      doc.line(14, hrY, 279.5, hrY);

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
      doc.text(updatedText, 248.5, textY - 1);

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
      doc.text('Vehicle History Report', 122, 20);
    };

    const generatePDFContent = () => {
      addHeader();
      addFooter();

      const tableColumn = ['VINs', 'Title', 'Brand', 'JSI'];
      const tableRows = tableData.map((item) => [
        item.vin ? item.vin : " ",
        item.Title ? ' ' : null,
        item.Brand ? " " : null,
        item.JSI ? " " : null,
        item.isOld ? item.isOld : false,
        item.isDel ? item.isDel : false,
        item.isTitleDel ? item.isTitleDel : false,
        item.isBrandDel ? item.isBrandDel : false,
        item.isJSIDel ? item.isJSIDel : false,
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
          1: { cellWidth: 65 },
          2: { cellWidth: 65 },
          3: { cellWidth: 65 },
        },
        didParseCell: (data: any) => {
          if (data.section === 'body' && data.row.raw[5] == 1) {
            data.cell.styles.fillColor = [246, 225, 228];
          }
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

          // Draw checkmark image and dynamic label text
          const colIndex = data.column.index;
          if (data.section === 'body' && [1, 2, 3].includes(colIndex) && rowData[colIndex]) {
            const imgX = data.cell.x + 2;
            const imgY = data.cell.y + 2.5;
            const imgSize = 0.9;

            // Determine the "Deleted" label based on column index and corresponding flag
            let labelText = '';
            if (colIndex === 1 && rowData[6]) {
              labelText = 'Deleted';
            } else if (colIndex === 2 && rowData[7]) {
              labelText = 'Deleted';
            } else if (colIndex === 3 && rowData[8]) {
              labelText = 'Deleted';
            }

            // If there's a "Deleted" label, draw it
            if (labelText) {
              doc.setFontSize(6);
              const textColor: [number, number, number] = [255, 255, 255];
              const boxColor: [number, number, number] = [207, 76, 96];
              const textWidth = doc.getTextWidth(labelText);
              const fontHeight = 6 * 0.35; // Approx font height factor for small font sizes
              const paddingY = 1; // vertical padding
              const x = imgX + 5;
              const y = imgY - 1 + imgSize + 1.2;
              const borderRadius = 2;

              const rectHeight = fontHeight + paddingY * 2;

              doc.setFillColor(...boxColor);
              doc.roundedRect(x - 2, y - fontHeight - paddingY + 0.3, textWidth + 4, rectHeight, borderRadius, borderRadius, 'F');

              doc.setTextColor(...textColor);
              doc.text(labelText, x, y);
            }


            // Draw circle instead of image
            const circleX = imgX + imgSize / 2;
            const circleY = imgY + imgSize / 2;
            doc.setFillColor(207, 75, 95);
            doc.circle(circleX, circleY, 0.5, 'F');

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
      // doc.setTextColor(100);
      let y = (doc as any).lastAutoTable.finalY + 10;

      // ** HERE IS THE CHANGE: Check if space remaining is less than 200 px. If so, add new page **
      const pageHeight = doc.internal.pageSize.height;
      const footerHeight = 20; // same as footer height you use
      const spaceRemaining = pageHeight - y - footerHeight;

      if (spaceRemaining < 200) {
        doc.addPage();
        addHeader();
        addFooter();
        y = 35;  // Reset y position for disclaimer start on new page
      }
      doc.setFontSize(14);
      doc.text('NMVTIS Consumer Access Product Disclaimer', 15, y + 10);
      doc.setTextColor(100);
      // Define page and layout settingsconst leftPadding = 14;
      const leftPadding = 14;
      const rightPadding = -92;
      const startYPosition = y + 20;
      let currentY = startYPosition;

      const pdfPageWidth = doc.internal.pageSize.width;
      const pdfPageHeight = doc.internal.pageSize.height;
      const pdfFooterHeight = 15;

      const contentWidth = pdfPageWidth - (leftPadding + rightPadding);
      const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);

      // Set font styles
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);

      // Render disclaimer text with page break handling
      for (let i = 0; i < disclaimerLines.length; i++) {
        const lineHeight = 5;
        const remainingSpace = pdfPageHeight - currentY - pdfFooterHeight;

        if (remainingSpace < lineHeight) {
          doc.addPage();
          addHeader(); // your custom header function
          currentY = 35;

          // Reapply font styling on new page
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100);
        }

        doc.text(disclaimerLines[i], leftPadding, currentY, { align: 'left' });
        currentY += lineHeight;
      }

      addFooter();
      doc.save(fileName);
    };

    img.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === 2) {
        generatePDFContent();
      }
    };

    checkImg.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === 2) {
        generatePDFContent();
      }
    };

    img.onerror = () => {
      console.error('Failed to load the logo image.');
    };

    checkImg.onerror = () => {
      console.error('Failed to load the checkmark image.');
    };
  }
}
