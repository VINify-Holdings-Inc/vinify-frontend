import { Component } from '@angular/core';
import {TitleTabComponent} from './title-tab/title-tab.component'
import { Router,ActivatedRoute } from '@angular/router';
import { userData } from '../../../services/api-service.service';
import { LoaderComponent } from '../common/loader/loader.component';
import { SessionService } from '../../../services/session.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-title-details-main',
  imports: [TitleTabComponent,LoaderComponent],
  templateUrl: './title-details-main.component.html',
  styleUrl: './title-details-main.component.css'
})
export class TitleDetailsMainComponent {
  receivedData: any;
  vin:string="";
  model:string="";
 
  constructor(private router: Router ,private route : ActivatedRoute,private userData : userData,
    private sessionService: SessionService,) {}

 member :string="";
    ngOnInit() {
      this.member  = this.sessionService.getSessionData("memberId")
     
      this.route.queryParams.subscribe((params) => {
        this.vin = params['vin'] || '';
        this.model=params['model'] || '';
       // console.log('Query Params Changed: ', this.vin);
        if (this.vin) {
          this.getTableData(this.vin);
        }
      });
       //  this.initializeTabs();
    }
   /*
    initializeTabs() {
      // Wait for DOM content to load before querying elements
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab'); // e.g., ?tab=detailsTab
      const targetTab = tabParam || window.location.hash.substring(1); // Fallback to hash
  
      if (targetTab) {
        const tabTrigger = document.querySelector(`[data-bs-target="#${targetTab}"]`);
        if (tabTrigger) {
          // Use Bootstrap's Tab API to show the target tab
          const tab = new (window as any).bootstrap.Tab(tabTrigger);
          tab.show();
        }
      }
    }   */
     
  limit :number=10;
  page : number =1;
  totalPages : number=0;
  status : string="current";
  tableData :any[]=[];

  isLoading : boolean=false;

  getTableData(vin:any){
    
    this.isLoading= true;
     let url = `vin=${vin}&page=${this.page}&limit=${this.limit}&member=${(this.member)}`;
        
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
