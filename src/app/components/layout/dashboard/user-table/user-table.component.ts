import {Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges,
  ChangeDetectorRef,
  AfterViewInit,
  OnChanges, } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';
import { CreatePDFService } from '../../../../services/create-pdf.service';
import { PDF_SETTINGS } from '../../../../constants';
import { userData } from '../../../../services/api-service.service';
import { LoaderComponent } from '../../common/loader/loader.component';
import Swal from 'sweetalert2';

import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-table',
  imports: [FormsModule,CommonModule,DateFormatPipe,LoaderComponent,MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent implements AfterViewInit, OnChanges{
  filerIcon: string = 'assets/images/icons/filter-lines.svg';
  calendarIcon: string = 'assets/images/icons/calendar.svg';
  pdfIcon: string = 'assets/images/icons/pdf.svg';
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //@ViewChild(MatSort) sort!: MatSort; 


  constructor(private router: Router,private pdfService: CreatePDFService,private userData: userData,private cdr: ChangeDetectorRef) {
   
  }
  searchValue :string="";
   // totalNoOfData :any=[];
  vins:[] =[]; 
  selectAll = false;
  isLoading: boolean = false;
  //selectedVins: string[] = [];
  selectedVins: { vin: string; alertDate: string }[] = [];
  checkAll:any=null;
  displayedColumns: string[] = ['vin', 'year', 'make', 'titleBrandDate','state','details'];




  @Input() tableData :any[]=[];
  @Input() page :number=0;
  @Input() totalPages :number=0;
  @Input() tableName : string ="";
  @Input() totalItems : number =0;
  @Input() resetData : boolean =false;
  @Input() limit :number=0;
  @Output() handelPaginagtion = new EventEmitter <any>();
  @Output() handelSearch = new EventEmitter <any>();
 
  ngOnChanges(changes: SimpleChanges) {
    if (changes['resetData']) {
      this.searchValue = '';
      this.onType('');
      this.updateVisiblePages();
    }
    if (changes['page'] || changes['totalPages']) {
      this.currentPage = this.page;
      this.updateVisiblePages();
    }
    // Trigger change detection manually to avoid ExpressionChangedAfterItHasBeenCheckedError
    this.cdr.detectChanges();
  }
  
  ngAfterViewInit() {
    this.currentPage = this.page;
    this.updateVisiblePages();
    this.cdr.detectChanges(); // Manually detect changes post view initialization
  }

  currentPage: number = 1; // Current active page
  visiblePages: number[] = []; // Pages to display in the pagination UI
  maxVisiblePages: number = 4; // Max number of pages to display at once

onClick(pages:any){
   this.handelPaginagtion.emit({"page":pages,"search":this.searchValue});
   this.getValifExist();
   this.selectedVins = [];
} 


redirectToOtherPage(vin:string,model:string) {
  const data = { vin: vin, model: model }; // Data to send
  this.router.navigateByUrl('/user-summary-list', { state: data });
}


getSearchVal(){
 console.log("search-us",this.searchValue)
  if(this.searchValue==""){
    this.searchValue="";
  }else{
    if(this.searchValue.trim().length === 0){
      this.searchValue="";
    }else{
      this.handelSearch.emit(this.searchValue.trim());
      this.handelPaginagtion.emit({"page":1,"search":this.searchValue});
     
    }
    
  }
}



onType(value: string){
  console.log("onType");
  if(value==""){
    this.handelSearch.emit(value.trim());
   
  }
}
getVinDetails(vin:any,model:any){
 
    const timestamp = new Date().getTime(); 
      this.router.navigate(['/title-details'], { queryParams: { vin: vin.trim(),model:model, refresh: timestamp }}).then(() => {
      
    });
  
}

exportToPDF(type:any) {
  
  this.getTableData(type);
}

exportToPDFSIngle(type:any) { 
  Swal.fire({
    title: 'Info!',
    text: 'Work in Progress',
    icon: 'info',
    confirmButtonText: 'OK',
  });
}


exportToPDFUdate(type:any) { 
  Swal.fire({
    title: 'Info!',
    text: 'No Updated VINs',
    icon: 'info',
    confirmButtonText: 'OK',
  });
}

getTableData(dataType:any) {
  this.isLoading = true;
  let url = `type=${dataType}`;
  if(dataType=="single"){
     if(this.selectedVins.length==0){
       this.isLoading = false;
                 Swal.fire({
                  title: 'Info!',
                   text: 'Please select VINs',
                   icon: 'info',
                   confirmButtonText: 'OK',
                 });
     
     }   
   
  }

  this.userData.getPdfData(url,this.selectedVins).subscribe(
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



goToPage(page: number) {
  if (page < 1 || page > this.totalPages) return; // Ensure page is within range
  this.currentPage = page;
  this.handelPaginagtion.emit({"page":page,"search":this.searchValue});
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
  //  console.log("test",this.currentPage,this.page);
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

getValifExist(){
  console.log("getValifExist");
  if(this.searchValue!=""){
    this.handelSearch.emit(this.searchValue.trim());
  }
}

}
