import { Component, Input,Output,EventEmitter } from '@angular/core';
import { RouterLink,Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';



@Component({
  selector: 'app-user-table',
  imports: [FormsModule,CommonModule,DateFormatPipe],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {
  filerIcon: string = 'assets/images/icons/filter-lines.svg';
  calendarIcon: string = 'assets/images/icons/calendar.svg';
  pdfIcon: string = 'assets/images/icons/pdf.svg';
  constructor(private router: Router, ) {}
  searchValue :string="";
  
  @Input() tableData :any[]=[];
  @Input() page :number=0;
  @Input() totalPages :number=0;
  @Input() tableName : string ="";

  @Output() handelPaginagtion = new EventEmitter <any>();
  @Output() handelSearch = new EventEmitter <any>();
 searchHideShow :boolean =false;

onClick(pages:any){
   this.handelPaginagtion.emit(pages);
   this.getValifExist();
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
      this.router.navigate(['/title-details'], { queryParams: { vin: vin,model:model, refresh: timestamp }}).then(() => {
      // You can trigger additional actions after navigation
      //console.log('Navigation complete');
    });
  
}




}
