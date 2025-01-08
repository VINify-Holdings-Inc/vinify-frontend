import {  Component, AfterViewInit, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';


@Component({
  selector: 'app-title-tab',
  imports: [CommonModule,DateFormatPipe,FormsModule],
  templateUrl: './title-tab.component.html',
  styleUrl: './title-tab.component.css'
})
export class TitleTabComponent implements OnInit{
    filerIcon: string = 'assets/images/icons/filter-lines.svg';
    calendarIcon: string = 'assets/images/icons/calendar.svg';
    pdfIcon: string = 'assets/images/icons/pdf.svg';


        totalRecords:any=0;
        searchValue :string="";
        sn : number =0;
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
         this.sn=(pages-1)*10;
         this.getValifExist();
      } 
      
       
      getSearchVal(){
        if(this.searchValue==""){
          this.searchHideShow = !this.searchHideShow;
        }else{
          this.handelSearch.emit(this.searchValue);
          this.handelPaginagtion.emit(1);
          this.sn=0;
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



}
