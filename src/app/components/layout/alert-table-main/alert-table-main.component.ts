import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userData } from '../../../services/api-service.service';
import { LoaderComponent } from '../common/loader/loader.component';
import { AlertTableComponent } from './alert-table/alert-table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert-table-main',
  imports: [AlertTableComponent,LoaderComponent],
  templateUrl: './alert-table-main.component.html',
  styleUrl: './alert-table-main.component.css'
})
export class AlertTableMainComponent {
  constructor(private userData: userData,private router: Router) {}

  vin :string= "";
  limit: number = 14;
  page: number = 1;
  totalPages: number = 0;
  status: string = "current";
  tableData: any[] = [];
  totalItems:any=0;
  updatedTotalItems:any=0;
  totalItemsKpi:any=0;
  tableName:string = "New Alerts"; 
  isLoading: boolean = false;
  isRead:any=null;
  selectedVinsData:any[]=[] ;

  ngOnInit(): void {
   
    this.getTableData();
   
  }
  getTableData(vin:any=null) {
  
    this.tableData=[];
    this.isLoading = true;
    let url = `page=${this.page}&limit=${this.limit}`;
    if (this.vin) {
      url = url + `&vin=${(this.vin)}`
    }
    if(this.isRead!=null){
      url = url + `&isRead=${(this.isRead)}`
    }
   
     
    this.userData.getNewAlertData(url).subscribe(
      (res: any) => {
        if (res.code === 401) { 
          sessionStorage.clear();
          this.router.navigate(['/']);
        }
        if (!res.error) {
          this.tableData = res?.data?.items || [];
          this.totalPages = res?.data?.totalPages || 0;
          this.totalItems = res?.data?.totalRecords || 0;
        }
        this.isLoading = false;
      },
      (err) => {
       
        this.isLoading = false;
      }
    );
  
  }
  handlePageChange(newPage: any) {
    this.page = newPage.page;
    if(newPage.search=="" ||newPage.search==null){
      this.getTableData();
    }else{
      this.getTableData(newPage.search);
    }
  };
  handelSearch(searchVal: any) {
    this.vin=searchVal;
    if(searchVal=="" ||searchVal==null){
      this.isRead=null;
      this.getTableData();
    }else{
      this.getTableData(searchVal);
    }
  }
  handelAlertFil(data:any){
     this.vin="";
      this.isRead=data.data;
      this.page=data.page;
      this.getTableData();
  }
  handelSelectedVin(data:any){
    this.selectedVinsData=data;
  }
}
