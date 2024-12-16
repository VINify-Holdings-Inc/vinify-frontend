import { Component, AfterViewInit,OnInit } from '@angular/core';
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
  standalone:true,
  imports: [BarChartComponent,LineChartComponent,PieChartComponent,UserTableComponent,CommonModule,LoaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit,OnInit {

  constructor(private userData : userData,
             private sessionService: SessionService,){}


  ngAfterViewInit(): void {
    let tooltipElements = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipElements.forEach((tooltipElem) => {
      new bootstrap.Tooltip(tooltipElem);
    });
  }
  member :string="";
  ngOnInit(): void {
    this.member  = this.sessionService.getSessionData("memberId")
    this.getTableData();
    
  }

  limit :number=5;
  page : number =1;
  totalPages : number=0;
  status : string="current";
  tableData :any[]=[];

  isLoading : boolean=false;

  getTableData(){
    this.isLoading= true;
    const url = `page=${this.page}&limit=${this.limit}&status=${encodeURIComponent(JSON.stringify(this.status))}&member=${encodeURIComponent(JSON.stringify(this.member))}`;
    this.userData.getCurrentVinDataForUser(url).subscribe(
      (res:any) => {
         //  console.log(res)   
        if(!res.error){
          this.tableData=res?.items;
          this.totalPages=res.totalPages;
        }
        this.isLoading=false;
      },
      (err) => {
      //  console.error('failed:', err);
        this.isLoading=false;
      }
    );
  }

 

   handlePageChange(newPage:any){
   // console.log(newPage);
    this.page = newPage ;
    this.getTableData();
};

  isChartSelected : string ="line";
  changeChart (x:string) {
    this.isChartSelected=x;
  }

}
