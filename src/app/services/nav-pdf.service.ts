
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

    const doc = new jsPDF();
    const nmvtlogo = 'assets/images/nmvtis-1.png';
    // Header Section (Every Page)
    const addHeader = () => {
      // Add Logo
      const img = new Image();
      img.src = logImage; // Ensure this file is in your Angular `assets` folder
      doc.addImage(img, 'PNG', 15, 10, 45, 8); // Adjust position and size as needed
    
      // Add Title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Vehicle History Report', 80, 20);
    
      // Add VIN and Car Model
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`VIN: ${vin}`, 80, 30);
     // doc.text('2008 NISSAN Sentra', 140, 30);

        // Horizontal Line
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1);
        doc.line(15, 35, 195, 35); 
    };

    const addVehicleInfoSection = () => {
      let y = 45; // Position below the header
    
      // Vehicle Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('REPORT', 15, y);
      y += 10;
    
      // Warning Tagline
      doc.setFontSize(14);
      doc.setFont('helvetica', 'italic');
      doc.text("*Don't risk buying a lemon!", 15, y);
      y += 10;
    
    
    
      // Warning Indicator (Black Bar with Red/White Circles)
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(1);
      doc.line(15, y+5, 195, y+5); 

      doc.setFillColor(0, 0, 0);
      doc.roundedRect(25, y , 40 ,10, 5 ,5, 'F'); // Black Bar
      doc.setFillColor(255, 0, 0);
      doc.circle(35, y + 5, 3, 'F'); // red Circle
      doc.setFillColor(255, 255, 0);
      doc.circle(45, y + 5, 3, 'F'); // yellow Circle
      doc.setFillColor(0, 128, 0);
      doc.circle(55, y + 5, 3, 'F'); // green Circle
      y += 15;
    
     /*
      // Warning Box
      doc.setFillColor(255, 0, 0);
      doc.roundedRect(15, y , 20 ,10, 5 ,5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text('Warning', 18, y + 6);
      doc.setTextColor(0, 0, 0);
      doc.text('Warning - at least one negative event has been reported to VINData History.'+y, 45, y + 7);
      y += 10;
      doc.text('We recommend an inspection by a qualified mechanic.', 45, y + 7);
      y += 10;
    
      // Highlighted Note
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(15, y, 160, 8, 2, 2, 'F');
      doc.setTextColor(0, 0, 0);
      doc.text('Potential problem records are marked in ', 18, y + 5);
      doc.setTextColor(255, 0, 0);
      doc.text('red ', 105, y + 5);
      doc.setTextColor(255, 204, 0);
      doc.text('and yellow', 115, y + 5);
      doc.setTextColor(0, 0, 0);
      y += 15;
       
     */
    };

       // Footer (Every Page)
       const addFooter = () => {
       
        const pageHeight = doc.internal.pageSize.height;
        const footerY = pageHeight - 10;
        doc.setFontSize(10);
        doc.text('This report is for private use only and may not be resold, shared, or used for commercial purposes or third-party ', 15, footerY - 10);
        doc.text('distribution. All rights reserved. Title Alarm, LLC (c) 2019-2025', 15, footerY - 5);
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
    let y = 90;  //120
    doc.setFontSize(14);
    doc.text('Report Summary', 15, y);
    y += 10;

    doc.setLineWidth(.4);
    
    doc.rect(20, y, 50, 50);
    const dynamicData = "Title Information"; // Replace with your dynamic data
    doc.setFontSize(12);
    doc.text(dynamicData, 22 , y + 5); 
    doc.setFontSize(9);
    doc.text('No brand exists for the vehicle.', 22 , y + 15); 
    doc.text('01 Mar 2020.', 22 , y + 25); 
    doc.text('State Name', 22 , y + 35); 
    if(titleCount){
    drawBadge(doc, 24 , y + 44, titleCount);
    doc.setTextColor(0, 0, 0);
    doc.text(' of ' + titleLength+ ' Records ', 28 , y + 45); 
    }else{
      doc.text( titleLength+ ' Records ', 22 , y + 45); 
    }
    

    doc.rect(80, y, 50, 50);
    const dynamicData1 = "Brand Information"; // Replace with your dynamic data
    doc.setFontSize(12);
    doc.text(dynamicData1, 82 , y + 5); 
    doc.setFontSize(9);
    doc.text('No brand exists for the vehicle.', 82 , y + 15); 
    doc.text('01 Mar 2020.', 82 , y + 25); 
    doc.text('State Name', 82 , y + 35); 
   // doc.text('1 of 1 Records', 82 , y + 45);
   if(brandCount){
    drawBadge(doc, 84 , y + 44, brandCount);
    doc.setTextColor(0, 0, 0);
    doc.text(' of ' + brandLength+ ' Records', 88 , y + 45); 
   }else{
    doc.text(brandLength+ ' Records ', 82 , y + 45); 
   }

    doc.rect(140, y, 50, 50);
    const dynamicData2 = "Junk/Salvage/Total Loss"; // Replace with your dynamic data
    doc.setFontSize(12);
    doc.text(dynamicData2, 142 , y + 5); 
    doc.setFontSize(9);
    doc.text('No brand exists for the vehicle.', 142 , y + 15); 
    doc.text('01 Mar 2020.', 142 , y + 25); 
    doc.text('State Name', 142 , y + 35); 
   // doc.text('1 of 1 Records', 142 , y + 45);
    if(JSICount){
      drawBadge(doc, 144 , y + 44, JSICount);
      doc.setTextColor(0, 0, 0);
      doc.text(' of ' + jsiLength+ ' Records', 148 , y + 45); 
    }else{
      doc.text(jsiLength+ ' Records', 142 , y + 45); 
    }
    

    

    // Title Information
    y += 60;
    if(titleCount){
    drawBadge(doc, 14, y-1, titleCount);  //x,y,number
    }
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Title Information', 19, y);
    y += 5;
    doc.setFillColor(248, 215, 218);
    doc.rect(15, y, 180, 9, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    if(titleCount){
    doc.text('Warning - At least one negative title event has been reported.', 20, y + 6);
    }
    doc.setTextColor(0, 0, 0);
    y += 15;

    const tableColumn = ['VINs','Brand Name(s)' ,'Date', 'State', 'Status', 'Source'];
    const tableRows = tableData.map((item:any) => [
      item?.vin || "-",
      item?.brand ? item.brand.split(' - ')[0] : "-",
      item?.titleBrandDate ? this.dateFormate.transform(item.titleBrandDate, 'DD MMM YYYY') : '-',
      item?.state || "-",
      item?.status || "-",
      `NMVTIS`
      
    ]);
    doc.setTextColor(0, 0, 0);
    // Draw Title Information Table
    (doc as any).autoTable({
      startY: y += 5, 
      theme: 'grid',
      head: [tableColumn],
      body: tableRows,
      headStyles: { fillColor: [237, 237, 237], fontSize: 8,textColor: [0, 0, 0] },
      bodyStyles: { fontSize: 7 },
      margin: { top: 37 , bottom: 25},
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
      doc.setTextColor(0, 0, 0);
      doc.text('Title Brands Reported', 19, y);
      y += 5;
      doc.setFillColor(248, 215, 218);
      doc.rect(15, y, 180, 9, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      if(brandCount){
      doc.text('Warning – at least one negative title or cautionary DMV title brands have been reported to VINData History.', 20, y + 6);
      }
      doc.setTextColor(0, 0, 0);
      y += 15;
  
      const brandColumns = ['Date', 'State', 'Brand Name(s)', 'Description','Source'];
const brandRows = brandData.map((item:any) => [
  
  item?.titleBrandDate ? this.dateFormate.transform(item.titleBrandDate, 'DD MMM YYYY') : '-',
  item?.state || "-",
  item?.brand ? item.brand.split(' - ')[0] : "-",
  item?.brand ? item?.brand.split(' - ')[1] : '-' ,
  `NMVTIS`
]);

(doc as any).autoTable({
  startY: y,
  theme: 'grid',
  head: [brandColumns],
  body: brandRows,
  headStyles: { fillColor: [237, 237, 237], fontSize: 8,textColor: [0, 0, 0] },
  bodyStyles: { fontSize: 7 },
  margin: { top: 37,bottom: 25 },
  didDrawPage: (data: any) => {
   //  if (data.pageNumber > 1)
       addHeader(); addFooter();
  },
  
});

// **Update y position dynamically again**
y = (doc as any).lastAutoTable.finalY + 10;

    // Junk Salvage
    y += 5;
    if(JSICount){
    drawBadge(doc, 14, y-1, JSICount);  //x,y,number
    }
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Junk/Salvage/Total Loss', 19, y);
    y += 5;
    doc.setFillColor(248, 215, 218);
    doc.rect(15, y, 180, 9, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    if(JSICount){
    doc.text('Warning - junk, salvage or insurance total loss events have been reported to VINData History.', 20, y + 6);
    }
    doc.setTextColor(0, 0, 0);
    y += 15;

    const jsiColumns = ['Date', 'Reporting Entity', 'Reporting Entity Type', 'Description','Export','Source'];
    const jsiRows = junkSalvageData.map((item:any) => [
     
      item?.titleBrandDate ? this.dateFormate.transform(item?.titleBrandDate, 'DD MMM YYYY') : '-',
      item?.IdentificationID || "-",
      item?.ReportingEntityCategoryText || "-",
      item?.EntityName || "-",
      item?.export || "-",
      `NMVTIS `
    ]);
    
    (doc as any).autoTable({
      startY: y,
      theme: 'grid',
      head: [jsiColumns],
      body: jsiRows,
      headStyles: { fillColor: [237, 237, 237], fontSize: 8 ,textColor: [0, 0, 0]},
      bodyStyles: { fontSize: 7 },
      margin: { top: 37,bottom: 25 },
      didDrawPage: (data: any) => {
      //  if (data.pageNumber > 1) 
          addHeader(); addFooter();
      },
      
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    // Legal Disclaimer
    doc.setFontSize(14);
    doc.text('NMVTIS Consumer Access Product Disclaimer', 15, y+5);
    y += 20;
    // doc.setFontSize(10);
    // doc.text(disclaimer, 15, y);
     
      // Disclaimer Section (Ensure it spans multiple pages if necessary)
      const finalY = (doc as any).lastAutoTable.finalY + 25; // Position after the last table
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
      //doc.setTextColor(100);
      doc.setTextColor(0, 0, 0);

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
        y=yPosition;
      }



  
    // Sources
    y += 10;
   doc.setFontSize(14);
   doc.setTextColor(0, 0, 0);
  doc.text('Data Sources', 15, y);
  y += 10;

  // Description
  doc.setFontSize(10);
const description = `Your VIN ALARM report checks for and reports information from the following high-quality data sources.
Please see our report sections page, FAQ, terms of service and disclaimer for more information.`;
  doc.text(doc.splitTextToSize(description, 180), 15, y);
  y += 15;

  const sources1=[{
   
  description: `The National Motor Vehicle Title Information System (NMVTIS) is an electronic system that provides consumers with valuable information about a vehicle's condition and history. 
  Prior to purchasing a vehicle, NMVTIS allows consumers, dealers, wholesale auctions, vehicle lenders and insurers to find information on the vehicle's title, most recent odometer reading, brand history, and, in some cases, historical theft data.`,
     
  }]

  // Loop through data sources
  sources1.forEach((source, index) => {
    // Check for page break
    if (y + 50 > doc.internal.pageSize.height - 20) {
      doc.addPage();
      y = 20; // Reset Y for new page
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

 
    addFooter();

    // Save PDF
    doc.save(fileName);
  }
}

