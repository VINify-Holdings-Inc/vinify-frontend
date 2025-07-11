import { Component, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserTableComponent } from './user-table/user-table.component';
import { userData } from '../../../services/api-service.service';
import { LoaderComponent } from '../common/loader/loader.component';
import { SessionService } from '../../../services/session.service';
import { DateFormatPipe } from '../../../pipes/date-format.pipe'; 
import { Router } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [UserTableComponent, RouterLink, CommonModule, LoaderComponent, DateFormatPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit, OnInit {
  arrowIcon: string = 'assets/images/icons/kpi-arrow.svg';
  arrowIcon2: string = 'assets/images/icons/kpi-colorarrow.svg'
  dashboardCardActive: any = "total";
  constructor(private userData: userData,
    private sessionService: SessionService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {

  }


  ngAfterViewInit(): void {
    let tooltipElements = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipElements.forEach((tooltipElem) => {
      new bootstrap.Tooltip(tooltipElem);
    });
  }
  member: string = "";
  vin: string = "";
  limit: number = 9;
  page: number = 1;
  totalPages: number = 0;
  status: string = "current";
  tableData: any[] = [];
  totalItems: any = 0;
  updatedTotalItems: any = 0;
  totalItemsKpi: any = 0;
  tableName: string = "Summary VIN List & Alert Records";
  isLoading: boolean = false;
  serchKpiType: any = "total";
  resetData: boolean = false;
  isRead: any = null;
  resentAlert: any = [];
  alertType: any = null;

  ngOnInit(): void {
    this.member = this.sessionService.getSessionData("memberId");
    const navigationKey = sessionStorage.getItem('navigationKeyDashboard');
    // Check if navigationKey is not null/undefined/empty
    if (navigationKey) {
      this.serchKpiType = navigationKey;
      this.dashboardCardActive = (navigationKey === "update") ? "updated" : navigationKey;
      this.getTableData();
      sessionStorage.removeItem('navigationKeyDashboard');
    }
    this.getKPIData();
  }


  getTableData(vin: any = null) {
    this.tableData = [];
    this.isLoading = true;
    let url = `page=${this.page}&limit=${this.limit}`;
    if (this.vin) {
      url = url + `&vin=${(this.vin)}`
    }
    if (this.isRead != null) {
      url = url + `&isRead=${(this.isRead)}`
    }
    if (this.alertType != null) {
      url = url + `&alertType=${(this.alertType)}`
    }
    if (this.serchKpiType == 'total') {
      this.userData.getCurrentVinData(url).subscribe( 
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
    else {
      this.userData.getCurrentUpdatedVinData(url).subscribe(
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
  }




  handlePageChange(newPage: any) {
    this.page = newPage.page;
    if (newPage.search == "" || newPage.search == null) {
      this.getTableData();
    } else {
      this.getTableData(newPage.search);
    }

  };
  handelSearch(searchVal: any) {
    this.vin = searchVal;
    if (searchVal == "" || searchVal == null) {
      this.isRead = null;
      this.getTableData();

    } else {
      this.getTableData(searchVal);
    }
  }

  isChartSelected: string = "line";
  changeChart(x: string) {
    this.isChartSelected = x;
  }

  getKPIData() {
    this.isLoading = true;

    this.userData.getKPIData().subscribe(
      (res: any) => {
        if (res.code === 401) {
          this.isLoading = false;
          sessionStorage.clear();
          this.router.navigate(['/']);
        }
        if (!res.error) {
          this.totalItemsKpi = res?.data?.uniqueVinCount || 0;
          this.updatedTotalItems = res?.data?.totalUpdatedData || 0;
          this.resentAlert = res?.data?.RecentAlert[0] || [];
        }
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  setKpiData(type: any) {
    this.serchKpiType = type;
    this.limit = 9;
    this.page = 1;
    this.totalPages = 0;
    this.vin = "";
    this.isRead = null;
    // this.getTableData();
    this.resetData = !this.resetData;
    this.cdr.detectChanges();
  }

  changeDashboardActiveCard = (paranemtName: any) => {
    this.dashboardCardActive = paranemtName;
    this.alertType=null;
    // alert(this.alertType)
  }
  handelAlertFil(data: any) {
    this.vin = "";
    this.isRead = data;
    this.getTableData();
  }
  handelAlertTypeFilter(data: any) {
    
    this.vin = "";
    this.alertType = data;
    this.page = 1;
    console.log(data);
    
    this.getTableData();
   
  }

}
