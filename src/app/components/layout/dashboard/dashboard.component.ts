import { Component, AfterViewInit, OnInit, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { RouterLink } from '@angular/router';
import { UserTableComponent } from './user-table/user-table.component';
import { userData } from '../../../services/api-service.service';
import { LoaderComponent } from '../common/loader/loader.component';
import { SessionService } from '../../../services/session.service';

declare var bootstrap: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [UserTableComponent, CommonModule, LoaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit, OnInit {
  arrowIcon: string = 'assets/images/icons/kpi-arrow.svg';
  arrowIcon2: string = 'assets/images/icons/kpi-colorarrow.svg'
  dashboardCardActive:any="total";
  constructor(private userData: userData,
    private sessionService: SessionService,
    private cdr: ChangeDetectorRef) {

  }


  ngAfterViewInit(): void {
    let tooltipElements = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipElements.forEach((tooltipElem) => {
      new bootstrap.Tooltip(tooltipElem);
    });
  }
  member: string = "";
  ngOnInit(): void {
    this.member = this.sessionService.getSessionData("memberId")
    if(this.vin==""){this.getTableData();}
    this.getKPIData();
  }
  vin :string= "";
  limit: number = 9;
  page: number = 1;
  totalPages: number = 0;
  status: string = "current";
  tableData: any[] = [];
  totalItems:any=0;
  updatedTotalItems:any=0;
  totalItemsKpi:any=0;
  tableName:string = "Summary VIN List & Alert Records"; 
  isLoading: boolean = false;
  serchKpiType :any="total";
  resetData:boolean=false;

   
   getTableData(vin = null) {
    console.log("vin",vin);
    this.tableData=[];
    this.isLoading = true;
    // const url = `page=${this.page}&limit=${this.limit}&status=${encodeURIComponent(JSON.stringify(this.status))}&member=${encodeURIComponent(JSON.stringify(this.member))}`;
    let url = `page=${this.page}&limit=${this.limit}`;
    if (this.vin) {
      url = url + `&vin=${(this.vin)}`
    }
   if(this.serchKpiType=='total'){
    this.userData.getCurrentVinData(url).subscribe(
      (res: any) => {

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
    else{
      this.userData.getCurrentUpdatedVinData(url).subscribe(
        (res: any) => {
  
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
  }


  

  handlePageChange(newPage: any) {
    console.log("pagination",newPage);
    this.page = newPage.page;
    if(newPage.search=="" ||newPage.search==null){
      this.getTableData();
    }else{
      this.getTableData(newPage.search);
    }
    
  };
  handelSearch(searchVal: any) {
    console.log("searchVal",searchVal);
    this.vin=searchVal;
    if(searchVal=="" ||searchVal==null){
      this.getTableData();
    }else{
      this.getTableData(searchVal);
    }
    //this.getTableData(searchVal);
  }

  isChartSelected: string = "line";
  changeChart(x: string) {
    this.isChartSelected = x;
  }

  getKPIData() {
    this.isLoading = true;  

    this.userData.getKPIData().subscribe(
      (res: any) => {
        if (!res.error) {
          this.totalItemsKpi = res?.data?.uniqueVinCount || 0;
          this.updatedTotalItems = res?.data?.totalUpdatedData || 0;
          }
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  setKpiData(type:any){
     this.serchKpiType=type;
     this.limit = 9;
     this.page = 1;
     this.totalPages= 0;
     this.getTableData();
     this.resetData =!this.resetData;
     this.cdr.detectChanges();
  }
   
  changeDashboardActiveCard=(paranemtName:any)=>{ 
    this.dashboardCardActive = paranemtName;
  }

}
