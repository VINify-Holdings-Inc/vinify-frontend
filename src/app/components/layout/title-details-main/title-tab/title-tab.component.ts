import {  Component,  Input, Output, EventEmitter, OnInit, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';

import { MatTableModule } from '@angular/material/table';
import {  MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { userData } from '../../../../services/api-service.service';
import { PDF_SETTINGS } from '../../../../constants';
import { LoaderComponent } from '../../common/loader/loader.component';
import { NotificationService } from '../../../../services/state-management';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CapitalizePipe } from '../../../../pipes/capitalize.pipe';
import { TitleReportService } from '../../../../services/title-report.service';


@Component({
  selector: 'app-title-tab',
  imports: [CommonModule,DateFormatPipe,FormsModule,MatTableModule, MatPaginatorModule, MatSortModule,LoaderComponent,MatCheckboxModule,CapitalizePipe,],
  templateUrl: './title-tab.component.html',
  styleUrl: './title-tab.component.css'
})
export class TitleTabComponent implements OnInit{
  constructor(private userData : userData,private titleReportService:TitleReportService,private notificationService: NotificationService,private changeDetectorRef: ChangeDetectorRef){}
    filerIcon: string = 'assets/images/icons/filter-lines.svg';
    calendarIcon: string = 'assets/images/icons/calendar.svg';
    pdfIcon: string = 'assets/images/icons/pdf.svg';


        totalRecords:any=0;
        searchValue :string="";
        sn : number =0;
        @Input() tableData :any[]=[];
        @Input() page :number=0;
        @Input() totalPages :number=0;
        @Input() totalData :number=0;
        @Input() limit:number=0;
        @Output() handelPaginagtion = new EventEmitter <any>();
        @Output() handelSearch = new EventEmitter <any>();
        @Output() handelAlertFil = new EventEmitter <any>();
        @Input() paramVin:any=""; 
        @Input() selectedVinsData:any[] =[];
        @Output() handelSelectedVin = new EventEmitter <any>();      
        @Output() handelAlertTypeFilter = new EventEmitter <any>();      
        checkall:any="specific";
        selectedVins: any[] = []; 
        alert:any=null;
        isLoading:boolean=false;
        isCheckboxEnabled:boolean=false;
       // selectedVins: { vin: string; alertDate: string }[] = [];
        
       currentPage: number = 1; // Current active page
       visiblePages: number[] = []; // Pages to display in the pagination UI
       maxVisiblePages: number = 4; // Max number of pages to display at once
     
      // displayedColumns: string[] = ['Select','status','vin', 'titleBrandDate','alertType','brand','description','export','rptgEntity','city','state','rptgDetails','make','model','modelYear',];
       displayedColumns: string[] = ['Select','status', 'titleBrandDate','alertType','brand','state','city','description','export','rptgEntity','mobile','email'];
        
       ngOnChanges(changes: SimpleChanges) {
         if (changes['totalPages']) {
           this.updateVisiblePages();  // Trigger pagination update when totalPages changes
         }
         this.selectReleventData();
         this.isCheckboxEnabled = this.tableData.some((row: any) => !row.isRead);
        }

       ngOnInit() {
        this.totalRecords=this.tableData;
        this.selectedVins=this.selectedVinsData;
          
        this.tableData.forEach((row: any) => {
          if (this.selectedVinsData.includes(row.id)) {
            row.isSelected = true;
          } 
        });
        this.isCheckboxEnabled = this.tableData.some((row: any) => !row.isRead);
        }

      onClick(pages:any){
         this.handelPaginagtion.emit({"page":pages,"search":this.searchValue.trim()});
         this.sn=(pages-1)*10;
         this.getValifExist();
      } 
      
       
      getSearchVal(){
        if(this.searchValue==""){
          this.searchValue="";
         
        }else{
          if(this.searchValue.trim().length === 0){
            this.searchValue="";
          }else{
            this.handelSearch.emit(this.searchValue.trim());
            this.handelPaginagtion.emit({"page":1,"search":this.searchValue.trim()});
            this.sn=0;
          }
          
        }
      }

      
        getValifExist(){
          if(this.searchValue!=""){
            this.handelSearch.emit(this.searchValue.trim());
          }
        }
      onType(value: string){
        if(value==""){
          this.currentPage=1;
          this.handelSearch.emit(value.trim());
          
        }
      }
      

      

goToPage(page: number) {
  if (page < 1 || page > this.totalPages) return; // Ensure page is within range
  this.currentPage = page;
  this.handelPaginagtion.emit({"page":page,"search":this.searchValue.trim()});
  this.updateVisiblePages();
 
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.goToPage(this.currentPage);
  }
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.goToPage(this.currentPage);
  }
}

    updateVisiblePages() {

      const visible: number[] = [];
        
      const start = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
      const end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);
      //const end = 4;

      for (let i = start; i <= end; i++) {
        visible.push(i);
      }

      if (start > 1) visible.unshift(1); // Ensure first page is visible
      if (start > 2) visible.splice(1, 0, -1); // Add "..." after the first page

      if (end < this.totalPages) visible.push(this.totalPages); // Ensure last page is visible
      if (end < this.totalPages - 1) visible.splice(visible.length - 1, 0, -1); // Add "..." before the last page

      this.visiblePages = visible;
      this.getValifExist();
    
      
    }

    getBrandDetails(data:any){
      if(data !=null )
        Swal.fire({
          title: 'Info!',
          text: data,
          icon: 'info',
          showClass: {
            popup: 'animated fadeInDown faster',
            icon: 'animated heartBeat delay-1s'
          },
          customClass: {
            popup: 'my-custom-swal', // Add your custom class here
            confirmButton: 'my-confirm-button-class' // Example for confirm button styling
          },
          showCancelButton: false,
          confirmButtonText: 'OK',
        });
        
    }
    alertFilter(data:any){
      this.searchValue="";
      this.currentPage=1;
      this.handelAlertFil.emit({"data":data,"page":1});
     }

     exportToPDF(type:any) {
  
      this.getTableData(type);
    }

    getTableData(dataType:any) {
      this.isLoading = true;
      let url = `page=1&limit=10000000&vin=${this.paramVin}`;
         if(dataType!=null){
          url=url+`&isRead=${dataType}`;
         } 
      this.userData.searchVinDataForUser(url).subscribe(
        (res: any) => {
          if (!res.error) {
            this.titleReportService.generatePDF(
              PDF_SETTINGS.COMPANY_NAME,
              PDF_SETTINGS.LOGO_URL,
              res?.data?.items || [],
              'Vin-detail-report.pdf'
            );
          }else{
            Swal.fire({
                        title: 'Error!',
                        showClass: {
                          popup: 'animated fadeInDown faster',
                          icon: 'animated heartBeat delay-1s'
                        },
                        text: "No VIN found",
                        icon: 'error',
                        confirmButtonText: 'OK',
                      });   
          }
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
        }
      );
    }

     selectReleventData(){
      this.selectedVins=this.selectedVinsData;
              
      this.tableData.forEach((row: any) => {
        if (this.selectedVinsData.includes(row.id)) {
          row.isSelected = true;
        }
      });
    }
    
      toggleSelectAll(event: any): void {
        const isChecked = event.checked;
        if(isChecked){
        this.tableData.forEach((row) => {
          if(row?.isRead==false){
            row.isSelected = isChecked;
            this.selectedVins.push(row.id);
          }
        });
       
      }else{
        this.tableData.forEach((row) => {
          row.isSelected = false;
        })
        this.tableData.forEach((row: any) => {
          const index = this.selectedVinsData.indexOf(row.id);
          if (index !== -1) {
            row.isSelected = false;
            this.selectedVinsData.splice(index, 1); // Remove the element from selectedVinsData
          }
        });
       
      }
        
        this.handelSelectedVin.emit(this.selectedVins)
      }
    
    
      onRowSelectionChange(item: any): void {
        if (item.isSelected) {
          // Add the selected item to the array
          const vinExists = this.selectedVins.some(
            
            (selected) =>
              selected === item.id 
          );
      
          if (!vinExists) {
            this.selectedVins.push(item.id);
          }
        } else {
          // Remove the item from the array
          this.selectedVins = this.selectedVins.filter(
            (selected) =>
              selected !== item.id 
          );
        }
        this.checkall='specific';
        this.handelSelectedVin.emit(this.selectedVins);
      }
    
      isAllSelected(): boolean {
       // return this.tableData.every((row) => row.isSelected);
        return this.tableData.length > 0 && this.tableData.every(row => row.isSelected);
      }
    
      isIndeterminate(): boolean {
        const selected = this.tableData.filter((row) => row.isSelected).length;
        return selected > 0 && selected < this.tableData.length;
      }
     
      makeAllRead(){
        if(this.selectedVins.length==0){
              Swal.fire({
                        title: 'Error!',
                        showClass: {
                          popup: 'animated fadeInDown faster',
                          icon: 'animated heartBeat delay-1s'
                        },
                        text: "Select the VIN",
                        icon: 'error',
                        confirmButtonText: 'OK',
                      }); 
              return;
            }else{
                  let type=`type=${this.checkall}`;
                  let datas = this.selectedVins;
              this.userData.updateSeenAlertCheckBxData(type,datas).subscribe(
                (res:any) => {
                    
                if(!res.error){
                  if(res?.data?.updated){  
                  this.notificationService.setUnreadCount(
                    res?.data?.totalNotificationCount||0
                  ); 
                }  }  
               
                this.tableData.forEach(row => row.isSelected = false);
                this.changeDetectorRef.detectChanges();
                this.selectedVins=[]; 
               // this.currentPage=1;
                this.handelSelectedVin.emit([])
                this.handelSearch.emit(this.searchValue.trim());
                },
                (err) => {
                
                }
              );
            
            }
      }

      alertTypeFilter(data:any){
        this.searchValue="";
        this.handelAlertTypeFilter.emit({"data":data,"page":1});
      }

}
