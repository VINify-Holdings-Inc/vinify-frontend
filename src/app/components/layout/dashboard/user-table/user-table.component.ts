import { Component, Input,Output,EventEmitter,ViewChild } from '@angular/core';
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
export class UserTableComponent {
  filerIcon: string = 'assets/images/icons/filter-lines.svg';
  calendarIcon: string = 'assets/images/icons/calendar.svg';
  pdfIcon: string = 'assets/images/icons/pdf.svg';
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; 

  constructor(private router: Router,private pdfService: CreatePDFService,private userData: userData,) {
   
  }
  searchValue :string="";
   // totalNoOfData :any=[];
  vins:[] =[]; 
  selectAll = false;
  isLoading: boolean = false;
  //selectedVins: string[] = [];
  selectedVins: { vin: string; alertDate: string }[] = [];
  checkAll:any=null;
  currentPage = 1;
  displayedColumns: string[] = ['vin', 'year', 'make', 'alertDate','state','details'];




  @Input() tableData :any[]=[];
  @Input() page :number=0;
  @Input() totalPages :number=0;
  @Input() tableName : string ="";
  @Input() totalItems : number =0;

  @Output() handelPaginagtion = new EventEmitter <any>();
  @Output() handelSearch = new EventEmitter <any>();
 searchHideShow :boolean =false;

 ngAfterViewInit() {
   
   this.paginator.page.subscribe(() =>{
    this.handelPaginagtion.emit(this.paginator.pageIndex + 1);
    this.getValifExist();
   });
  // this.sort.sortChange.subscribe(() => {
  //   this.paginator.pageIndex = 0;
    
  // });
}



onClick(pages:any){
   this.handelPaginagtion.emit(pages);
   this.getValifExist();
   this.selectedVins = [];
} 


redirectToOtherPage(vin:string,model:string) {
  const data = { vin: vin, model: model }; // Data to send
  this.router.navigateByUrl('/user-summary-list', { state: data });
}

getSearchVal(){
  if(this.searchValue==""){
    this.searchHideShow = !this.searchHideShow;
   
  }else{
    this.handelSearch.emit(this.searchValue);
    this.handelPaginagtion.emit(1);
  }  
}
getValifExist(){
  if(this.searchValue!=""){
    this.handelSearch.emit(this.searchValue);
  }
}
onType(value: string){
  if(value==""){
    this.handelSearch.emit(value);
    //this.searchHideShow = !this.searchHideShow;
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
  this.currentPage = page;
  this.onClick(page);
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.onClick(this.currentPage);
  }
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.onClick(this.currentPage);
  }
}



}
