import { Component, Input,Output,EventEmitter } from '@angular/core';
import { RouterLink,Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-user-table',
  imports: [FormsModule,CommonModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {
  constructor(private router: Router, 
              
            ) {
             
            }
  searchValue :string="";
  
  @Input() tableData :any[]=[];
  @Input() page :number=0;
  @Input() totalPages :number=0;

  @Output() handelPaginagtion = new EventEmitter <any>();
  @Output() handelSearch = new EventEmitter <any>();
 searchHideShow :boolean =false;

onClick(pages:any){
  //console.log(this.totalPages);
 // console.log("hfhf",pages);
  this.handelPaginagtion.emit(pages);
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
  }
  
  
}
onType(value: string){
 // console.log(value);
  if(value==""){
    this.handelSearch.emit(value);
    //this.searchHideShow = !this.searchHideShow;
  }
}



}
