import { Component, AfterViewInit, ViewChild, OnInit,SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { userData } from '../../../../services/api-service.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  imports:[MatTableModule, MatPaginator,MatPaginatorModule, MatSortModule,MatFormFieldModule,MatInputModule,CommonModule]
})
export class DataTableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['vin', 'year', 'make', 'alertDate', 'state', 'details'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = true; // Add a loading indicator if needed

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private userData: userData) {}

  ngOnInit(): void {
    this.getData();
   
  }
 data:any =[];
  

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getVinDetails(vin: string, model: string): void {
    // Add your logic for navigating or performing actions here
  }
  getData (){
   this.userData.getPdfData('all','').subscribe(
      (res: any) => {
        if (!res.error) {
        
           this.dataSource.data = res?.data?.items || [];
           this.data = res?.data?.items || [];
        }
        this.isLoading = false;
        
      },
      (err) => {
        this.isLoading = false;
      }
    );
}
}
