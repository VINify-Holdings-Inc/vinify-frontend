import { Component, OnInit,HostListener,ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userData } from '../../../../services/api-service.service';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatCheckboxModule } from '@angular/material/checkbox'; // Import MatCheckboxModule
import Swal from 'sweetalert2';
import {PDF_SETTINGS} from '../../../../constants'
import { CreatePDFService } from '../../../../services/create-pdf.service';
import { LoaderComponent } from '../../common/loader/loader.component';

@Component({
  selector: 'app-single-vin',
  imports: [CommonModule, MatTableModule, FormsModule, MatCheckboxModule,LoaderComponent],
  templateUrl: './single-vin.component.html',
  styleUrls: ['./single-vin.component.css'],
})
export class SingleVinComponent implements OnInit,AfterViewInit {
  constructor(private userData: userData,private pdfService: CreatePDFService,private elementRef: ElementRef) {}
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

  ngAfterViewInit() {
    // Get the modal element using Bootstrap modal API
    const modal = document.getElementById('exampleModal');

    if (modal) {
      // Listen for when the modal is shown
      modal.addEventListener('shown.bs.modal', () => {
     
        this.openModal();
      });

      // Listen for when the modal is hidden
      modal.addEventListener('hidden.bs.modal', () => {
      
        this.clearAll();
      });
    }
  }

  getTableData(vin: any = null) {
    this.isLoading = true;
    let url = '';
    if (this.vin) {
      url = url + `&vin=${this.vin}`;
    }
   //Api call
    this.userData.getVinDataForPDF(url).subscribe(
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
      this.selectedVins.push({"vin":row.vin,"id":row.id});
    });
  }else{
    this.tableData.forEach((row) => {
      row.isSelected = false;
    
    })
    this.selectedVins=[];
  }
    if(isChecked){
      this.checkall='all';
    }else{
      this.checkall='single';
    }
  }

  onRowSelectionChange(item: any): void {
    if (item.isSelected) {
      // Add the selected item to the array
      const vinExists = this.selectedVins.some(
        (selected) =>
          selected.vin === item.vin &&
       
          selected.id === item.id
      );
      if (!vinExists) {
        this.selectedVins.push({
          vin: item.vin,
       
          id:item.id
        });
      }
    } else {
      // Remove the item from the array
      this.selectedVins = this.selectedVins.filter(
        (selected) =>
          selected.vin !== item.vin ||
          selected.id !== item.id 
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
  let url = `type=${this.checkall}`;

  const ids = this.selectedVins.map(item => item.id);

  this.userData.getPdfData(url,ids).subscribe(
    (res: any) => {
      if (!res.error) {
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
  if (!this.isModalOpen) return; 
   this.clearAll();
   this.isModalOpen = false; // Close the modal
}

// Listen for clicks on the document
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  const clickedInside = this.elementRef.nativeElement.contains(event.target);
  if (!clickedInside) {
    this.handleOutsideClick();
  }
}

//  open the modal
openModal(): void {
  this.isModalOpen = true;
}

getTableDataAfetrClose(vin: any = null) {
  let url = ``;
  if (this.vin) {
    url = url + `&vin=${this.vin}`;
  }
  this.userData.getVinDataForPDF(url).subscribe(
    (res: any) => {
      if (!res.error) {
        //const data = res?.data?.items || [];
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
