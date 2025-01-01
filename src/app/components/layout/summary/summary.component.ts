import { Component, OnInit  } from '@angular/core';
import { SummaryTitleComponent } from "./summary-title/summary-title.component";
import { SummaryInnerComponent } from "./summary-inner/summary-inner.component";
import { SummaryAdditionalComponent } from './summary-additional/summary-additional.component';
import { Router,ActivatedRoute } from '@angular/router';
import { userData } from '../../../services/api-service.service';
import { LoaderComponent } from '../common/loader/loader.component';
import { SessionService } from '../../../services/session.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-summary',
  imports: [SummaryTitleComponent, SummaryInnerComponent,SummaryAdditionalComponent,LoaderComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit {
  receivedData: any;
  vin:string="";
  model:string="";
 


  constructor(private router: Router ,private route : ActivatedRoute,private userData : userData,
    private sessionService: SessionService,) {}
    member :string="";
    ngOnInit() {
      this.member  = this.sessionService.getSessionData("memberId")
      
      /*
      this.receivedData = history.state; // Retrieve the state data
      this.vin=this.receivedData?.vin;
      this.model=this.receivedData?.model;
      this.getTableData(this.vin);
      */

      this.route.queryParams.subscribe((params) => {
        this.vin = params['vin'] || '';
        this.model=params['model'] || '';
       // console.log('Query Params Changed: ', this.vin);
        if (this.vin) {
          this.getTableData(this.vin);
        }
      });
    }

 
  
  limit :number=10;
  page : number =1;
  totalPages : number=0;
  status : string="current";
  tableData :any[]=[];

  isLoading : boolean=false;

  getTableData(vin:any){
    
    this.isLoading= true;
     let url = `vin=${vin}&page=${this.page}&limit=${this.limit}&member=${(this.member)}`;
    // if(vin){
    //   url = url+`&vin=${(vin)}`
    //  }
     
    this.userData.searchVinDataForUser(url).subscribe(
      (res:any) => {
          this.isLoading=false; 
        if(!res.error){
          this.tableData=res?.data?.items||[];
          this.totalPages= res?.data?.totalPages||0;
        }else{
          Swal.fire({
                  title: 'Error!',
                  text: res.message,
                  icon: 'error',
                  confirmButtonText: 'OK',
                })
        }
       
      },
      (err) => {
        this.isLoading=false;
      }
    );
  }

 

   handlePageChange(newPage:any){
    this.page = newPage ;
    this.getTableData(this.vin);
};
handelSearch(searchVal:any){
  this.getTableData(searchVal);
}

 




}


