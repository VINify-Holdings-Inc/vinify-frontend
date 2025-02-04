import {  Component, AfterViewInit, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';

import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { userData } from '../../../../services/api-service.service';
import { CreatePDFService } from '../../../../services/create-pdf.service';
import { PDF_SETTINGS } from '../../../../constants';
import { LoaderComponent } from '../../common/loader/loader.component';

@Component({
  selector: 'app-title-tab',
  imports: [CommonModule,DateFormatPipe,FormsModule,MatTableModule, MatPaginatorModule, MatSortModule,LoaderComponent],
  templateUrl: './title-tab.component.html',
  styleUrl: './title-tab.component.css'
})
export class TitleTabComponent implements OnInit{
  constructor(private userData : userData,private pdfService: CreatePDFService){}
    filerIcon: string = 'assets/images/icons/filter-lines.svg';
    calendarIcon: string = 'assets/images/icons/calendar.svg';
    pdfIcon: string = 'assets/images/icons/pdf.svg';


        totalRecords:any=0;
        searchValue :string="";
        sn : number =0;
        @Input() tableData :any[]=[];
        @Input() page :number=0;
        @Input() totalPages :number=0;
        @Input() totalData :number=0;
        @Input() limit:number=0;
        @Output() handelPaginagtion = new EventEmitter <any>();
        @Output() handelSearch = new EventEmitter <any>();
        @Output() handelAlertFil = new EventEmitter <any>();
        @Input() paramVin:any="";       
        alert:any=null;
        isLoading:boolean=false;
        selectedVins: { vin: string; alertDate: string }[] = [];

       currentPage: number = 1; // Current active page
       visiblePages: number[] = []; // Pages to display in the pagination UI
       maxVisiblePages: number = 4; // Max number of pages to display at once
     
       displayedColumns: string[] = ['status','vin', 'state','brand', 'model','modelYear','titleBrandDate'];
        
       ngOnChanges(changes: SimpleChanges) {
         if (changes['totalPages']) {
           this.updateVisiblePages();  // Trigger pagination update when totalPages changes
         }
        }

       ngOnInit() {
        this.totalRecords=this.tableData;
       
        }

      onClick(pages:any){
         this.handelPaginagtion.emit({"page":pages,"search":this.searchValue.trim()});
         this.sn=(pages-1)*10;
         this.getValifExist();
      } 
      
       
      getSearchVal(){
        if(this.searchValue==""){
          this.searchValue="";
         
        }else{
          if(this.searchValue.trim().length === 0){
            this.searchValue="";
          }else{
            this.handelSearch.emit(this.searchValue.trim());
            this.handelPaginagtion.emit({"page":1,"search":this.searchValue.trim()});
            this.sn=0;
          }
          
        }
      }

      
        getValifExist(){
          if(this.searchValue!=""){
            this.handelSearch.emit(this.searchValue.trim());
          }
        }
      onType(value: string){
        if(value==""){
          this.handelSearch.emit(value.trim());
          
        }
      }
      

      

goToPage(page: number) {
  if (page < 1 || page > this.totalPages) return; // Ensure page is within range
  this.currentPage = page;
  this.handelPaginagtion.emit({"page":page,"search":this.searchValue.trim()});
  this.updateVisiblePages();
 
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.goToPage(this.currentPage);
  }
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.goToPage(this.currentPage);
  }
}

    updateVisiblePages() {

      const visible: number[] = [];
        
      const start = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
      const end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);
      //const end = 4;

      for (let i = start; i <= end; i++) {
        visible.push(i);
      }

      if (start > 1) visible.unshift(1); // Ensure first page is visible
      if (start > 2) visible.splice(1, 0, -1); // Add "..." after the first page

      if (end < this.totalPages) visible.push(this.totalPages); // Ensure last page is visible
      if (end < this.totalPages - 1) visible.splice(visible.length - 1, 0, -1); // Add "..." before the last page

      this.visiblePages = visible;
      this.getValifExist();
    
      
    }

    getBrandDetails(data:any){
      if(data !=null )
        Swal.fire({
          title: 'Info!',
          text: data,
          icon: 'info',
          showClass: {
            popup: 'animated fadeInDown faster',
            icon: 'animated heartBeat delay-1s'
          },
          customClass: {
            popup: 'my-custom-swal', // Add your custom class here
            confirmButton: 'my-confirm-button-class' // Example for confirm button styling
          },
          showCancelButton: false,
          confirmButtonText: 'OK',
        });
        
    }
    alertFilter(data:any){
      this.searchValue="";
      this.handelAlertFil.emit(data);
     }

     exportToPDF(type:any) {
  
      this.getTableData(type);
    }

    getTableData(dataType:any) {
      this.isLoading = true;
      let url = `page=1&limit=10000000&vin=${this.paramVin}`;
         if(dataType!=null){
          url=url+`&isRead=${dataType}`;
         } 
      this.userData.searchVinDataForUser(url).subscribe(
        (res: any) => {
          if (!res.error) {
            this.pdfService.generatePDF(
              PDF_SETTINGS.COMPANY_NAME,
              PDF_SETTINGS.LOGO_URL,
              res?.data?.items || [],
              'Vin-data.pdf'
            );
          }
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
        }
      );
    }

  /*
    updateAlertStatus(data:any){
      let datas = `id=${data.id}`
     this.userData.updateSeenAlertData(datas).subscribe(
       (res:any) => {
          console.log("data",res?.data);
         if(!res.error){
           
         }     
       },
       (err) => {
        
       }
     );
   } */

}
