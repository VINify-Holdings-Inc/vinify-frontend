import { Component, AfterViewInit, OnInit } from '@angular/core';
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

  constructor(private userData: userData,
    private sessionService: SessionService,) {

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
    this.getTableData();
    this.getKPIData();

  }

  limit: number = 10;
  page: number = 1;
  totalPages: number = 0;
  status: string = "current";
  tableData: any[] = [];
  totalItems:any=0;
  tableName:string = "Summary VIN List & Alert Records"; 
  isLoading: boolean = false;

  getTableData(vin = null) {

    this.isLoading = true;
    // const url = `page=${this.page}&limit=${this.limit}&status=${encodeURIComponent(JSON.stringify(this.status))}&member=${encodeURIComponent(JSON.stringify(this.member))}`;
    let url = `page=${this.page}&limit=${this.limit}`;
    if (vin) {
      url = url + `&vin=${(vin)}`
    }

    this.userData.getCurrentVinDataForUser(url).subscribe(
      (res: any) => {

        if (!res.error) {
          this.tableData = res?.data?.items || [];
          this.totalPages = res?.data?.totalPages || 0;
         // this.totalItems = res?.data?.totalItems || 0;
        }
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }



  handlePageChange(newPage: any) {
    this.page = newPage;
    this.getTableData();
  };
  handelSearch(searchVal: any) {
    this.getTableData(searchVal);
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
          this.totalItems = res?.data?.uniqueVinCount || [];
          }
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

}
