import { Component, Input,Output,EventEmitter } from '@angular/core';
import { RouterLink,Router } from '@angular/router';



@Component({
  selector: 'app-user-table',
  imports: [],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {
  constructor(private router: Router, 
              
            ) {}

  
  @Input() tableData :any[]=[];
  @Input() page :number=0;
  @Input() totalPages :number=0;

@Output() handelPaginagtion = new EventEmitter <any>();

onClick(pages:any){
 // console.log("hfhf",pages);
  this.handelPaginagtion.emit(pages);
} 

redirectToOtherPage(vin:string,model:string) {
  const data = { vin: vin, model: model }; // Data to send
  this.router.navigateByUrl('/user-summary-list', { state: data });
}




}
