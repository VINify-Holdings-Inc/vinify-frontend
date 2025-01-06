import { Component, AfterViewInit } from '@angular/core';
 
import { userData } from '../../../services/api-service.service';
import { LoaderComponent } from '../common/loader/loader.component';
import { SessionService, } from '../../../services/session.service';
declare var bootstrap: any;
import { CommonModule } from '@angular/common';
import { UserTableComponent } from '../dashboard/user-table/user-table.component';
@Component({
  selector: 'app-vehicle',
  imports: [CommonModule,UserTableComponent,LoaderComponent],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css'
})
export class VehicleComponent implements AfterViewInit{
  ngAfterViewInit(): void {
    let tooltipElements = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipElements.forEach((tooltipElem) => {
      new bootstrap.Tooltip(tooltipElem);
    });
  }
  constructor(private userData: userData,
    private sessionService: SessionService,) {

  }

  
  member: string = "";
  ngOnInit(): void {
    this.member = this.sessionService.getSessionData("memberId")
    this.getTableData();

  }

  limit: number = 10;
  page: number = 1;
  totalPages: number = 0;
  status: string = "current";
  tableData: any[] = [];
  totalItems:any="";
  tableName:string = "Summary VIN"; 
  isLoading: boolean = false;

  getTableData(vin = null) {

    this.isLoading = true;
    let url = `page=${this.page}&limit=${this.limit}&member=${(this.member)}`;
    if (vin) {
      url = url + `&vin=${(vin)}`
    }

    this.userData.getCurrentVinDataForUser(url).subscribe(
      (res: any) => {

        if (!res.error) {
          this.tableData = res?.data?.items || [];
          this.totalPages = res?.data?.totalPages || 0;
          this.totalItems = res?.data?.totalItems || 0;
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
}
