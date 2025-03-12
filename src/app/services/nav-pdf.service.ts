
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
     
      doc.setTextColor(0, 0, 0); // Reset color to black


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
      y += 7;

      if(titleCount || brandCount || JSICount ){
      doc.setFillColor(255, 0, 0); // Red color
      doc.roundedRect(15, y-5, 30, 10, 3, 3, 'F'); // x, y, width, height, rx, ry, style (F for fill)

      // Add warning text inside button
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(10);
      doc.text('Warning', 23, y+1); // Adjust position

      // Reset text color to black for the main message
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);

      // Add warning message
      const text = `Warning – at least one negative event has been reported to VIN ALARM History.
      We recommend an inspection by a qualified mechanic.`;
      doc.text(text, 48, y);
      }
      // Warning Tagline
      // doc.setFontSize(14);
      // doc.setFont('helvetica', 'italic');
      // doc.text("*Don't risk buying a lemon!", 15, y);
      // y += 10;
    
    
    
      // Warning Indicator (Black Bar with Red/White Circles)
      /*
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
     */
     
    };

       // Footer (Every Page)
       const addFooter = () => {
       
        const pageHeight = doc.internal.pageSize.height;
        const footerY = pageHeight - 9;
        doc.setFontSize(9);
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
    let y = 70;  //120
    doc.setFontSize(14);
    sectionIds['summary'] = (doc as any).internal.getNumberOfPages(); 
    doc.text('Report Summary', 15, y);
    y += 7;

    doc.setLineWidth(.4);
    doc.rect(20, y, 55, 50);
    const dynamicData = "Title Information"; // Replace with your dynamic data
    doc.setFontSize(12);
    doc.text(dynamicData, 22 , y + 5); 
    doc.setFontSize(9);
    titleLength ? doc.text( titleLength+' Title exists for the vehicle', 22 , y + 15) : doc.text( 'No Title exists for the vehicle', 22 , y + 15);
    doc.text(titleLength?tableData[0]?.titleBrandDate ? this.dateFormate.transform( tableData[0]?.titleBrandDate, 'DD MMM YYYY') : '-':"-", 22 , y + 25)
    doc.text(titleLength?tableData[0]?.state ?tableData[0]?.state :"-":"-", 22 , y + 35);  
    if(titleCount){
    drawBadge(doc, 24 , y + 44, titleCount);
    doc.setTextColor(0, 0, 0);
    doc.text(' of ' + titleLength+ ' Records ', 28 , y + 45); 
    }else{
      doc.text( titleLength+ ' Records ', 22 , y + 45); 
    }
    

    doc.rect(80, y, 55, 50);
    const dynamicData1 = "Brand Information"; // Replace with your dynamic data
    doc.setFontSize(12);
    doc.text(dynamicData1, 82 , y + 5); 
    doc.setFontSize(9);
    brandLength ? doc.text( brandLength+' Brand exists for the vehicle.', 82 , y + 15) : doc.text( 'No Brand exists for the vehicle.', 82 , y + 15);
    doc.text(brandLength?brandData[0]?.titleBrandDate ? this.dateFormate.transform( brandData[0]?.titleBrandDate, 'DD MMM YYYY') : '-':"-", 82 , y + 25)
    doc.text(brandLength?brandData[0]?.state ?brandData[0]?.state :"-":"-", 82 , y + 35);  
   // doc.text('1 of 1 Records', 82 , y + 45);
   if(brandCount){
    drawBadge(doc, 84 , y + 44, brandCount);
    doc.setTextColor(0, 0, 0);
    doc.text(' of ' + brandLength+ ' Records', 88 , y + 45); 
   }else{
    doc.text(brandLength+ ' Records ', 82 , y + 45); 
   }

    doc.rect(140, y, 55, 50);
    const dynamicData2 = "Junk/Salvage/Total Loss"; // Replace with your dynamic data
    doc.setFontSize(12);
    doc.text(dynamicData2, 142 , y + 5); 
    doc.setFontSize(9);
    jsiLength ? doc.text( jsiLength+' JSI exists for the vehicle.', 142 , y + 15) : doc.text( 'No JSI exists for the vehicle.', 142 , y + 15);
    doc.text(jsiLength?junkSalvageData[0]?.titleBrandDate ? this.dateFormate.transform( junkSalvageData[0]?.titleBrandDate, 'DD MMM YYYY') : '-':"-", 142 , y + 25)
    doc.text(jsiLength?junkSalvageData[0]?.state ?junkSalvageData[0]?.state :"-":"-", 142 , y + 35); 
   
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
    sectionIds['title'] = (doc as any).internal.getNumberOfPages();
    doc.text('Title Information', 19, y);
    if(titleCount){
    y += 5;
    doc.setFillColor(248, 215, 218);
    doc.rect(15, y, 180, 9, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    
    doc.text('Warning - At least one negative title event has been reported.', 20, y + 6);
    }
    doc.setTextColor(0, 0, 0);
    y += 15;

    const tableColumn = ['VINs','Brand Name(s)' ,'Date', 'State', 'Status', 'Source'];
    const tableRows = tableData.length > 0 ? tableData.map((item:any) => [
      item?.vin || "-",
      item?.brand ? item.brand.split(' - ')[0] : "-",
      item?.titleBrandDate ? this.dateFormate.transform(item.titleBrandDate, 'DD MMM YYYY') : '-',
      item?.state || "-",
      item?.status || "-",
      `NMVTIS`
      
    ]):[["","","No records found","","",""]];
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
      columnStyles: {
        1: { cellWidth: 30 }, // Increases width of the "Date" column (index 0)
        2: { cellWidth: 25 }, // Increases width of the "Date" column (index 0)
        3: { cellWidth: 30 }, // Increases width of the "Date" column (index 0)
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
      doc.setTextColor(0, 0, 0);
      sectionIds['brand'] =  (doc as any).internal.getNumberOfPages(); 
      doc.text('Title Brands Reported', 19, y);
      if(brandCount){
      y += 5;
      doc.setFillColor(248, 215, 218);
      doc.rect(15, y, 180, 9, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      
      doc.text('Warning – at least one negative title or cautionary DMV title brands have been reported to VINData History.', 20, y + 6);
      }
      doc.setTextColor(0, 0, 0);
      y += 15;
  
      const brandColumns = ['Date', 'State', 'Brand Name(s)', 'Description','Source'];
const brandRows = brandData.length > 0?brandData.map((item:any) => [
  
  item?.titleBrandDate ? this.dateFormate.transform(item.titleBrandDate, 'DD MMM YYYY') : '-',
  item?.state || "-",
  item?.brand ? item.brand.split(' - ')[0] : "-",
  item?.brand ? item?.brand.split(' - ')[1] : '-' ,
  `NMVTIS`
]):[["","","No records found","",""]];

(doc as any).autoTable({
  startY: y,
  theme: 'grid',
  head: [brandColumns],
  body: brandRows,
  headStyles: { fillColor: [237, 237, 237], fontSize: 8,textColor: [0, 0, 0] },
  bodyStyles: { fontSize: 7 },
  margin: { top: 37,bottom: 25 },
  columnStyles: {
    0: { cellWidth: 25 }, 
    1: { cellWidth: 30 }, 
    2: { cellWidth: 30 }, 
  },
  didDrawPage: (data: any) => {
   //  if (data.pageNumber > 1)
       addHeader(); addFooter();
  },
  
});

// **Update y position dynamically again**
y = (doc as any).lastAutoTable.finalY + 10;

    // Junk Salvage
    y += 10;
    if(JSICount){
    drawBadge(doc, 14, y-1, JSICount);  //x,y,number
    }
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    sectionIds['junksalvage'] = (doc as any).internal.getNumberOfPages();
    doc.text('Junk/Salvage/Total Loss', 19, y);
    if(JSICount){
    y += 5;
    doc.setFillColor(248, 215, 218);
    doc.rect(15, y, 180, 9, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
   
    doc.text('Warning - junk, salvage or insurance total loss events have been reported to VINData History.', 20, y + 6);
    }
    doc.setTextColor(0, 0, 0);
    y += 15;

    const jsiColumns = ['Date', 'Reporting Entity', 'Reporting Entity Type', 'Description','Export','Source'];
    const jsiRows =  junkSalvageData.length > 0 
      ? junkSalvageData.map((item:any) => [     
      item?.titleBrandDate ? this.dateFormate.transform(item?.titleBrandDate, 'DD MMM YYYY') : '-',
      item?.IdentificationID || "-",
      item?.ReportingEntityCategoryText || "-",
      item?.EntityName || "-",
      item?.export || "-",
      `NMVTIS `
    ]) : [["","","No records found","","",""]];
    
    (doc as any).autoTable({
      startY: y,
      theme: 'grid',
      head: [jsiColumns],
      body: jsiRows,
      headStyles: { fillColor: [237, 237, 237], fontSize: 8 ,textColor: [0, 0, 0]},
      bodyStyles: { fontSize: 7 },
      margin: { top: 37,bottom: 25 },
      columnStyles: {
        0: { cellWidth: 25 }, 
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
    doc.text('NMVTIS Consumer Access Product Disclaimer', 15, y+15);
   // y += 20;
   doc.setFont('helvetica', 'normal');
      // Disclaimer Section (Ensure it spans multiple pages if necessary)
    //const finalY = (doc as any).lastAutoTable.finalY + 25; // Position after the last table
      const finalY = y+ 25; // Position after the last table
      let yPosition = finalY;
      const pageHeight = doc.internal.pageSize.height; 
      const pageWidth = doc.internal.pageSize.width; 
      const footerHeight = 20; // Reserve 20 units for the footer

      // Split the disclaimer into lines that fit the page width
      const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth + 105);
      //console.log("pageWidth",pageWidth);
      // Loop through the disclaimer lines and add them to the PDF, spanning multiple pages if needed
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      for (let i = 0; i < disclaimerLines.length; i++) {
        const lineHeight = 5; // Approximate line height
        const remainingSpace = pageHeight - yPosition - footerHeight;

        if (remainingSpace < lineHeight) {
          // Start a new page if remaining space is insufficient
          doc.addPage();
          addHeader();
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
    y += 10;
   doc.setFontSize(14);
   doc.setFont('helvetica', 'bold');
   doc.setTextColor(0, 0, 0);
   sectionIds['source'] = (doc as any).internal.getNumberOfPages();
  doc.text('Data Sources', 15, y);
  y += 10;

  // Description
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
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
      addHeader();
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

 
    addFooter();
     
    const totalPages =  (doc as any).internal.getNumberOfPages();
    doc.setFontSize(10);
    // Loop through each page and add the links
for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i); // Set to the current page
    doc.setTextColor(32, 29, 30);
    doc.textWithLink('Summary', 15, 30, { pageNumber: sectionIds['summary'] });
    doc.textWithLink('Title Information', 40, 30, { pageNumber: sectionIds['title'] });
    doc.textWithLink('Brand Report', 75, 30, { pageNumber: sectionIds['brand'] });
    doc.textWithLink('Junk/Salvage', 105, 30, { pageNumber: sectionIds['junksalvage'] });
    doc.textWithLink('Disclaimer', 135, 30, { pageNumber: sectionIds['disclaim'] });
    doc.textWithLink('Source', 160, 30, { pageNumber: sectionIds['source'] });
}



    // Save PDF
    doc.save(fileName);
  }
}

