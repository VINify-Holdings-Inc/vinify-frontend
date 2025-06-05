import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { disclaimer } from './disclaimerSoap';
import { DateFormatPipe } from '../pipes/date-format.pipe'
//import { CapitalizePipe } from '../pipes/capitalize.pipe';
@Injectable({
  providedIn: 'root'
})
export class NavPdfService {


  //private capitalizePipe = new CapitalizePipe();
  constructor(private dateFormate: DateFormatPipe,) { }

  generatePDF(
    companyName: string,
    vin: string,
    data: any,
    logImage: any,
    fileName: string = 'Vehicle_History_Report.pdf',
  ): void {
    const today = new Date();

    const urlTextColor: [number, number, number] = [224, 138, 151];
    const formattedDate = `${String(today.getUTCDate()).padStart(2, '0')}${String(today.getUTCMonth() + 1).padStart(2, '0')}${today.getUTCFullYear()}`;
    const FinalfileName = `${vin}-VINify-Report-${formattedDate}`;

    const tableData = data?.titleData;
    const brandData = data?.brandData;
    const junkSalvageData = data?.JSI;
    //sources: any[],

    const titleLength = data?.titleData.length;
    const brandLength = data?.brandData.length;
    const jsiLength = data?.JSI.length;

    const titleCount = data?.titleDataCount;
    const brandCount = data?.brandDataCount;
    const JSICount = data?.JSICount;

    const titleMaxDate = data?.titleMaxDate;
    const brandMaxDate = data?.brandMaxDate;
    const jsiMaxDate = data?.jsiMaxDate;

    const doc = new jsPDF();
    const nmvtlogo = 'assets/images/nmvtis-1.png';



    const sectionPositions: { [key: string]: { page: number, y: number } } = {};
    // Header Section (Every Page)
    const addHeader = () => {
      // Add Logo
      const img = new Image();
      img.src = logImage; // Ensure this file is in your Angular `assets` folder
      doc.addImage(img, 'PNG', 15, 10, 30.5, 8.5); // Adjust position and size as needed

      // Add Title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Vehicle History Report', 80, 15);
      doc.setFontSize(10);
      doc.setTextColor(67, 66, 66);
      doc.setFont('helvetica', 'normal');
      // doc.text(updatedText, 160, 15);
      // Add VIN and Car Model
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`VIN: ${vin}`, 80, 20);

      doc.setTextColor(69, 67, 67); // Reset color to black

      // Horizontal Line
      doc.setDrawColor(69, 67, 67);
      doc.setLineWidth(.3);
      doc.line(14, 35, 196, 35);
      //  doc.line(14, 32, 196, 32); 
    };
    // Footer (Every Page)
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

      // Save current color
      const originalColor = doc.getTextColor();

      // Set dark gray
      doc.setTextColor(69, 67, 67);
      doc.setLineWidth(0.1);
      doc.line(14, hrY, 196, hrY);

      doc.addImage(nmvtlogo, 'PNG', imgX, imgY, imgWidth, imgHeight);

