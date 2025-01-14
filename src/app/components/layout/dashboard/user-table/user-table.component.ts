import { Component, Input,Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';
import { CreatePDFService } from '../../../../services/create-pdf.service';
import { PDF_SETTINGS } from '../../../../constants';
import { userData } from '../../../../services/api-service.service';
import { LoaderComponent } from '../../common/loader/loader.component';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-user-table',
  imports: [FormsModule,CommonModule,DateFormatPipe,LoaderComponent],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {
  filerIcon: string = 'assets/images/icons/filter-lines.svg';
  calendarIcon: string = 'assets/images/icons/calendar.svg';
  pdfIcon: string = 'assets/images/icons/pdf.svg';

  constructor(private router: Router,private pdfService: CreatePDFService,private userData: userData,) {
   
  }
  searchValue :string="";
  
  @Input() tableData :any[]=[];
  @Input() page :number=0;
  @Input() totalPages :number=0;
  @Input() tableName : string ="";

  @Output() handelPaginagtion = new EventEmitter <any>();
  @Output() handelSearch = new EventEmitter <any>();
 searchHideShow :boolean =false;

onClick(pages:any){
   this.handelPaginagtion.emit(pages);
   this.getValifExist();
} 
 // totalNoOfData :any=[];
vins:[] =[]; 
selectAll = false;
isLoading: boolean = false;
//selectedVins: string[] = [];
selectedVins: { vin: string; model: string }[] = [];
checkAll:any=null;

toggleSelectAll() {
  //console.log("testing data");
  // Toggle the selectAll state
  //this.selectAll = !this.selectAll;

  // Update the selected state for all rows in tableData
  this.tableData.forEach((item) => (item.selected = this.selectAll));

  // If selectAll is true, add all VINs to selectedVins; otherwise, clear it
  this.selectedVins = this.selectAll
    ? this.tableData.map((item) => item.vin)
    : [];
    this.checkAll = this.selectAll ? 'all' : null;
}

updateSelectAll() {
  // Update the selectedVins array based on selected rows
  this.selectedVins = this.tableData
    .filter((item) => item.selected)
    .map((item) => item.vin);

  // Update the "Select All" state based on the selected rows
  this.selectAll = this.selectedVins.length === this.tableData.length;
}
/*
onCheckboxChange(item: any) {
  // Update the selected state of the row
  if (item.selected) {
    this.selectedVins.push(item.vin);
  } else {
    const index = this.selectedVins.indexOf(item.vin);
    if (index > -1) {
      this.selectedVins.splice(index, 1);
    }
  }
  this.selectAll = this.selectedVins.length === this.tableData.length;
  this.checkAll = this.selectAll ? 'all' : null;
} */

  onCheckboxChange(item: any) {
    // Check if the item is selected
    if (item.selected) {
      // Add the object to the selectedVins array
      this.selectedVins.push({ vin: item.vin, model: item.model });
    } else {
      // Remove the object from the selectedVins array
      const index = this.selectedVins.findIndex(
        (vinObj) => vinObj.vin === item.vin && vinObj.model === item.model
      );
      if (index > -1) {
        this.selectedVins.splice(index, 1);
      }
    }
  
    // Update the "Select All" state based on individual selections
    this.selectAll = this.selectedVins.length === this.tableData.length;
  
    // Update checkAll state if needed
    this.checkAll = this.selectAll ? 'all' : null;
  }
  


redirectToOtherPage(vin:string,model:string) {
  const data = { vin: vin, model: model }; // Data to send
  this.router.navigateByUrl('/user-summary-list', { state: data });
}

getSearchVal(){
  if(this.searchValue==""){
    this.searchHideShow = !this.searchHideShow;
   
  }else{
    this.handelSearch.emit(this.searchValue);
    this.handelPaginagtion.emit(1);
  }  
}
getValifExist(){
  if(this.searchValue!=""){
    this.handelSearch.emit(this.searchValue);
  }
}
onType(value: string){
  if(value==""){
    this.handelSearch.emit(value);
    //this.searchHideShow = !this.searchHideShow;
  }
}
getVinDetails(vin:any,model:any){
 
    const timestamp = new Date().getTime(); 
      this.router.navigate(['/title-details'], { queryParams: { vin: vin,model:model, refresh: timestamp }}).then(() => {
      // You can trigger additional actions after navigation
      //console.log('Navigation complete');
    });
  
}

exportToPDF(type:any) {
  console.log("this.checkAll",this.checkAll);
  if(type=='single'&& this.checkAll=='all'){
    this.getTableData('all');
  }else{
    this.getTableData(type);
  }    
 
 
}


getTableData(dataType:any) {
  this.isLoading = true;
  let url = `type=${dataType}`;
  if(dataType=="single"){
     if(this.selectedVins.length==0){
       this.isLoading = false;
                 Swal.fire({
                   title: 'Error!',
                   text: 'Please select VINS ',
                   icon: 'error',
                   confirmButtonText: 'OK',
                 });
     
     } 
   
  }

  this.userData.getPdfData(url,this.selectedVins).subscribe(
    (res: any) => {
      if (!res.error) {
        //this.totalNoOfData = res?.data?.items || [];
        this.pdfService.generatePDF(
          PDF_SETTINGS.COMPANY_NAME,
          PDF_SETTINGS.LOGO_URL,
          res?.data?.items || [],
          'Vin-data.pdf'
        );
      }
      this.isLoading = false;
    },
    (err) => {
      this.isLoading = false;
    }
  );
}


}
