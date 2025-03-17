
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { disclaimer } from './disclaimerSoap';
import { DateFormatPipe } from '../pipes/date-format.pipe'
import { CapitalizePipe } from '../pipes/capitalize.pipe';


@Injectable({
  providedIn: 'root'
})
export class NavPdfService {

  private capitalizePipe = new CapitalizePipe();
  constructor(private dateFormate: DateFormatPipe,) { }
  
  generatePDF(
    companyName: string,
    vin: string,
    data:any,
    logImage:any,
    fileName: string = 'Vehicle_History_Report.pdf',
  ): void {

   
    const tableData = data?.titleData;
    const brandData= data?.brandData;
    const junkSalvageData = data?.JSI;
    //sources: any[],

    const titleLength=data?.titleData.length;
    const brandLength=data?.brandData.length;
    const jsiLength=data?.JSI.length;

    const titleCount = data?.titleDataCount;
    const brandCount = data?.brandDataCount;
    const JSICount = data?.JSICount;

    const titleMaxDate = data?.titleMaxDate;
    const brandMaxDate = data?.brandMaxDate;
    const jsiMaxDate = data?.jsiMaxDate;

    const doc = new jsPDF();
    const nmvtlogo = 'assets/images/nmvtis-1.png';
    const sectionIds: Record<string, number> = {};
    // Header Section (Every Page)
    const addHeader = () => {
      // Add Logo
      const img = new Image();
      img.src = logImage; // Ensure this file is in your Angular `assets` folder
      doc.addImage(img, 'PNG', 15, 10, 45, 8); // Adjust position and size as needed
    
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
    };
  
    const addVehicleInfoSection = () => {
      let y = 42; // Position below the header
    
      // Vehicle Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('REPORT', 15, y);
      y += 7;

      if(titleCount || brandCount || JSICount ){
      doc.setFillColor(255, 0, 0); // Red color
      doc.roundedRect(15, y-1, 30, 10, 3, 3, 'F'); // x, y, width, height, rx, ry, style (F for fill)

      // Add warning text inside button
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(10);
      doc.text('Warning', 23, y+5); // Adjust position

      // Reset text color to black for the main message
      doc.setTextColor(69, 67, 67); 
      doc.setFontSize(10);

      // Add warning message
      const text = `Warning – at least one negative event has been reported to VIN ALARM History.`
      doc.text(text, 48, y+4);
      doc.text(`We recommend an inspection by a qualified mechanic.`, 48, y+8);
    
      }
         
         
    };

       // Footer (Every Page)
       const addFooter = () => {
       
        const pageHeight = doc.internal.pageSize.height;
        const footerY = pageHeight - 9;
        doc.setDrawColor(69, 67, 67);
        doc.setLineWidth(.1);
        doc.line(14, footerY-14, 196, footerY-14); 
        //doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.text('*This report is for private use only and may not be resold, shared, or used for commercial purposes or third-party distribution. ', 15, footerY - 10);
        doc.text('All rights reserved. Title Alarm, LLC (c) 2019-2025', 15, footerY - 5);
        doc.text('Page ' + (doc as any).internal.getNumberOfPages(), 180, footerY - 5);
        
      };
      const drawBadge = (doc: any, x: number, y: number, number: string | number) => {
        const radius = 3.5; // Adjust size of the circle
      
        // Draw red filled circle
        doc.setFillColor(207, 75, 95); // Red color
        doc.circle(x, y, radius, 'F'); // 'F' = Fill
      
        // Draw white text in the center
        doc.setTextColor(255, 255, 255); // White text
        doc.setFontSize(8);
        doc.text(`${number}`, x, y+1 , { align: 'center' }); // Centered text
      }
    

    doc.setProperties({ title: "Vehicle History Report" });

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      addHeader();
    }
    addVehicleInfoSection();
    
 
    // Report Summary
    //redefied
    let y = 70;  //120
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    sectionIds['summary'] = (doc as any).internal.getNumberOfPages(); 
    doc.text('Report Summary', 15, y);
    y += 7;

