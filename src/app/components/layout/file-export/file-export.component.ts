import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userData } from '../../../services/api-service.service';
import { LoaderComponent } from '../common/loader/loader.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { FileDownloadService } from '../../../services/file-download.service';

@Component({
  selector: 'app-file-export',
  imports: [CommonModule, MatTableModule, FormsModule, MatCheckboxModule,LoaderComponent],
  templateUrl: './file-export.component.html',
  styleUrl: './file-export.component.css'
})
export class FileExportComponent  implements OnInit {
  constructor(private userData: userData,private elementRef: ElementRef,private fileService: FileDownloadService) {}
  isModalOpen = true;
  tableData: any[] = [];
  isLoading: boolean = false;
  vin: any = '';
  limit = 1000000;
  page = 1;
  checkall:any="single";
  selectedVins: any[] = [];
  displayedColumns: string[] = ['select', 'vin'];
  searchValue :string="";
  ngOnInit() {
    this.getTableData();
  }

  getTableData(vin: any = null) {
    this.isLoading = true;
    let url = `page=${this.page}&limit=${this.limit}`;
    if (this.vin) {
      url = url + `&vin=${this.vin}`;
    }
    this.userData.getVinData(url).subscribe(
      (res: any) => {
        if (!res.error) {
          const data = res?.data || [];
          // Add isSelected property to each row for checkbox
          data.forEach((item: any) => (item.isSelected = false));
          this.tableData = (data);
        }
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.checked;
    if(isChecked){
    this.tableData.forEach((row) => {
      row.isSelected = isChecked;
      this.selectedVins.push({"vin":row.vin});
    });
  }else{
    this.tableData.forEach((row) => {
      row.isSelected = false;
    
    })
    this.selectedVins=[];
  }
    if(isChecked){
      this.checkall='all';
      //this.selectedVins=[]
    }else{
      this.checkall='single';
    }
  }


  

  onRowSelectionChange(item: any): void {
    if (item.isSelected) {
      // Add the selected item to the array
      const vinExists = this.selectedVins.some(
        (selected) =>
          selected.vin === item.vin 
      );
  
      if (!vinExists) {
        this.selectedVins.push({
          vin: item.vin
        });
      }
    } else {
      // Remove the item from the array
      this.selectedVins = this.selectedVins.filter(
        (selected) =>
          selected.vin !== item.vin
      );
    }
    this.checkall='single';
  }

  isAllSelected(): boolean {
    return this.tableData.every((row) => row.isSelected);
  }

  isIndeterminate(): boolean {
    const selected = this.tableData.filter((row) => row.isSelected).length;
    return selected > 0 && selected < this.tableData.length;
  }

getPDFData() {
  this.isLoading = true;
 
  if(this.checkall=="single"){
     if(this.selectedVins.length==0){
       this.isLoading = false;
                 Swal.fire({
                  title: 'Info!',
                  showClass: {
                    popup: 'animated fadeInDown faster',
                    icon: 'animated heartBeat delay-1s'
                  },
                   text: 'Please select VINs',
                   icon: 'info',
                   confirmButtonText: 'OK',
                 });
                 return;
     }   
   
  }
  if (this.searchValue.trim() !== '') {
    if(this.selectedVins.length==0){
      return;
    }
  }
  console.log("data",this.selectedVins)
  
  this.fileService.downloadFile(this.selectedVins);
     
      this.isLoading = false;
   
}

closeData(){
  this.checkall="single";
  this.selectedVins = [];
}
getSearchVal(){
  this.checkall='single';     
  this.tableData.forEach((row) => {
    row.isSelected = false;
    this.selectedVins=[];
  });

  if(this.searchValue==""){
    this.searchValue="";
    this.vin="";
   
  }else{
    if(this.searchValue.trim().length === 0){
      this.searchValue="";
    }else{
      this.handelSearch(this.searchValue.trim());
    }
  }
}

onType(value: string){
  if(value==""){
    this.selectedVins=[];
    this.handelSearch(value.trim());
    
  }
}
handelSearch(vin:any){
  this.vin=vin
  this.getTableData()
}
clearAll(){
  this.vin="";
  this.selectedVins=[];
  this.searchValue="";
  this.checkall="single";
  this.getTableDataAfetrClose();

}


handleOutsideClick() {
   this.isModalOpen = false; // Close the modal
   this.clearAll();
}

// Listen for clicks on the document
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  const clickedInside = this.elementRef.nativeElement.contains(event.target);
  if (!clickedInside) {
    this.handleOutsideClick();
  }
}

// Example function to open the modal
openModal(): void {
  this.isModalOpen = true;
}

getTableDataAfetrClose(vin: any = null) {
  let url = `page=${this.page}&limit=${this.limit}`;
  if (this.vin) {
    url = url + `&vin=${this.vin}`;
  }
  this.userData.getVinData(url).subscribe(
    (res: any) => {
      if (!res.error) {
        const data = res?.data || [];
        // Add isSelected property to each row for checkbox
        data.forEach((item: any) => (item.isSelected = false));
        this.tableData = (data);
      }
    },
    (err) => {
    
    }
  );
}

}
