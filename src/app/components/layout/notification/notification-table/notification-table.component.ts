import {  Component, AfterViewInit, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';

import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-notification-table',
  imports:  [CommonModule,DateFormatPipe,FormsModule,MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './notification-table.component.html',
  styleUrl: './notification-table.component.css'
})


export class NotificationTableComponent implements OnInit{
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
        @Input() totalItems : number =0;
        @Output() handelPaginagtion = new EventEmitter <any>();
        @Output() handelSearch = new EventEmitter <any>();
        @Output() handelAlertFil = new EventEmitter <any>();
        alert:any=null;
        
       currentPage: number = 1; // Current active page
       visiblePages: number[] = []; // Pages to display in the pagination UI
       maxVisiblePages: number = 4; // Max number of pages to display at once
     
       displayedColumns: string[] = ['vin', 'year', 'make', 'titleBrandDate','state','details'];//[ 'titleBrandDate', 'vin','year', 'make', 'state','detailsData', 'details'];

       ngOnChanges(changes: SimpleChanges) {
         if (changes['totalPages']) {
           this.updateVisiblePages();  // Trigger pagination update when totalPages changes
         }
        }

       ngOnInit() {
       // console.log(this.tableData);
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
   alertFilter(data:any){
    this.handelAlertFil.emit(data);
   } 

}