    doc.setLineWidth(.4);
    //doc.rect(20, y, 55, 50);
    doc.roundedRect(20, y, 55, 50, 3, 3, 'S')
    const dynamicData = "Title Information"; // Replace with your dynamic data
    doc.setFontSize(12);
    doc.text(dynamicData, 22 , y + 5); 
    doc.setFontSize(9);
    titleLength ? doc.text( tableData[0]?.brand?.split(' - ')[0] ?? '-', 22 , y + 15) : doc.text( '-', 22 , y + 15);
    doc.text(titleLength?titleMaxDate ? this.dateFormate.transform( titleMaxDate, 'DD MMM YYYY') : '-':"-", 22 , y + 25)
    doc.text(titleLength?tableData[0]?.state ?tableData[0]?.state :"-":"-", 22 , y + 35);  
    if(titleCount){
    drawBadge(doc, 24 , y + 44, titleCount);
    doc.setTextColor(69, 67, 67);  //black
    doc.text(' of ' + titleLength+ ' Records ', 28 , y + 45); 
    }else{
      doc.text( titleLength+ ' Records ', 22 , y + 45); 
    }
    //doc.text('NMVTIS', 62 , y + 45);
    doc.addImage(nmvtlogo, 'PNG', 56, y + 39, 17, 10);
    

    //doc.rect(80, y, 55, 50);
    doc.roundedRect(80, y, 55, 50, 3, 3, 'S')
    const dynamicData1 = "Brand Information"; // Replace with your dynamic data
    doc.setFontSize(12);
    doc.text(dynamicData1, 82 , y + 5); 
    doc.setFontSize(9);
    brandLength ? doc.text( brandData[0]?.brand?.split(' - ')[0] ?? '-', 82 , y + 15) : doc.text( '-', 82 , y + 15);
    doc.text(brandLength?brandMaxDate ? this.dateFormate.transform( brandMaxDate, 'DD MMM YYYY') : '-':"-", 82 , y + 25)
    doc.text(brandLength?brandData[0]?.state ?brandData[0]?.state :"-":"-", 82 , y + 35);  
   // doc.text('1 of 1 Records', 82 , y + 45);
   if(brandCount){
    drawBadge(doc, 84 , y + 44, brandCount);
    doc.setTextColor(69, 67, 67);   //black
    doc.text(' of ' + brandLength+ ' Records', 88 , y + 45); 
   }else{
    doc.text(brandLength+ ' Records ', 82 , y + 45); 
   }
   //doc.text('NMVTIS', 122 , y + 45);
   doc.addImage(nmvtlogo, 'PNG', 116, y + 39, 17, 10);

   // doc.rect(140, y, 55, 50);
    doc.roundedRect(140, y, 55, 50, 3, 3, 'S')
    const dynamicData2 = "Junk/Salvage Information"; // Replace with your dynamic data
    doc.setFontSize(12);
    doc.text(dynamicData2, 142 , y + 5); 
    doc.setFontSize(9);
    jsiLength ? doc.text( junkSalvageData[0]?.VehicleDispositionText?.split(' - ')[0] ?? '-', 142 , y + 15) : doc.text( '-', 142 , y + 15);
    doc.text(jsiLength?jsiMaxDate ? this.dateFormate.transform( jsiMaxDate, 'DD MMM YYYY') : '-':"-", 142 , y + 25)
    doc.text(jsiLength?junkSalvageData[0]?.state ?junkSalvageData[0]?.state :"-":"-", 142 , y + 35); 
   
   // doc.text('1 of 1 Records', 142 , y + 45);
    if(JSICount){
      drawBadge(doc, 144 , y + 44, JSICount);
      doc.setTextColor(69, 67, 67);
      doc.text(' of ' + jsiLength+ ' Records', 148 , y + 45); 
    }else{
      doc.text(jsiLength+ ' Records', 142 , y + 45); 
    }
    //doc.text('NMVTIS', 182 , y + 45);
    doc.addImage(nmvtlogo, 'PNG', 176, y + 39, 17, 10);
    

    

