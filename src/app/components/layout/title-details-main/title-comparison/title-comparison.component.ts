import { Component,OnInit, } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { userData } from '../../../../services/api-service.service';
import { LoaderComponent } from '../../common/loader/loader.component';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-title-comparison',
  imports: [LoaderComponent,DateFormatPipe,CommonModule],
  templateUrl: './title-comparison.component.html',
  styleUrl: './title-comparison.component.css'
})
export class TitleComparisonComponent implements OnInit {
  constructor(private userData:userData,private route : ActivatedRoute){}
  limit :number=8;
  page : number =1;
  totalPages : number=0;
  tableDataHistory :any[]=[];
  totalDataHistory :number = 0;
  tableDataCurrent :any[]=[];
  totalDataCurrent :number = 0;
  isLoading : boolean=false;
  paramVin:string="";

  ngOnInit() {
    console.log("test");
   
    this.route.queryParams.subscribe((params) => {
      this.paramVin = params['vin'] || '';
   
      
      console.log('Query Params Changed: ', this.paramVin);
      if (this.paramVin) {
        this.getTableData(this.paramVin);
      }
    });
     //  this.initializeTabs();
  }

  getTableData(vin:any=null){
    
    this.isLoading= true;
   
      let url=`vin=${vin}`
   
     // url = `&page=${this.page}&limit=${this.limit}`;
     
   
     this.userData.getVinHistoryData(url).subscribe(
      (res:any) => {
        console.log("datatitle",res?.data);
          this.isLoading=false; 
        if(!res.error){
          this.tableDataHistory=res?.data?.history?.items||[];
          this.totalDataHistory= res?.data?.history?.totalRecords||0;

          this.tableDataCurrent=res?.data?.current?.items||[];
          this.totalDataCurrent= res?.data?.current?.totalRecords||0;
         
        }     

      },
      (err) => {
        this.isLoading=false;
      }
    );
  }
}
