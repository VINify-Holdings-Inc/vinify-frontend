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

  constructor(private dateFormate: DateFormatPipe) {}

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

    const addFooter = () => {
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

      const originalColor = doc.getTextColor();

      doc.setDrawColor(67, 66, 66);
      doc.setLineWidth(0.1);
      doc.line(16, hrY, 281.5, hrY);

      doc.addImage(nmvtlogo, 'PNG', imgX, imgY, imgWidth, imgHeight);

      doc.setTextColor(67, 66, 66);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Title Alarm LLC, Marley Nonami Incorporated is an approved NMVTIS Data Provider.',
        textX - 2,
        textY - 1
      );

      const dateheader = this.dateFormate.transform(today, 'DD MMM YYYY');
      doc.text(`Updated ${dateheader}`, 247.5, textY - 1);

      doc.setTextColor(originalColor);
    };

    const addHeader = () => {
      const logoWidth = 30.5;
      const logoHeight = 8.5;
      doc.addImage(img, 'PNG', 16.3, 15, logoWidth, logoHeight);
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

      const pageWidth = doc.internal.pageSize.width;
      const columnWidths = [70, 65, 65, 65];
      const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
      const centerMargin = (pageWidth - tableWidth) / 2;

      (doc as any).autoTable({
        startY: 36,
        theme: 'grid',
        head: [tableColumn],
        body: tableRows,
        headStyles: {
          fillColor: [69, 103, 145],
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 10,
        },
        margin: { top: 28, left: centerMargin },
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

          if (data.section === 'body' && data.column.index === 0) {
            const xPos = data.cell.x + 0.9;
            const yPos = data.cell.y + 3;
            const isOld = rowData[4];
            doc.setFillColor(isOld ? 128 : 207, isOld ? 128 : 75, isOld ? 128 : 95);
            doc.circle(xPos, yPos, 0.5, 'F');
          }

          const colIndex = data.column.index;
          if (data.section === 'body' && [1, 2, 3].includes(colIndex) && rowData[colIndex]) {
            const imgX = data.cell.x + 2;
            const imgY = data.cell.y + 2.5;
            const imgSize = 0.9;

            let labelText = '';
            if (colIndex === 1 && rowData[6]) labelText = 'Deleted';
            else if (colIndex === 2 && rowData[7]) labelText = 'Deleted';
            else if (colIndex === 3 && rowData[8]) labelText = 'Deleted';

            if (labelText) {
              doc.setFontSize(6);
              const boxColor: [number, number, number] = [207, 76, 96];
              const textColor : [number, number, number]= [255, 255, 255];
              const textWidth = doc.getTextWidth(labelText);
              const fontHeight = 6 * 0.35;
              const paddingY = 1;
              const x = imgX + 5;
              const y = imgY - 1 + imgSize + 1.2;
              const borderRadius = 2;
              const rectHeight = fontHeight + paddingY * 2;

              doc.setFillColor(...boxColor);
              doc.roundedRect(x - 2, y - fontHeight - paddingY + 0.3, textWidth + 4, rectHeight, borderRadius, borderRadius, 'F');

              doc.setTextColor(...textColor);
              doc.text(labelText, x, y);
            }

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
      let y = (doc as any).lastAutoTable.finalY + 10;

      const pageHeight = doc.internal.pageSize.height;
      const footerHeight = 20;
      const spaceRemaining = pageHeight - y - footerHeight;

      if (spaceRemaining < 200) {
        doc.addPage();
        addHeader();
        addFooter();
        y = 35;
      }

      doc.setFontSize(14);
      doc.text('NMVTIS Consumer Access Product Disclaimer', 15, y + 10);
      doc.setTextColor(100);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(69, 67, 67);

      const pageWidth1 = doc.internal.pageSize.width;
      const pageHeight1 = doc.internal.pageSize.height;

      const leftMargin = 15;
      const rightMargin = 12;
      const footerHeight1 = 15;
      const lineHeight = 5;
      const headerOffset = 40;

      const contentWidth = (pageWidth1 + 200) - (leftMargin + rightMargin);
      const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);

      let yPosition = y + 20;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      for (let i = 0; i < disclaimerLines.length; i++) {
        const remainingSpace = pageHeight1 - yPosition - footerHeight1;
        if (remainingSpace < lineHeight) {
          doc.addPage();
          addHeader();
          addFooter();
          yPosition = headerOffset;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(69, 67, 67);
        }
        doc.text(disclaimerLines[i], leftMargin, yPosition, { align: 'left' });
        yPosition += lineHeight;
        y = yPosition;
      }

      addFooter();
      doc.save(fileName);
    };

    img.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === 2) generatePDFContent();
    };
    checkImg.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === 2) generatePDFContent();
    };
    img.onerror = () => console.error('Failed to load the logo image.');
    checkImg.onerror = () => console.error('Failed to load the checkmark image.');
  }
}
