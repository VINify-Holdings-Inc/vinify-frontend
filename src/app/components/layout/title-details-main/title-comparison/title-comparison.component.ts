import { Component,EventEmitter,OnInit, Output, } from '@angular/core';
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
  titleData : any ={};
  brandData :any ={};
  jsiData :any ={};



  @Output() handelTitleChange = new EventEmitter <any>();
  ngOnInit() {
   
    this.route.queryParams.subscribe((params) => {
      this.paramVin = params['vin'] || '';
      if (this.paramVin) {
        this.getTableData(this.paramVin);
      }
    });
  }

  isObjectNotEmpty(obj: any): boolean {
    return obj && Object.keys(obj).length > 0;
  }

  getTableData(vin:any=null){
    
    this.isLoading= true;
      let url=`vin=${vin}`
   
    

     this.userData.getVinHistoryData(url).subscribe(
      (res:any) => {
          this.isLoading=false; 
        if(!res.error){
                     
          this.titleData=res?.data?.title;
          this.brandData=res?.data?.brand;
          this.jsiData=res?.data?.jsi;

          this.handelTitleChange.emit({"totalRecord":res?.data?.totalRecords||0,"lastUpdate":res?.data?.createdAt||""});
        }     

      },
      (err) => {
        this.isLoading=false;
      }
    );
  }
}