      doc.setTextColor(69, 67, 67);
      doc.setFontSize(textFontSize);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Title Alarm LLC, Marley Nonami Incorporated is an approved NMVTIS Data Provider.',
        textX - 2,
        textY - 1
      );

      const dateheader = this.dateFormate.transform(today, 'DD MMM YYYY');
      const updatedText = `Updated ${dateheader}`;
      doc.text(updatedText, 164, textY - 1);

      // Restore original color
      doc.setTextColor(originalColor);
    };



    const drawBadge = (doc: any, x: number, y: number, number: string | number) => {
      const radius = 3;
      doc.setFillColor(207, 75, 95); // Red color
      doc.circle(x, y - 1, radius, 'F');
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(8);
      // doc.text(`${number}`, x, y + 1, { align: 'center' }); // Centered text
    }

    doc.setProperties({ title: "Vehicle History Report" });

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      addHeader();
    }
    // addVehicleInfoSection(); 
    let y = 45;  //120
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');

    sectionPositions['summary'] = { page: (doc as any).internal.getNumberOfPages(), y: y - 5 };
    doc.text('Report Summary', 15, y);
    y += 7;

    doc.setLineWidth(.4);

    doc.roundedRect(20, y, 55, 43, 3, 3, 'S')
    doc.setFont('helvetica', 'bold');
    const dynamicData = `Title Information (${titleCount})`; // Replace with your dynamic data
    doc.setFontSize(10);
    doc.text(dynamicData, 22, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    //titleLength ? doc.text( tableData[0]?.brand?.split(' - ')[0] ?? " ", 22 , y + 15) : doc.text( " ", 22 , y + 15);
    titleLength ? doc.text(tableData[0]?.status ?? " ", 22, y + 12) : doc.text(" ", 22, y + 12);
    doc.setTextColor(0, 0, 0);
    doc.text("Title Issue Date", 22, y + 19)
    doc.setTextColor(69, 67, 67);
    doc.text(titleLength ? titleMaxDate ? this.dateFormate.transform(titleMaxDate, 'DD MMM YYYY') : " " : " ", 22, y + 24)
    doc.setTextColor(0, 0, 0);
    doc.text("Title Issue State", 22, y + 33)
    const stateText = titleLength ? (tableData[0]?.state || " ") : " ";
    const url = tableData[0]?.weburl || "";
    if (url) {
      doc.setTextColor(...urlTextColor)
      doc.textWithLink(stateText, 22, y + 38, { url, underline: true });
    } else {
      doc.setTextColor(69, 67, 67);  // Normal color for plain text
      doc.text(stateText, 22, y + 38);
    }
    doc.setTextColor(69, 67, 67);

    doc.roundedRect(80, y, 55, 43, 3, 3, 'S')
    doc.setFont('helvetica', 'bold');
    const dynamicData1 = `Brand Information (${brandCount})`; // Replace with your dynamic data   
    doc.setFontSize(10);
    doc.text(dynamicData1, 82, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    brandLength ? doc.text(brandData[0]?.brand?.split(' - ')[0] ?? " ", 82, y + 12) : doc.text(" ", 82, y + 12);
    doc.setTextColor(0, 0, 0);
    doc.text("Brand Issue Date", 82, y + 19)
    doc.setTextColor(69, 67, 67);

    doc.text(brandLength ? brandMaxDate ? this.dateFormate.transform(brandMaxDate, 'DD MMM YYYY') : " " : " ", 82, y + 25)
    doc.setTextColor(0, 0, 0);
    doc.text("Brand Issue State", 82, y + 33)
    const stateTexturl = brandLength ? (brandData[0]?.state || " ") : " ";
    const urlbrand = brandData[0]?.weburl || "";
    if (urlbrand) {
      doc.setTextColor(...urlTextColor)

      doc.textWithLink(stateTexturl, 82, y + 38, { url: urlbrand });
    } else {
      doc.setTextColor(69, 67, 67);
      doc.text(stateTexturl, 82, y + 38);
    }

    doc.setTextColor(69, 67, 67);
    doc.roundedRect(140, y, 55, 43, 3, 3, 'S')
    doc.setFont('helvetica', 'bold');
    const dynamicData2 = `Junk/Salvage Information (${JSICount})`;  // Replace with your dynamic data  const dynamicData2 = `Junk/Salvage Information (${brandCount})`; 
    doc.setFontSize(10);
    doc.text(dynamicData2, 142, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    jsiLength ? doc.text(junkSalvageData[0]?.VehicleDispositionText?.split(' - ')[0] ?? " ", 142, y + 12) : doc.text(" ", 142, y + 12);
    doc.setTextColor(0, 0, 0);
    doc.text("JSI Issue Date", 142, y + 19)
    doc.setTextColor(69, 67, 67);
    doc.text(jsiLength ? jsiMaxDate ? this.dateFormate.transform(jsiMaxDate, 'DD MMM YYYY') : " " : " ", 142, y + 25)
    doc.setTextColor(0, 0, 0);
    doc.text("JSI Issue State", 142, y + 33)
    const stateTextJsi = jsiLength ? (junkSalvageData[0]?.state || " ") : " ";
    const urljsii = junkSalvageData[0]?.weburl || "";
    if (urljsii) {
      doc.setTextColor(...urlTextColor)
      doc.textWithLink(stateTextJsi, 142, y + 38, { url: urljsii });
    } else {
      doc.setTextColor(69, 67, 67);
      doc.text(stateTextJsi, 142, y + 38);
    }

    y += 60;
    drawBadge(doc, 14, y - 1, titleCount);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(69, 67, 67);

    sectionPositions['title'] = { page: (doc as any).internal.getNumberOfPages(), y: y - 5 };
    doc.text('Title Record History', 19, y);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('Source', 180, y);
    doc.setFont('helvetica', 'normal');
    doc.text('NMVTIS', 188, y);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const TitleDesc = `This section identifies this vehicle's current and historic DMV titles reported as issued by date, indicating the state and reported mileage. Title brands that have been reported to VINify are shown in the “Title Brands Reported” section below. Each title record represents a new title holder, duplicate title, lien release or other title event. This information reflects the title information on file with NMVTIS. For more information, please contact the state of title. We recommend an inspection by a qualified mechanic.`;
    doc.text(doc.splitTextToSize(TitleDesc, 180), 15, y + 6);
    y += 21;

    doc.setTextColor(69, 67, 67);
    y += 10;

    const tableColumn = ['VINs', 'Title Issue Date', 'Issuing State', 'Odometer Reading', 'Status'];

    const tableRows = tableData.length > 0
      ? tableData.map((item: any) => {
        const odometerStr = item?.odometer || '';
        const numericValue = parseInt(odometerStr.replace(/[^\d]/g, ''), 10) || 0;
        const formattedOdometer = `${numericValue.toLocaleString('en-US')} ${item?.VehicleOdometerReadingUnitCode === "M" ? 'Miles' : 'KM'}`;

        return [
          item?.vin || ' ',
          item?.titleBrandDate ? this.dateFormate.transform(item.titleBrandDate, 'DD MMM YYYY') : ' ',
          item?.state || ' ',
          formattedOdometer,
          item?.status || ' ',
          item?.weburl || '' // Hidden column (index 5)
        ];
      })
      : [['', '', 'No records found', '', '', '']];

    doc.setTextColor(69, 67, 67);

    (doc as any).autoTable({
      startY: y += 5,
      theme: 'grid',
      head: [tableColumn],
      body: tableRows,
      headStyles: { fillColor: [237, 237, 237], fontSize: 8, textColor: [0, 0, 0] },
      bodyStyles: { fontSize: 7 },
      margin: { top: 41, bottom: 25 },
      columnStyles: {
        1: { cellWidth: 30 },
        2: { cellWidth: 25, halign: 'left', valign: 'top' },
        3: { cellWidth: 30 },
        4: { cellWidth: 35 }
      },

      didParseCell: (data: any) => {
        const isNoRecords = data.row.raw.includes('No records found');
        const isIssuingStateColumn = data.column.index === 2;
        const url = data.row.raw[5];

        // Color the "Issuing State" text
        if (data.section === 'body' && isIssuingStateColumn && !isNoRecords) {
          data.cell.styles.textColor = url?.trim() ? urlTextColor : [67, 66, 66]; // Blue if URL exists, dark gray otherwise
        }

        // Special color for "No records found"
        if (data.section === 'body' && isNoRecords) {
          data.cell.styles.textColor = [67, 66, 66];
        }
      },

      didDrawCell: (data: any) => {
        const { column, row, cell, section } = data;
        const rowData = row.raw;

        if (section === 'body' && column.index === 2 && row.index !== -1) {
          const url = rowData[5];
          if (url?.trim()) {
            doc.link(cell.x, cell.y, cell.width, cell.height, { url });
          }
        }
      },

      didDrawPage: (data: any) => {
        addHeader();
        addFooter();
      },
    });




    y = (doc as any).lastAutoTable.finalY + 10;

    // Brand Title
    y += 5;

    const pageHeightBrand = doc.internal.pageSize.height;
    // Check if less than 150px space is left on the current page
    if (pageHeightBrand - y < 70) {
      doc.addPage(); // Add a new page
      y = 44; // Reset Y position for new page (you can choose your margin)
    }
    drawBadge(doc, 14, y - 1, brandCount);  //x,y,number
    doc.setFontSize(14);
    doc.setTextColor(69, 67, 67);
    sectionPositions['brand'] = { page: (doc as any).internal.getNumberOfPages(), y: y - 5 };
    doc.text('Title Brands Reported', 19, y);
    addHeader();
    addFooter();
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('Source', 180, y);
    doc.setFont('helvetica', 'normal');
    doc.text('NMVTIS', 188, y);

    doc.setTextColor(69, 67, 67);
    y += 5;

    const brandColumns = ['Brand Issue Date', 'Brand Issue State', 'Brand Name(s)', 'Description'];
    const brandRows = brandData.length > 0
      ? brandData.map((item: any) => [
        item?.titleBrandDate ? this.dateFormate.transform(item.titleBrandDate, 'DD MMM YYYY') : " ",
        item?.state || " ",
        item?.brand ? item.brand.split(' - ')[0] : " ",
        item?.brand ? item.brand.split(' - ')[1] : " ",
        " ", // Source column for NMVTIS logo
        item?.weburl || " " // Hidden column for hyperlink usage
      ])
      : [["", "", "No records found", "", "", ""]];

    (doc as any).autoTable({
      startY: y,
      theme: 'grid',
      head: [brandColumns],
      body: brandRows,
      headStyles: { fillColor: [237, 237, 237], fontSize: 8, textColor: [0, 0, 0] },
      bodyStyles: { fontSize: 7 },
      margin: { top: 41, bottom: 25 },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 30, halign: 'left', valign: 'top' },
        2: { cellWidth: 30 },
        4: { cellWidth: 35, halign: 'center', valign: 'middle' },
        5: { cellWidth: 0 } // Hidden weburl column
      },

      didParseCell: (data: any) => {
        // Apply blue text color for Brand Issue State (index 1) if URL exists
        if (data.section === 'body' && data.column.index === 1 && data.row.raw[5]?.trim()) {
          data.cell.styles.textColor = urlTextColor // Blue
        }
      },

      didDrawCell: (data: any) => {
        const { column, row, cell, section } = data;
        const rowData = row.raw;
        // Hyperlink on Brand Issue State column
        if (section === 'body' && column.index === 1 && row.index !== -1) {
          const url = rowData[5];
          if (url?.trim()) {
            doc.link(cell.x, cell.y, cell.width, cell.height, { url });
          }
        }
      },

      didDrawPage: (data: any) => {
        addHeader();
        doc.setFont('helvetica', 'normal');
        addFooter();
      },
    });



    // **Update y position dynamically again**
    y = (doc as any).lastAutoTable.finalY + 10;

    let pageHeight4 = doc.internal.pageSize.height;
    if (y + 20 > pageHeight4 - 25) { // Adjust 25 for footer space
      doc.addPage();
      y = 40; // Reset Y for new page
      addHeader();
      doc.setFont('helvetica', 'normal');
      addFooter();
    }

    y += 10;

    // Junk Salvage
    let pageHeight5 = doc.internal.pageSize.height;
    if (y + 20 > pageHeight5 - 25) { // Adjust 25 for footer space
      doc.addPage();
      y = 40; // Reset Y for new page
      addHeader();
      doc.setFont('helvetica', 'normal');
      addFooter();
    }

    // Junk Salvage
    y += 3;
    //black
    const pageHeightJsi = doc.internal.pageSize.height;
    // Check if less than 150px space is left on the current page
    if (pageHeightJsi - y < 70) {
      doc.addPage(); // Add a new page
      y = 44; // Reset Y position for new page (you can choose your margin)
    }
    drawBadge(doc, 14, y - 1, JSICount);
    doc.setFontSize(14);
    doc.setTextColor(69, 67, 67);
    sectionPositions['junksalvage'] = { page: (doc as any).internal.getNumberOfPages(), y: y - 5 };
    doc.text('Junk/Salvage Information', 19, y);
    addHeader();
    addFooter();
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('Source', 180, y);
    doc.setFont('helvetica', 'normal');
    doc.text('NMVTIS', 188, y);

    const JSIDesc1 = `This section discloses events related to events like junk, salvage and insurance total loss that have been reported to VINify. Included are state DMV titles that show junk, salvage or similar brands, insurance total loss events and salvage auctions or junk yard disclosures. Events related to an auto dismantler, auto recycler or crush facility indicate that the vehicle has sustained major damage. A vehicle that has been received by a salvage auction or junk yard usually indicates major prior damage, however these entities also remarket undamaged vehicles. We recommend an inspection by a qualified mechanic.`;
    const JSIDesc2 = `If this VIN has a record in the Junk/Salvage or Insurance information then the business that submitted the VIN to NMVTIS deemed the vehicle to be either a junk, salvage, or in the case of an insurer, a total loss. The information in the DISPOSITION field in the Junk/Salvage section denotes what has happened to the VIN (i.e., vehicle) since it came into the possession of the business.`;

    if (y + 50 > doc.internal.pageSize.height - 20) {
      doc.addPage();
      addHeader();
      doc.setFont('helvetica', 'normal');
      addFooter();
      y = 40; // Reset Y for new page
    }
    let yPosition21 = y + 3; // Initial y position
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const text1 = doc.splitTextToSize(JSIDesc1, 180);
    doc.text(text1, 15, yPosition21 + 5);
    doc.setFont('helvetica', 'bold');
    doc.text('Explanatory Note:', 15, yPosition21 + 33);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition21 += 7;

    const text2 = doc.splitTextToSize(JSIDesc2, 180);
    doc.text(text2, 15, yPosition21 + 30);
    y += 44;
    doc.setTextColor(69, 67, 67);  //black
    y += 15;

    const formatPhoneNumber = (phone: string): string => {
      const cleaned = ('' + phone).replace(/\D/g, '');
      if (cleaned.length === 10) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
      return phone; // fallback to original if not 10 digits
    };

    const jsiColumns = ['Date', 'Report Type', 'Reporting Entity', 'City', 'State', 'Phone', 'Disposition'];

    const jsiRows = junkSalvageData.length > 0
      ? junkSalvageData.map((item: any) => [
        item?.titleBrandDate ? this.dateFormate.transform(item?.titleBrandDate, 'DD MMM YYYY') : " ",
        item?.ReportingEntityCategoryText || " ",
        item?.EntityName || " ",
        item?.LocationCityName || " ",
        item?.state || " ",
        formatPhoneNumber(item?.TelephoneNumberFullID || ""), // <-- formatted phone
        item?.VehicleDispositionText || " ",
        item?.weburl || " "
      ])
      : [["", "", "No records found", "", "", "", "", ""]];

    (doc as any).autoTable({
      startY: y,
      theme: 'grid',
      head: [jsiColumns],
      body: jsiRows,
      headStyles: { fillColor: [237, 237, 237], fontSize: 8, textColor: [0, 0, 0] },
      bodyStyles: { fontSize: 7 },
      margin: { top: 41, bottom: 25 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 25 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 },
        6: { cellWidth: 35 },
        7: { cellWidth: 0 } // Hidden column for web URL
      },

      // Apply blue color if link exists
      didParseCell: (data: any) => {
        if (data.section === 'body' && data.column.index === 4 && data.row.raw[7]?.trim()) {
          data.cell.styles.textColor = urlTextColor; // Blue color
        }
      },

      // Make State cell (index 4) clickable
      didDrawCell: function (data: any) {
        const { column, row, cell, section } = data;
        const rowData = row.raw;

        if (section === 'body' && column.index === 4 && row.index !== -1) {
          const url = rowData[7]; // Hidden column for link
          if (url?.trim()) {
            doc.link(cell.x, cell.y, cell.width, cell.height, { url }); // Clickable area
          }
        }
      },

      didDrawPage: (data: any) => {
        addHeader();
        doc.setFont('helvetica', 'normal');
        addFooter();
      },
    });



    y = (doc as any).lastAutoTable.finalY + 10;

    let pageHeight2 = doc.internal.pageSize.height;
    if (y + 20 > pageHeight2 - 25) { // Adjust 25 for footer space
      doc.addPage();
      y = 40; // Reset Y for new page
      addHeader();
      doc.setTextColor(69, 67, 67);
      doc.setFont('helvetica', 'normal');
      addFooter();
    }

    // Legal Disclaimer
    doc.setFontSize(14);

    const pageHeightDisclamer = doc.internal.pageSize.height;
    // Check if less than 150px space is left on the current page
    if (pageHeightDisclamer - y < 70) {
      doc.addPage(); // Add a new page
      y = 34; // Reset Y position for new page (you can choose your margin)
    }
    // Use pages.length instead of getNumberOfPages()
    sectionPositions['disclaim'] = { page: (doc as any).internal.getNumberOfPages(), y: y - 5 };
    doc.setTextColor(69, 67, 67);
    doc.text('NMVTIS Consumer Access Product Disclaimer', 15, y + 10);
    addHeader();
    addFooter();
    doc.setFont('helvetica', 'normal');
    const finalY = y + 20;
    let yPosition = finalY;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - 27; // 20px left + 20px right padding
    const footerHeight = 15;

    const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth); // 20px margin on both sides
    doc.setFontSize(9);
    doc.setTextColor(69, 67, 67);

    for (let i = 0; i < disclaimerLines.length; i++) {
      const lineHeight = 5;
      const remainingSpace = pageHeight - yPosition - footerHeight;

      if (remainingSpace < lineHeight) {
        doc.setFontSize(9);
        doc.addPage();
        addHeader();
        doc.setFont('helvetica', 'normal');
        addFooter();
        yPosition = 40;
        doc.setTextColor(69, 67, 67);
        doc.setFontSize(10);
      }
      doc.setFontSize(9);
      doc.text(disclaimerLines[i], 15, yPosition, { align: 'left' }); // 20 = left margin
      yPosition += lineHeight;
      y = yPosition;
    }


    y = y + 10;
    const pageHeightSource = doc.internal.pageSize.height;
    // Check if less than 150px space is left on the current page
    if (pageHeightSource - y < 70) {
      doc.addPage(); // Add a new page
      y = 44; // Reset Y position for new page (you can choose your margin)
    }
    doc.setFontSize(14);
    sectionPositions['source'] = { page: (doc as any).internal.getNumberOfPages(), y: y - 5 };
    doc.text('Sources', 15, y);
    addHeader();
    addFooter();
    y += 10;
    if (y + 50 > doc.internal.pageSize.height - 20) {
      doc.addPage();
      addHeader();
      addFooter();
      y = 40; // Reset Y for new page
    }
    // Description
    doc.setFontSize(9);
    doc.setTextColor(69, 67, 67);
    doc.setFont('helvetica', 'normal');
    const description = `Your VINify report checks for and reports information from the following high-quality data sources. Please see our report sections page, FAQ, terms of service and disclaimer for more information.`;
    doc.text(doc.splitTextToSize(description, 180), 15, y);
    y += 15;

    const sources1 = [{
      description: `The National Motor Vehicle Title Information System (NMVTIS) is an electronic system that provides consumers with valuable information about a vehicle's condition and history. Prior to purchasing a vehicle, NMVTIS allows consumers, dealers, wholesale auctions, vehicle lenders and insurers to find information on the vehicle's title, most recent odometer reading, brand history, and, in some cases, historical theft data.`,
    }]

    // Loop through data sources
    doc.setFontSize(9);
    sources1.forEach((source, index) => {
      // Check for page break
      if (y + 50 > doc.internal.pageSize.height - 20) {
        doc.addPage();
        addHeader();
        addFooter();
        y = 40; // Reset Y for new page
      }
      // Add Logo
      doc.addImage(nmvtlogo, 'PNG', 15, y, 40, 20);
      // Add Text
      doc.text(doc.splitTextToSize(source.description, 135), 60, y + 5);
      y += 45; // Move Y down for the next block
    });

    doc.setFont('helvetica', 'normal');
    addFooter();

    const totalPages = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(9);

    /************************************************ */

    const links = [
      { text: 'Report Summary', x: 49, key: 'summary' },
      { text: 'Title Information', x: 84, key: 'title' },
      { text: 'Junk/Salvage', x: 118, key: 'junksalvage' },
      { text: 'Legal Disclaimer', x: 149, key: 'disclaim' },
      { text: 'Sources', x: 183, key: 'source' }
    ];

    // Setting Y coordinate for links
    const y1 = 30;

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setTextColor(207, 75, 95);

      links.forEach(link => {
        const section = sectionPositions[link.key];

        if (section) {
          doc.text(link.text, link.x, y1);
          doc.link(link.x, y1 - 3, doc.getTextWidth(link.text), 4, {
            pageNumber: section.page,
            top: section.y // Scroll to section position
          });

          // Underline effect
          doc.setLineWidth(0.5);
          doc.setDrawColor(207, 75, 95);
          const textWidth = doc.getTextWidth(link.text);
          doc.line(link.x, y1 + 1.5, link.x + textWidth, y1 + 1.5);
        }
      });
    }
    /************************************************ */
    // Save PDF
    doc.save(FinalfileName);
  }
}
