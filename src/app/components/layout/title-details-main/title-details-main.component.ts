import { Component } from '@angular/core';
import {TitleTabComponent} from './title-tab/title-tab.component'
import { Router,ActivatedRoute } from '@angular/router';
import { userData } from '../../../services/api-service.service';
import { LoaderComponent } from '../common/loader/loader.component';
import { SessionService } from '../../../services/session.service';
import Swal from 'sweetalert2';
import { TitleComparisonComponent } from './title-comparison/title-comparison.component';
import { DateFormatPipe } from '../../../pipes/date-format.pipe';

@Component({
  selector: 'app-title-details-main',
  imports: [TitleTabComponent,TitleComparisonComponent,LoaderComponent,DateFormatPipe],
  templateUrl: './title-details-main.component.html',
  styleUrl: './title-details-main.component.css'
})
export class TitleDetailsMainComponent {
  receivedData: any;
  paramVin:string="";
  preserveVin:string="";
  model:string="";
  isRead:any=null;
  titleChange:any=0;
  lastTitleChangeUpdated :any="2024-05-24";
  customChange:any=0;
  impoundChange:any=0;
  theftChange:any=0;
  alertType:any=null;
  constructor(private router: Router ,private route : ActivatedRoute,private userData : userData,
    private sessionService: SessionService,) {}

 member :string="";
    ngOnInit() {
      this.member  = this.sessionService.getSessionData("memberId")
     
      this.route.queryParams.subscribe((params) => {
        this.paramVin = params['vin'] || '';
        this.preserveVin = params['vin'] || '';
        this.model=params['model'] || '';
        if (this.paramVin) {
          this.getTableData(this.paramVin);
        }
      });
    }
  
     
  limit :number=8;
  page : number =1;
  totalPages : number=0;
  status : string="current";
  tableData :any[]=[];
  totalData :number = 0;
  isLoading : boolean=false;
  selectedVinsData:any[]=[] ; 
  getTableData(vin:any=null){
    
    this.isLoading= true;
     let url = `page=${this.page}&limit=${this.limit}`;
     if(vin){
      url=url+`&vin=${vin}&oldVin=${this.paramVin}`
    }else{
       url=url+`&vin=${this.preserveVin}&oldVin=${this.paramVin}`
    }  
     if(this.isRead!=null){
      url = url + `&isRead=${(this.isRead)}`
    } 
    if(this.alertType!=null){
      url = url + `&alertType=${(this.alertType)}`
    }

     this.userData.searchVinDataForUser(url).subscribe(
      (res:any) => {
          this.isLoading=false; 
        if(!res.error){
          this.tableData=res?.data?.items||[];
          this.totalPages= res?.data?.totalPages||0;
          this.totalData= res?.data?.totalItems||0;
          this.paramVin=res?.data?.items[0].vin;
          this.model=res?.data?.items[0].model;
          this.titleChange = res?.data?.titletitleChangeCount;
          this.lastTitleChangeUpdated = res?.data?.titletitleChangeLastUpdated;
        }else{
          this.tableData=res?.data?.items||[];
          this.totalPages= res?.data?.totalPages||0;
          this.totalData= res?.data?.totalItems||0;
          this.paramVin=res?.data?.items[0].vin||"";
          this.model=res?.data?.items[0].model||"";
          this.titleChange =0;
          this.lastTitleChangeUpdated="2024-05-24";
        }
        

      },
      (err) => {
        this.isLoading=false;
      }
    );
  }

   handlePageChange(newPage:any){
    this.page = newPage.page ;
     if(newPage.search==""){
      this.getTableData(this.paramVin);
     }else{
      this.getTableData(newPage.search);
     }
    
    }
  handelSearch(searchVal:any){
    this.getTableData(searchVal);
   }

   handelAlertFil(data:any){
    this.isRead=data.data;
    this.page=data.page; 
    this.getTableData(this.paramVin);
}
// handelTitleChange(data:any){
//   this.titleChange=data.totalRecord;
//   this.lastTitleChangeUpdated=data.lastUpdate;
// }

handelSelectedVin(data:any){
      this.selectedVinsData=data;
 }
 handelAlertTypeFilter(data:any){
  this.alertType=data.data;
  this.page=data.page; 
  this.getTableData(this.paramVin);
}

}
