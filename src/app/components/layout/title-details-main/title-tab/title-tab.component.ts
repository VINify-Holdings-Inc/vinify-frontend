import {  Component, AfterViewInit, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-title-tab',
  imports: [CommonModule],
  templateUrl: './title-tab.component.html',
  styleUrl: './title-tab.component.css'
})
export class TitleTabComponent implements OnInit{
    filerIcon: string = 'assets/images/icons/filter-lines.svg';
    calendarIcon: string = 'assets/images/icons/calendar.svg';
    pdfIcon: string = 'assets/images/icons/pdf.svg';


        totalRecords:any=0;
        searchValue :string="";
        
        @Input() tableData :any[]=[];
        @Input() page :number=0;
        @Input() totalPages :number=0;
        @Input() totalData :number=0
      
        @Output() handelPaginagtion = new EventEmitter <any>();
        @Output() handelSearch = new EventEmitter <any>();
       searchHideShow :boolean =false;
        
       ngOnInit() {
        this.totalRecords=this.tableData;
        }

      onClick(pages:any){
         this.handelPaginagtion.emit(pages);
      } 
      
       
      getSearchVal(){
        if(this.searchValue==""){
          this.searchHideShow = !this.searchHideShow;
        }else{
          this.handelSearch.emit(this.searchValue);
        }
        
        
      }
      onType(value: string){
        if(value==""){
          this.handelSearch.emit(value);
          //this.searchHideShow = !this.searchHideShow;
        }
      }



}
