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


    const today = new Date();
    const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}.${today.getFullYear()}`;


    const doc = new jsPDF();
    const nmvtlogo = 'assets/images/nmvtis-1.png';
    const tickgreen = 'assets/images/tick-green.png';
    const catuionimg = 'assets/images/catuion-img.png';
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

    const addVehicleInfoSection = () => {
      let y = 42; // Position below the header
      // Vehicle Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('REPORT', 12, y);
    };
    const addFooter = () => {
      const pageHeight = doc.internal.pageSize.height;

      const imgWidth = 10;
      const imgHeight = 5;
      const textFontSize = 10;

      const bottomMargin = 2; // 2px bottom margin

      const imgX = 15;
      const imgY = pageHeight - bottomMargin - imgHeight; // Image is 2px above bottom
      const textX = imgX + imgWidth + 5;
      const textY = imgY + imgHeight - 1; // Align text with image

      const hrY = imgY - 4; // Line appears 4px above the image/text

      // Draw horizontal line
      doc.setDrawColor(69, 67, 67);
      doc.setLineWidth(0.1);
      doc.line(14, hrY, 196, hrY);

      // Add image
      doc.addImage(nmvtlogo, 'PNG', imgX, imgY, imgWidth, imgHeight);

      // Add footer text
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(textFontSize);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Title Alarm LLC, Marley Nonami Incorporated is an approved NMVTIS Data Provider.',
        textX,
        textY
      );
    };
    const drawBadge = (doc: any, x: number, y: number, number: string | number) => {
      const radius = 3.5; // Adjust size of the circle

      // Draw red filled circle
      doc.setFillColor(207, 75, 95); // Red color
      doc.circle(x, y, radius, 'F'); // 'F' = Fill

      // Draw white text in the center
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(8);
      doc.text(`${number}`, x, y + 1, { align: 'center' }); // Centered text
    }

    doc.setProperties({ title: "Vehicle History Report" });

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      addHeader();
    }
    addVehicleInfoSection();
    let y = 52;
    const startX = 10;

    // Font settings
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Highlighted source label
    const text = "Source: NMVTIS";
    const textWidth = doc.getTextWidth(text);
    doc.setFillColor(222, 237, 205); // Light green
    doc.rect(startX, y - 4, textWidth + 2, 6, "F");
    doc.setTextColor(0, 128, 0);
    doc.text(text, startX + 1, y);

    // Divider line
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(startX, y, 200, y);

    // Info boxes
    y += 10;

    const infoItems: { text: string; icon: string; color: [number, number, number] }[] = [
      { text: `${titleLength} Title Records Found`, icon: tickgreen, color: [0, 150, 0] },
      { text: `${brandLength} Title Brands Reported`, icon: tickgreen, color: [200, 0, 0] },
      { text: `${jsiLength} Junk and Salvage Records Found`, icon: catuionimg, color: [200, 0, 0] }
    ];


    infoItems.forEach(item => {
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(item.text, startX, y);

      // Add image (height is 6px, so vertically center it with the text)
      doc.addImage(item.icon, 'PNG', 190, y - 5, 6, 6); // adjust `y - 5` if needed

      // Move down enough to avoid overlap
      y += 10; // Was 8 before, increase to 10 or more depending on font/image height

      doc.setDrawColor(220, 220, 220);
      doc.line(startX, y, 200, y);

      y += 10; // Add extra space after the line
    });

    y += 1;

    // Section position (before rendering)
    sectionPositions['title'] = {
      page: (doc as any).internal.getNumberOfPages(),
      y: y - 5
    };

    // Prepare title box
    const title = `Title Record History (${titleCount})`;
    const boxHeight = 10;
    const boxWidth = 192;

    // Title Box
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(60, 60, 60);
    doc.rect(10, y, boxWidth, boxHeight, 'F'); // background
    doc.text(title, 15, y + 7);

    // Source text (aligned at top-right of the box)
    doc.setFontSize(6);
    doc.setTextColor(67, 66, 66);
    doc.setFont('helvetica', 'bold');
    // Increase Y after box to add space before description
    y += boxHeight + 6; // box height + padding

    // Description text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(69, 67, 67);
    const TitleDesc = `This section identifies this vehicle's current and historic DMV titles reported as issued by date, indicating the state and reported mileage. Title brands that have been reported to VINify are shown in the “Title Brands Reported” section below. Each title record represents a new title holder, duplicate title, lien release or other title event. This information reflects the title information on file with NMVTIS. For more information, please contact the state of title. We recommend an inspection by a qualified mechanic.`;
    doc.text(doc.splitTextToSize(TitleDesc, 180), 15, y);
    const pageHeightTitle = doc.internal.pageSize.height;
    const marginBottom = 20; // bottom margin space

    // Adjust y after title
    y += doc.splitTextToSize(TitleDesc, 180).length * 5 + 4;

    // Start loop
    tableData.forEach((item: any, index: number) => {
      const blockHeight = 41; // approx height for each block

      // If next block goes beyond page, add footer first, then add new page
      if (y + blockHeight > pageHeightTitle - marginBottom) {
        addFooter();             // ✅ Add footer before page break
        doc.addPage();           // ➕ New page
        addHeader();             // 📄 Add header on new page
        y = 40;                  // 🔁 Reset y after header
      }

      // Extract and format values
      const titleIssueDate = item?.titleBrandDate
        ? this.dateFormate.transform(item.titleBrandDate, 'DD MMM YYYY')
        : 'N/A';

      const vin = item?.vin || 'N/A';
      const status = item?.status || 'current';
      const location = item?.state || 'California';

      const odometerStr = item?.odometer;
      const numericValue = parseInt(odometerStr?.replace(/[^\d]/g, ''), 10) || 0;
      const miles = `${numericValue.toLocaleString('en-US')} Miles`;

      // Draw block
      y += 10;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(miles, 20, y);

      // Status badge
      doc.setFillColor(207, 225, 235);
      doc.roundedRect(43, y - 5.5, 25, 8, 2, 2, 'F');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(status, 47, y);

      // Title Issue Date
      y += 7;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Title Issue Date: ${titleIssueDate}`, 20, y);

      // VIN
      y += 7;
      doc.setFont("courier", "normal");
      doc.text(vin, 20, y);

      // Location
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(48, 111, 165);
      doc.text(location, 20, y);

      // Space before next block
      y += 10;
    });
    // After all blocks rendered, add final footer
    addFooter(); 
    //brand block for the brand details....
y = y + 1;

const boxHeightBrand = 10;
const boxWidthBrand = 192;
const BrandText = `Title Brands Reported (${brandCount})`;

// === Title Header Box ===
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.setTextColor(255, 255, 255);
doc.setFillColor(60, 60, 60); // Dark gray header
doc.rect(10, y, boxWidthBrand, boxHeightBrand, 'F');
doc.text(BrandText, 15, y + 7);

y += 15;

// === Background Rectangle from below title to Flood damage ===
const backgroundStartY = y-4; // Start after header
let backgroundHeight = 40; // Approximate height to include 4 lines (can adjust if content grows)
doc.setFillColor(231, 236, 242); // #e7ecf2
doc.rect(10, backgroundStartY, boxWidthBrand, backgroundHeight, 'F'); // Background area

// === Source
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.setTextColor(0, 0, 0);
doc.text('Source: NMVTIS', 15, y);

y += 10;

// === Exceeds Mechanical Limits
doc.addImage(catuionimg, 'PNG', 15, y - 4, 5, 5); // caution icon
doc.setFontSize(12);
doc.setFont('helvetica', 'bold');
doc.setTextColor(67, 66, 66);
doc.text('Exceeds Mechanical Limits', 22, y);

y += 10;

// === 68 Additional Brands Checked
doc.addImage(tickgreen, 'PNG', 15, y - 4, 5, 5);
doc.setFontSize(12);
doc.setTextColor(67, 66, 66);
doc.text('68 Additional Brands Checked', 22, y);

y += 10;

// === Clear
doc.addImage(tickgreen, 'PNG', 15, y - 4, 5, 5);
doc.text('Clear', 22, y);

// === Flood Damage
doc.addImage(tickgreen, 'PNG', 70, y - 4, 5, 5);
doc.text('Flood damage', 77, y);
 y += 10;
const lineHeight = 6;
const pageMarginX = 15;
const maxWidth = 180;

// === Horizontal Line (top divider) ===
doc.setDrawColor(180, 180, 180);
doc.setLineWidth(0.3);
doc.line(pageMarginX + 5, y, pageMarginX + maxWidth - 5, y);
y += 6;

// === Header with warning icon and text ===
const iconSize = 6;
doc.addImage(catuionimg, 'PNG', pageMarginX, y - 1, iconSize, iconSize); 
doc.setFontSize(13);
doc.setFont('helvetica', 'bold');
doc.setTextColor(67, 66, 66);
doc.text('Exceeds Mechanical Limits', pageMarginX + iconSize + 3, y + 4); // aligned vertically
y += lineHeight + 2;

doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.setTextColor(80, 80, 80);
doc.text('2007 | Kentucky', pageMarginX, y);

y += lineHeight + 2;

// === Draw outer box background ===
const boxTopY = y;
const boxHeightLoop = 65;
doc.setDrawColor(220, 220, 220);
doc.setFillColor(245, 245, 245);
doc.rect(pageMarginX, boxTopY, maxWidth, boxHeightLoop, 'FD');

y += 8;

// === Section: Date Applied ===
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.setTextColor(100, 100, 100);
doc.text('Date Applied', pageMarginX + 5, y);
y += 5;
doc.setFont('helvetica', 'bold');
doc.setTextColor(0, 0, 0);
doc.text('04/07/2007', pageMarginX + 5, y);
y += 4;

// Line
doc.setDrawColor(200, 200, 200);
doc.setLineWidth(0.3);
doc.line(pageMarginX + 5, y, pageMarginX + maxWidth - 5, y);
y += 6;

// === State ===
doc.setFont('helvetica', 'normal');
doc.setTextColor(100, 100, 100);
doc.text('State', pageMarginX + 5, y);
y += 5;
doc.setFont('helvetica', 'bold');
doc.setTextColor(0, 0, 0);
doc.text('KENTUCKY', pageMarginX + 5, y);
y += 4;

// Line
doc.setDrawColor(200, 200, 200);
doc.line(pageMarginX + 5, y, pageMarginX + maxWidth - 5, y);
y += 6;

// === Vehicle Brand Name ===
doc.setFont('helvetica', 'normal');
doc.setTextColor(100, 100, 100);
doc.text('Vehicle Brand Name', pageMarginX + 5, y);
y += 5;
doc.setFont('helvetica', 'bold');
doc.setTextColor(0, 0, 0);
doc.text('Exceeds Mechanical Limits', pageMarginX + 5, y);
y += 4;

// Line
doc.setDrawColor(200, 200, 200);
doc.line(pageMarginX + 5, y, pageMarginX + maxWidth - 5, y);
y += 6;

// === Description ===
doc.setFont('helvetica', 'normal');
doc.setTextColor(100, 100, 100);
doc.text('Description', pageMarginX + 5, y);
y += 5;

doc.setFont('helvetica', 'bold');
doc.setTextColor(0, 0, 0);
const itemDescription = "The odometer reading is less than the true mileage of the vehicle because the odometer can not display the total number of true miles.";
const wrappedText = doc.splitTextToSize(itemDescription, maxWidth - 10);
doc.text(wrappedText, pageMarginX + 5, y);
y += wrappedText.length * lineHeight;


//
    y = y + 100 
    const tableColumn = ['VINs', 'Date', 'State', 'Status', 'Source'];
    const tableRows = tableData.length > 0 ? tableData.map((item: any) => [
      item?.vin || " ",
      //  item?.brand ? item.brand.split(' - ')[0] : " ",
      item?.titleBrandDate ? this.dateFormate.transform(item.titleBrandDate, 'DD MMM YYYY') : " ",
      item?.state || " ",
      item?.status || " ",
      " "

    ]) : [["", "", "No records found", "", ""]];
    doc.setTextColor(69, 67, 67);
    // Draw Title Information Table
    (doc as any).autoTable({
      startY: y += 5,
      theme: 'grid',
      head: [tableColumn],
      body: tableRows,
      headStyles: { fillColor: [237, 237, 237], fontSize: 8, textColor: [0, 0, 0] },
      bodyStyles: { fontSize: 7 },
      margin: { top: 41, bottom: 25 },
      columnStyles: {
        1: { cellWidth: 30 }, // Increases width of the "Date" column (index 0)
        2: { cellWidth: 25 },
        3: { cellWidth: 30 },
        4: { cellWidth: 35, halign: 'center', valign: 'middle' }
      },
      didDrawCell: function (data: any) {
        if (data.column.index === 4 && data.row.index !== -1) { // "Source" column
          const { x, y, width, height } = data.cell;

          if (data.row.raw[4] === " ") {  // Ensure only one image per row
            doc.text("NMVTIS", x + width / 14, y + 3, { align: "left" });

            const imgWidth = 10; // Image width
            const imgHeight = 5; // Image height
            const imgX = x + width / 2 - imgWidth / 2; // Center horizontally
            const imgY = y + 1; // Center vertically

            doc.addImage(nmvtlogo, 'PNG', imgX, imgY, imgWidth, imgHeight);
          }
        }
      },
      didDrawPage: (data: any) => {
        // if (data.pageNumber > 1)
        addHeader(); addFooter();
      },
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // Brand Title
    y += 5;
    if (brandCount) {
      drawBadge(doc, 14, y - 1, brandCount);  //x,y,number
    }
    doc.setFontSize(14);
    doc.setTextColor(69, 67, 67);

    sectionPositions['brand'] = { page: (doc as any).internal.getNumberOfPages(), y: y - 5 };
    doc.text('Brand Information', 19, y);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('Source', 180, y);
    doc.setFont('helvetica', 'normal');
    doc.text('NMVTIS', 188, y);

    if (brandCount) {
      y += 5;
      doc.setFillColor(248, 215, 218);
      doc.rect(15, y, 180, 9, 'F');
      doc.setTextColor(69, 67, 67);
      doc.setFontSize(9);

      doc.text('Warning – at least one negative title or cautionary DMV title brands have been reported to VINify History.', 20, y + 6);
    }
    doc.setTextColor(69, 67, 67);
    y += 15;

    const brandColumns = ['Date', 'State', 'Brand Name(s)', 'Description', 'Source'];
    const brandRows = brandData.length > 0 ? brandData.map((item: any) => [

      item?.titleBrandDate ? this.dateFormate.transform(item.titleBrandDate, 'DD MMM YYYY') : " ",
      item?.state || " ",
      item?.brand ? item.brand.split(' - ')[0] : " ",
      item?.brand ? item?.brand.split(' - ')[1] : " ",
      " "
    ]) : [["", "", "No records found", "", ""]];

    (doc as any).autoTable({
      startY: y,
      theme: 'grid',
      head: [brandColumns],
      body: brandRows,
      headStyles: { fillColor: [237, 237, 237], fontSize: 8, textColor: [0, 0, 0] },
      bodyStyles: { fontSize: 7 },
      margin: { top: 41, bottom: 25 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        4: { cellWidth: 35, halign: 'center', valign: 'middle' }
      },
      didDrawCell: function (data: any) {
        if (data.column.index === 4 && data.row.index !== -1) { // "Source" column
          const { x, y, width, height } = data.cell;

          if (data.row.raw[4] === " ") {  // Ensure only one image per row
            doc.text("NMVTIS", x + width / 14, y + 3, { align: "left" });

            const imgWidth = 10; // Image width
            const imgHeight = 5; // Image height
            const imgX = x + width / 2 - imgWidth / 2; // Center horizontally
            const imgY = y + 1; // Center vertically

            doc.addImage(nmvtlogo, 'PNG', imgX, imgY, imgWidth, imgHeight);
          }
        }
      },
      didDrawPage: (data: any) => {
        //  if (data.pageNumber > 1)
        addHeader();
        // doc.setFont('helvetica', 'bold'); 
        addFooter();
        //  doc.setFont('helvetica', 'normal'); 
      },
    });

    // **Update y position dynamically again**
    y = (doc as any).lastAutoTable.finalY + 10;

    let pageHeight4 = doc.internal.pageSize.height;
    if (y + 20 > pageHeight4 - 25) { // Adjust 25 for footer space
      doc.addPage();
      y = 40; // Reset Y for new page
      addHeader();
      // doc.setFont('helvetica', 'bold');
      addFooter();
    }

    y += 10;

    // Junk Salvage
    let pageHeight5 = doc.internal.pageSize.height;
    if (y + 20 > pageHeight5 - 25) { // Adjust 25 for footer space
      doc.addPage();
      y = 40; // Reset Y for new page
      addHeader();
      // doc.setFont('helvetica', 'bold');
      addFooter();
    }

    // Junk Salvage
    y += 3;
    if (JSICount) {
      drawBadge(doc, 14, y - 1, JSICount);  //x,y,number
    }
    doc.setFontSize(14);
    doc.setTextColor(69, 67, 67);  //black

    sectionPositions['junksalvage'] = { page: (doc as any).internal.getNumberOfPages(), y: y - 5 };
    doc.text('Junk/Salvage Information', 19, y);
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
      // doc.setFont('helvetica', 'bold');
      addFooter();
      y = 40; // Reset Y for new page
    }
    let yPosition21 = y + 3; // Initial y position
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const text1 = doc.splitTextToSize(JSIDesc1, 180);
    doc.text(text1, 15, yPosition21 + 5);
    doc.setFont('helvetica', 'bold');
    doc.text('Explanatory Note:', 15, yPosition21 + 30);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition21 += 5;

    const text2 = doc.splitTextToSize(JSIDesc2, 180);
    doc.text(text2, 15, yPosition21 + 30);

    y += 44;
    if (JSICount) {
      doc.setFillColor(248, 215, 218);
      doc.rect(15, y + 16, 180, 9, 'F');
      doc.setTextColor(69, 67, 67);  //black
      doc.setFontSize(9);
      doc.text('Warning - junk, salvage or insurance total loss events have been reported to VINify History.', 20, y + 22);
    }
    doc.setTextColor(69, 67, 67);  //black
    y += 35;

    const jsiColumns = ['Date', 'Reporting Entity', 'Reporting Entity Type', 'Description', 'Export', 'Source'];
    const jsiRows = junkSalvageData.length > 0
      ? junkSalvageData.map((item: any) => [
        item?.titleBrandDate ? this.dateFormate.transform(item?.titleBrandDate, 'DD MMM YYYY') : " ",
        item?.VehicleDispositionText || " ",
        item?.ReportingEntityCategoryText || " ",
        item?.EntityName || " ",
        item?.export || " ",
        " ",
      ]) : [["", "", "No records found", "", "", ""]];

    (doc as any).autoTable({
      startY: y,
      theme: 'grid',
      head: [jsiColumns],
      body: jsiRows,
      headStyles: { fillColor: [237, 237, 237], fontSize: 8, textColor: [0, 0, 0] },
      bodyStyles: { fontSize: 7 },
      margin: { top: 41, bottom: 25 },
      columnStyles: {
        0: { cellWidth: 25 },
        5: { cellWidth: 35, halign: 'center', valign: 'middle' }
      },
      didDrawCell: function (data: any) {
        if (data.column.index === 5 && data.row.index !== -1) { // "Source" column
          const { x, y, width, height } = data.cell;

          if (data.row.raw[5] === " ") {  // Ensure only one image per row
            doc.text("NMVTIS", x + width / 14, y + 3, { align: "left" });

            const imgWidth = 10; // Image width
            const imgHeight = 5; // Image height
            const imgX = x + width / 2 - imgWidth / 2; // Center horizontally
            const imgY = y + 1 // Center vertically

            doc.addImage(nmvtlogo, 'PNG', imgX, imgY, imgWidth, imgHeight);
          }
        }
      },
      didDrawPage: (data: any) => {
        //  if (data.pageNumber > 1) 
        addHeader(); addFooter();
      },
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    let pageHeight2 = doc.internal.pageSize.height;
    if (y + 20 > pageHeight2 - 25) { // Adjust 25 for footer space
      doc.addPage();
      y = 40; // Reset Y for new page
      addHeader(); addFooter();
    }

    // Legal Disclaimer
    doc.setFontSize(14);

    sectionPositions['disclaim'] = { page: (doc as any).internal.getNumberOfPages(), y: y + 5 };
    doc.text('NMVTIS Consumer Access Product Disclaimer', 15, y + 10);

    doc.setFont('helvetica', 'normal');
    //const finalY = (doc as any).lastAutoTable.finalY + 25; // Position after the last table
    const finalY = y + 27; // Position after the last table
    let yPosition = finalY;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width - 40;
    const footerHeight = 20; // Reserve 20 units for the footer

    // Split the disclaimer into lines that fit the page width
    const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth + 90);
    // Loop through the disclaimer lines and add them to the PDF, spanning multiple pages if needed
    doc.setFontSize(10);
    doc.setTextColor(69, 67, 67);

    for (let i = 0; i < disclaimerLines.length; i++) {
      const lineHeight = 5; // Approximate line height
      const remainingSpace = pageHeight - yPosition - footerHeight;

      if (remainingSpace < lineHeight) {
        // Start a new page if remaining space is insufficient
        doc.addPage();
        addHeader(); addFooter();
        yPosition = 40; // Reset yPosition to the top margin
        doc.setTextColor(69, 67, 67);
        doc.setFontSize(10);
      }
      // Add line
      doc.text(disclaimerLines[i], 14, yPosition, { align: 'left' });
      yPosition += lineHeight; // Increment yPosition for the next line
      y = yPosition;
    }




    // Sources
    let pageHeight3 = doc.internal.pageSize.height;
    if (y + 20 > pageHeight3 - 25) { // Adjust 25 for footer space
      doc.addPage();
      y = 40; // Reset Y for new page
      addHeader(); addFooter();
    }
    y += 12;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(69, 67, 67);

    sectionPositions['source'] = { page: (doc as any).internal.getNumberOfPages(), y: y - 5 };
    doc.text('Sources', 15, y);
    y += 10;
    if (y + 50 > doc.internal.pageSize.height - 20) {
      doc.addPage();
      addHeader(); addFooter();
      y = 40; // Reset Y for new page
    }
    // Description
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const description = `Your VINify report checks for and reports information from the following high-quality data sources. Please see our report sections page, FAQ, terms of service and disclaimer for more information.`;
    doc.text(doc.splitTextToSize(description, 180), 15, y);
    y += 15;

    const sources1 = [{
      description: `The National Motor Vehicle Title Information System (NMVTIS) is an electronic system that provides consumers with valuable information about a vehicle's condition and history. Prior to purchasing a vehicle, NMVTIS allows consumers, dealers, wholesale auctions, vehicle lenders and insurers to find information on the vehicle's title, most recent odometer reading, brand history, and, in some cases, historical theft data.`,
    }]

    // Loop through data sources
    sources1.forEach((source, index) => {
      // Check for page break
      if (y + 50 > doc.internal.pageSize.height - 20) {
        doc.addPage();
        addHeader(); addFooter();
        y = 40; // Reset Y for new page
      }
      // Add Logo
      doc.addImage(nmvtlogo, 'PNG', 15, y, 40, 20);
      // Add Text
      doc.text(doc.splitTextToSize(source.description, 140), 60, y + 5);
      y += 45; // Move Y down for the next block
    });

    doc.setFont('helvetica', 'normal');
    addFooter();

    const totalPages = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(10);

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

      // Set common font size
      doc.setFontSize(14);

      // Set text color for "Updated" label
      const updatedText = `Updated ${formattedDate}`;
      doc.setTextColor(69, 67, 67); // Dark gray
      doc.setFontSize(14);
      doc.text(updatedText, 16, y1);

      // Set color for navigation links
      links.forEach(link => {
        const section = sectionPositions[link.key];

        if (section) {
          doc.setFontSize(10);
          // Set font color and draw link text
          doc.setTextColor(207, 75, 95); // Pinkish-red
          doc.text(link.text, link.x, y1);

          // Create clickable link
          doc.link(link.x, y1 - 3, doc.getTextWidth(link.text), 4, {
            pageNumber: section.page,
            top: section.y
          });

          // Underline the link
          doc.setLineWidth(0.5);
          doc.setDrawColor(207, 75, 95);
          const textWidth = doc.getTextWidth(link.text);
          doc.line(link.x, y1 + 1.5, link.x + textWidth, y1 + 1.5);
        }
      });
    }

    /************************************************ */
    // Save PDF
    doc.save(fileName);
  }
}