    // Title Information
    y += 60;
    if(titleCount){
    drawBadge(doc, 14, y-1, titleCount);  //x,y,number
    }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(69, 67, 67);
    sectionIds['title'] = (doc as any).internal.getNumberOfPages();
    doc.text('Title Information', 19, y);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('Source', 180, y);
    doc.setFont('helvetica', 'normal');
    doc.text('NMVTIS', 188, y);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const TitleDesc = `This section identifies this vehicle's current and historic DMV titles reported as issued by date, indicating the state and reported mileage. Title brands that have been reported to VIN ALARM are shown in the “Title Brands Reported” section below. Each title record represents a new title holder, duplicate title, lien release or other title event. This information reflects the title information on file with NMVTIS. For more information, please contact the state of title. We recommend an inspection by a qualified mechanic.`;
    doc.text(doc.splitTextToSize(TitleDesc, 180), 15, y+6);
    y += 21;
    /*
    if(titleCount){
    y += 5;
    doc.setFillColor(248, 215, 218);
    doc.rect(15, y, 180, 9, 'F');
    doc.setTextColor(69, 67, 67);
    doc.setFontSize(9);
    
    doc.text('Warning - At least one negative title event has been reported.', 20, y + 5);
    }  */
    doc.setTextColor(69, 67, 67);
    y += 10;

