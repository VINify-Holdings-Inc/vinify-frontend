import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-summary-inner',
  imports: [],
  templateUrl: './summary-inner.component.html',
  styleUrl: './summary-inner.component.css'
})
export class SummaryInnerComponent implements AfterViewInit {
   
  ngAfterViewInit(): void {
    let tooltipElements = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipElements.forEach((tooltipElem) => {
      new bootstrap.Tooltip(tooltipElem);
    });
  }


  searchValue :string="";
    
    @Input() tableData :any[]=[];
    @Input() page :number=0;
    @Input() totalPages :number=0;
  
    @Output() handelPaginagtion = new EventEmitter <any>();
    @Output() handelSearch = new EventEmitter <any>();
   searchHideShow :boolean =false;
  
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