    const tableColumn = ['VINs','Brand Name(s)' ,'Date', 'State', 'Status', 'Source'];
    const tableRows = tableData.length > 0 ? tableData.map((item:any) => [
      item?.vin || "-",
      item?.brand ? item.brand.split(' - ')[0] : "-",
      item?.titleBrandDate ? this.dateFormate.transform(item.titleBrandDate, 'DD MMM YYYY') : '-',
      item?.state || "-",
      item?.status || "-",
      " "
      
    ]):[["","","No records found","","",""]];
    doc.setTextColor(69, 67, 67);
    // Draw Title Information Table
    (doc as any).autoTable({
      startY: y += 5, 
      theme: 'grid',
      head: [tableColumn],
      body: tableRows,
      headStyles: { fillColor: [237, 237, 237], fontSize: 8,textColor: [0, 0, 0] },
      bodyStyles: { fontSize: 7 },
      margin: { top: 41 , bottom: 25},
      columnStyles: {
        1: { cellWidth: 30 }, // Increases width of the "Date" column (index 0)
        2: { cellWidth: 25 }, // Increases width of the "Date" column (index 0)
        3: { cellWidth: 30 }, // Increases width of the "Date" column (index 0)
        5: { cellWidth: 35, halign: 'center', valign: 'middle' }
      },
      didDrawCell: function (data: any) {
        if (data.column.index === 5 && data.row.index !== -1) { // "Source" column
          const { x, y, width, height } = data.cell;
          
          if (data.row.raw[5] === " ") {  // Ensure only one image per row
            doc.text("NMVTIS", x + width/14, y + 3, { align: "left" });
    
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
      if(brandCount){
      drawBadge(doc, 14, y-1, brandCount);  //x,y,number
      }
      doc.setFontSize(14);
      doc.setTextColor(69, 67, 67);
      sectionIds['brand'] =  (doc as any).internal.getNumberOfPages(); 
      doc.text('Brand Information', 19, y);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'bold');
      doc.text('Source', 180, y);
      doc.setFont('helvetica', 'normal');
      doc.text('NMVTIS', 188, y);

      if(brandCount){
      y += 5;
      doc.setFillColor(248, 215, 218);
      doc.rect(15, y, 180, 9, 'F');
      doc.setTextColor(69, 67, 67);
      doc.setFontSize(9);
      
      doc.text('Warning – at least one negative title or cautionary DMV title brands have been reported to VIN ALARM History.', 20, y + 6);
      }
      doc.setTextColor(69, 67, 67);
      y += 15;
  
      const brandColumns = ['Date', 'State', 'Brand Name(s)', 'Description','Source'];
const brandRows = brandData.length > 0?brandData.map((item:any) => [
  
  item?.titleBrandDate ? this.dateFormate.transform(item.titleBrandDate, 'DD MMM YYYY') : '-',
  item?.state || "-",
  item?.brand ? item.brand.split(' - ')[0] : "-",
  item?.brand ? item?.brand.split(' - ')[1] : '-' ,
  " "
]):[["","","No records found","",""]];

(doc as any).autoTable({
  startY: y,
  theme: 'grid',
  head: [brandColumns],
  body: brandRows,
  headStyles: { fillColor: [237, 237, 237], fontSize: 8,textColor: [0, 0, 0] },
  bodyStyles: { fontSize: 7 },
  margin: { top: 41,bottom: 25 },
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
            doc.text("NMVTIS", x + width/14, y + 3, { align: "left" });
    
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
       addHeader(); addFooter();
  },
  
});

// **Update y position dynamically again**
y = (doc as any).lastAutoTable.finalY + 10;


let pageHeight4 = doc.internal.pageSize.height;
 if (y + 20 > pageHeight4 - 25) { // Adjust 25 for footer space
     doc.addPage();
     y = 40; // Reset Y for new page
     addHeader();addFooter();
 }
 
 y += 10;

 doc.setFontSize(14);
 doc.setTextColor(69, 67, 67);  //black
 doc.text('Possible Title Brands', 15, y);
 doc.setFontSize(6);
 doc.setFont('helvetica', 'bold');
  doc.text('Source', 180, y);
  doc.setFont('helvetica', 'normal');
  doc.text('NMVTIS', 188, y);

 if (y + 50 > doc.internal.pageSize.height - 20) {
  doc.addPage();
  addHeader();addFooter(); 
  y = 40; // Reset Y for new page

}
const ptb =`VIN ALARM reports can show one or more of the following DMV state title brands. When there are NMVTIS title brands, they are reported in the Title Brands Reported section . To see the descriptions, hover over or click on the brands below. The red, yellow and green indicators show how the brand would be reflected if it was reported for this vehicle.`;

let yPosi = y + 3; // Initial y position
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
const tex = doc.splitTextToSize(ptb, 180);
doc.text(tex, 15, yPosi+5); 





 y+=20;
 const items = [
  { text: 'Clear', x: 10,  color: 'grey' },
  { text: 'Flood Damage', x: 60,  color: 'red' },
  { text: 'Fire Damage', x: 110,  color: 'red' },
  { text: 'Hail Damage', x: 160, color: 'red' },
  { text: 'Salt Water Damage', x: 10,  color: 'red' },
  { text: 'Vandalism', x: 60,  color: 'red' },
  { text: 'Kit Vehicle', x: 110,  color: 'yellow' },
  { text: 'Dismantled', x: 160,  color: 'red' },
  { text: 'Junk', x: 10,  color: 'grey' },
  { text: 'Rebuilt', x: 60,  color: 'grey' },
  { text: 'Reconstructed', x: 110,  color: 'grey' },
  { text: 'Salvage', x: 160, color: 'grey' },
  { text: 'Test Vehicle', x: 10,  color: 'red' },
  { text: 'Refurbished', x: 60,  color: 'red' },
  { text: 'Collision', x: 110,  color: 'grey' },
  { text: 'Reserved', x: 160,  color: 'grey' },
  { text: 'Salvage Retention', x: 10,  color: 'red' },
  { text: 'Prior Taxi', x: 60,  color: 'yellow' },
  { text: 'Prior Police', x: 110,  color: 'yellow' },
  { text: 'Original Taxi', x: 160,  color: 'yellow' },
  { text: 'Original Police', x: 10,  color: 'yellow' },
  { text: 'Remanufactured', x: 60,  color: 'red' },
  
  { text: 'Reserved. Eliminated', x: 110,  color: 'grey' },
  { text: 'Warranty Return', x: 160,  color: 'grey' },
  { text: 'Antique', x: 10, color: 'green' },
  { text: 'Classic', x: 60,  color: 'green' },
  { text: 'Agricultural Vehicle', x: 110,  color: 'green' },
  { text: 'Logging Vehicle', x: 160,  color: 'green' },
  { text: 'Street Rod', x: 10,  color: 'yellow' },
  { text: 'Vehicle Contains Reissued VIN', x: 60,  color: 'yellow' },
  { text: 'Replica', x: 110,  color: 'yellow' },
  
  { text: 'Totaled', x: 160,  color: 'red' },
  { text: 'Owner Retained', x: 10,  color: 'red' },
  { text: 'Reserved. Eliminated. Bond Posted.', x: 60,  color: 'yellow' },
  { text: 'Memorandum Copy', x: 110,  color: 'yellow' },
  { text: 'Reserved. Eliminated. Parts Only', x: 160,  color: 'grey' },

  { text: 'Recovered Theft', x: 10, color: 'yellow' },
  { text: 'Undisclosed Lien', x: 60, color: 'yellow' },
  { text: 'Prior Owner Retained', x: 110,  color: 'grey' },
  { text: 'Vehicle Non-conformity Uncorrected', x: 160,  color: 'grey' },
  { text: 'Vehicle Safety Defect Uncorrected', x: 10,  color: 'grey' },

  { text: 'Vehicle Safety Defect Corrected', x: 60, color: 'grey' },
  { text: 'VIN replaced by a new state assigned VIN', x: 110,  color: 'grey' },
  { text: 'Gray Market', x: 160,  color: 'grey' },

  { text: 'Manufacturer Buyback', x: 10,  color: 'grey' },
  { text: 'Former Rental', x: 60,  color: 'grey' },
  { text: 'Salvage--Stolen', x: 110, color: 'grey' },
  { text: 'Salvage-Reasons Other Than Damage or Stolen', x: 160,  color: 'grey' },
  { text: 'Disclosed Damage', x: 10,  color: 'grey' },
  { text: 'Prior Non-Repairable / Repaired', x: 60,  color: 'grey' },

  { text: 'Crushed', x: 110,  color: 'red' },
  { text: 'Hazardous Substance Contaminated Vehicle', x: 160,  color: 'red' },
  { text: 'Export Only Vehicle.', x: 10,  color: 'red' },
  { text: 'Odometer - Actual', x: 60,  color: 'grey' },
  { text: 'Odometer - Not Actual', x: 110,  color: 'grey' },
  { text: 'Odometer - Not Actual - Odometer tampering verified', x: 160,  color: 'red' },
  { text: 'Exempt from Odometer Disclosure', x: 10,  color: 'green' },

  { text: 'Odometer - Exceeds Mechanical Limits', x: 60,  color: 'red' },
  { text: 'Odometer may be Altered', x: 110,  color: 'red' },
  { text: 'Odometer Replaced', x: 160, color: 'red' },
  { text: 'Odometer - Reading at Time of Renewal', x: 10,  color: 'green' },
  { text: 'Odometer Discrepancy', x: 60,  color: 'red' },
  { text: 'Pending Junk Automobile - CARS.gov', x: 110, color: 'red' },
  { text: 'Junk Automobile - CARS.gov', x: 160,  color: 'grey' },
  

];

// Draw Boxes
y += 12;
items.forEach((item, index) => {
  const boxHeight =   11 ;
  let pageHeight4 = doc.internal.pageSize.height;
  // Check if we need a new page
 
  doc.setFontSize(7);
  if (index % 4 === 0 && index !== 0) {
    y += 15; // Move down after every 4 items
    if (y + boxHeight + 20 > pageHeight4 - 15) { 
      doc.addPage();
      y = 50; // Reset Y with enough space for header
      addHeader();
      addFooter();
    }
  }

  // Handle text wrapping
  const maxWidth = 45; // Box width
  const textLines = doc.splitTextToSize(item.text, maxWidth - 10); // Wrap text
 

  // Set border color
  let borderColor = { r: 100, g: 0, b: 0 }; // Default color
  if (item.color === 'red') borderColor = { r: 255, g: 0, b: 0 };
  else if (item.color === 'yellow') borderColor = { r: 255, g: 255, b: 0 };
  else if (item.color === 'green') borderColor = { r: 0, g: 128, b: 0 };
  else if (item.color === 'grey') borderColor = { r: 128, g: 128, b: 128 };

  doc.setDrawColor(borderColor.r, borderColor.g, borderColor.b);
  
  // Draw box and text
  doc.roundedRect(item.x, y - 5, maxWidth, boxHeight, 2, 2);
  doc.text(textLines, item.x + 5, y);

  
});




 // Junk Salvage
 let pageHeight5 = doc.internal.pageSize.height;
 if (y + 20 > pageHeight5 - 25) { // Adjust 25 for footer space
     doc.addPage();
     y = 40; // Reset Y for new page
     addHeader();addFooter();
 }
    // Junk Salvage
    y += 20;
    if(JSICount){
    drawBadge(doc, 14, y-1, JSICount);  //x,y,number
    }
    doc.setFontSize(14);
    doc.setTextColor(69, 67, 67);  //black
    sectionIds['junksalvage'] = (doc as any).internal.getNumberOfPages();
    doc.text('Junk/Salvage Information', 19, y);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('Source', 180, y);
    doc.setFont('helvetica', 'normal');
    doc.text('NMVTIS', 188, y);
    
    const JSIDesc1 = `This section discloses events related to events like junk, salvage and insurance total loss that have been reported to VIN ALARM. Included are state DMV titles that show junk, salvage or similar brands, insurance total loss events and salvage auctions or junk yard disclosures. Events related to an auto dismantler, auto recycler or crush facility indicate that the vehicle has sustained major damage. A vehicle that has been received by a salvage auction or junk yard usually indicates major prior damage, however these entities also remarket undamaged vehicles. We recommend an inspection by a qualified mechanic.`; 
    const JSIDesc2 = `If this VIN has a record in the Junk/Salvage or Insurance information then the business that submitted the VIN to NMVTIS deemed the vehicle to be either a junk, salvage, or in the case of an insurer, a total loss. The information in the DISPOSITION field in the Junk/Salvage section denotes what has happened to the VIN (i.e., vehicle) since it came into the possession of the business.`;
   
    
    if (y + 50 > doc.internal.pageSize.height - 20) {
      doc.addPage();
      addHeader();addFooter(); 
      y = 40; // Reset Y for new page
    }
    let yPosition21 = y + 3; // Initial y position
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const text1 = doc.splitTextToSize(JSIDesc1, 180);
    doc.text(text1, 15, yPosition21+5); 
    doc.setFont('helvetica', 'bold');
    doc.text('Explanatory Note:', 15, yPosition21+30);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition21 += 5;

    const text2 = doc.splitTextToSize(JSIDesc2, 180);

    doc.text(text2, 15, yPosition21+30);

    y += 44;
    if(JSICount){ 
    doc.setFillColor(248, 215, 218);
    doc.rect(15, y+16, 180, 9, 'F');
    doc.setTextColor(69, 67, 67);  //black
    doc.setFontSize(9);
   
    doc.text('Warning - junk, salvage or insurance total loss events have been reported to VIN ALARM History.', 20, y + 22);
    }
    doc.setTextColor(69, 67, 67);  //black
    y += 35;

    const jsiColumns = ['Date', 'Reporting Entity', 'Reporting Entity Type', 'Description','Export','Source'];
    const jsiRows =  junkSalvageData.length > 0 
      ? junkSalvageData.map((item:any) => [     
      item?.titleBrandDate ? this.dateFormate.transform(item?.titleBrandDate, 'DD MMM YYYY') : '-',
      item?.VehicleDispositionText || "-",
      item?.ReportingEntityCategoryText || "-",
      item?.EntityName || "-",
      item?.export || "-",
      " ",
    ]) : [["","","No records found","","",""]];
    
    (doc as any).autoTable({
      startY: y,
      theme: 'grid',
      head: [jsiColumns],
      body: jsiRows,
      headStyles: { fillColor: [237, 237, 237], fontSize: 8 ,textColor: [0, 0, 0]},
      bodyStyles: { fontSize: 7 },
      margin: { top: 41,bottom: 25 },
      columnStyles: {
        0: { cellWidth: 25 }, 
        5: { cellWidth: 35, halign: 'center', valign: 'middle' }
      },
      didDrawCell: function (data: any) {
        if (data.column.index === 5 && data.row.index !== -1) { // "Source" column
          const { x, y, width, height } = data.cell;
          
          if (data.row.raw[5] === " ") {  // Ensure only one image per row
            doc.text("NMVTIS", x + width/14, y + 3, { align: "left" });
    
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
        addHeader();addFooter();
    }
    
    
  //  addHeader();
   // y += 5;
    // Legal Disclaimer
    doc.setFontSize(14);
    sectionIds['disclaim'] = (doc as any).internal.getNumberOfPages();
    doc.text('NMVTIS Consumer Access Product Disclaimer', 15, y+10);
   // y += 20;
   doc.setFont('helvetica', 'normal');
      //const finalY = (doc as any).lastAutoTable.finalY + 25; // Position after the last table
      const finalY = y+ 27; // Position after the last table
      let yPosition = finalY;
      const pageHeight = doc.internal.pageSize.height; 
      const pageWidth = doc.internal.pageSize.width; 
      const footerHeight = 20; // Reserve 20 units for the footer

      // Split the disclaimer into lines that fit the page width
      const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth + 105);
      //console.log("pageWidth",pageWidth);
      // Loop through the disclaimer lines and add them to the PDF, spanning multiple pages if needed
      doc.setFontSize(10);
      doc.setTextColor(69, 67, 67);

      for (let i = 0; i < disclaimerLines.length; i++) {
        const lineHeight = 5; // Approximate line height
        const remainingSpace = pageHeight - yPosition - footerHeight;

        if (remainingSpace < lineHeight) {
          // Start a new page if remaining space is insufficient
          doc.addPage();
          addHeader();addFooter();
          yPosition = 40; // Reset yPosition to the top margin
        }

        // doc.text(disclaimerLines[i], 10, yPosition); // Add line
        doc.text(disclaimerLines[i], 14, yPosition, { align: 'left' });
        yPosition += lineHeight; // Increment yPosition for the next line
        y=yPosition;
      }



  
    // Sources
    let pageHeight3 = doc.internal.pageSize.height;
    if (y + 20 > pageHeight3 - 25) { // Adjust 25 for footer space
        doc.addPage();
        y = 40; // Reset Y for new page
        addHeader();addFooter();
    }
    y += 12;
   doc.setFontSize(14);
   doc.setFont('helvetica', 'normal');
   doc.setTextColor(69, 67, 67);
   sectionIds['source'] = (doc as any).internal.getNumberOfPages();
  doc.text('Sources', 15, y);
  y += 10;
  if (y + 50 > doc.internal.pageSize.height - 20) {
    doc.addPage();
    addHeader();addFooter(); 
    y = 40; // Reset Y for new page
  }
  // Description
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
const description = `Your VIN ALARM report checks for and reports information from the following high-quality data sources.
Please see our report sections page, FAQ, terms of service and disclaimer for more information.`;
  doc.text(doc.splitTextToSize(description, 180), 15, y);
  y += 15;

  const sources1=[{
   
  description: `The National Motor Vehicle Title Information System (NMVTIS) is an electronic system that provides consumers with valuable information about a vehicle's condition and history. Prior to purchasing a vehicle, NMVTIS allows consumers, dealers, wholesale auctions, vehicle lenders and insurers to find information on the vehicle's title, most recent odometer reading, brand history, and, in some cases, historical theft data.`,
     
  }]

  // Loop through data sources
  sources1.forEach((source, index) => {
    // Check for page break
    if (y + 50 > doc.internal.pageSize.height - 20) {
      doc.addPage();
      addHeader();addFooter(); 
      y = 40; // Reset Y for new page
    }

    // Add Logo
    doc.addImage( nmvtlogo, 'PNG', 15, y, 40, 20);
    
    // Add Text
    doc.text(doc.splitTextToSize(source.description, 140), 60, y + 5);
    
    // Add Copyright
    // doc.setFontSize(8);
    // doc.text(doc.splitTextToSize(source.copyright, 180), 15, y + 30);
    y += 45; // Move Y down for the next block
  });

  doc.setFont('helvetica', 'normal');
    addFooter();  
   // addFooter();
    
    const totalPages =  (doc as any).internal.getNumberOfPages();
    doc.setFontSize(10);

/************************************************ */
const links = [
  { text: 'Report Summary', x: 15, page: sectionIds['summary'] },
  { text: 'Title Information', x: 49, page: sectionIds['title'] },
//{ text: 'Brand Information', x: 82, page: sectionIds['brand'] },  119 151 182
  { text: 'Junk/Salvage', x: 82, page: sectionIds['junksalvage'] },
  { text: 'Legal Disclaimer', x: 111, page: sectionIds['disclaim'] },
  { text: 'Sources', x: 144, page: sectionIds['source'] }
];

 // setting y coordinate
const y1 = 30; 

for (let i = 1; i <= totalPages; i++) {
  doc.setPage(i); // Set to the current page
  doc.setTextColor(32, 29, 30);

  links.forEach(link => {
    doc.textWithLink(link.text, link.x, y1, { pageNumber: link.page });

   
    doc.setLineWidth(0.5);
    doc.setDrawColor(32, 29, 30); 

    // Underline: Draw a line below the text
    const textWidth = doc.getTextWidth(link.text);
    doc.line(link.x, y1 + 1.5, link.x + textWidth, y1 + 1.5); 
  });
}
/************************************************ */


    // Save PDF
    doc.save(fileName);
  }
}

