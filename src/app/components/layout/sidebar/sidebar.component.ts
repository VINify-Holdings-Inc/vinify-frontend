import { Component, Input ,OnInit,HostListener} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { userData } from '../../../services/api-service.service';
import { CreatePDFService } from '../../../services/create-pdf.service';
import { PDF_SETTINGS } from '../../../constants';
import { LoaderComponent } from '../common/loader/loader.component';
import { SingleVinComponent } from '../dashboard/single-vin/single-vin.component';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,RouterLink,RouterLinkActive,LoaderComponent,SingleVinComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
    constructor(private userData: userData,private router: Router,private pdfService: CreatePDFService,){ }
    tableData :any[] =[]; 
  ngOnInit(): void { 
   
  }
  icon1: string = 'assets/images/icons/sidebar-icon/dashboard.svg';
  icon2: string = 'assets/images/icons/sidebar-icon/vehicle.svg';
  icon3: string = 'assets/images/icons/sidebar-icon/new-alert.svg';
  icon4: string = 'assets/images/icons/sidebar-icon/export-report.svg';
  icon5: string = 'assets/images/icons/sidebar-icon/profile.svg';
  icon6: string = 'assets/images/icons/sidebar-icon/support.svg';
  icon7: string = 'assets/images/icons/sidebar-icon/information.png';
  icon8: string = 'assets/images/icons/sidebar-icon/upload.svg';
  helpPdf: any = 'assets/helpdoc/NMVTIS_help_doc.pdf';
  @Input() isSidebarActive: boolean = true; 

  isExportOpen:boolean=false

  openExportModal=()=>{
   this.isExportOpen=!this.isExportOpen;
  }
  @HostListener('document:click', ['$event'])
  closeModal(event: Event) {
    this.isExportOpen = false;
  }
 
  routerNavigation() {  

    let url = `page=1&limit=1`;
   this.userData.getCurrentVinDataForUser(url).subscribe(
     (res: any) => {
       if (!res.error) {
         this.tableData = res?.data?.items || [];  
         //console.log("this",this.tableData);
         if(res?.data?.items.length){
        const lastUpdateDate=res?.data?.items[0]; 
        const timestamp = new Date().getTime();
        this.router.navigate(['/title-details'], {
          queryParams: {
            vin: lastUpdateDate?.vin || '',
            model:lastUpdateDate?.model || '',
            refresh: timestamp
          }
        });
         }else{
          this.tableData = res?.data?.items || []; 
         }
       }
     },
     (err) => {    
     }
   );
  }
  exportToPDF(type:any) {
      this.getTableData(type);
  }
  selectedVins:[]=[];
  isLoading:boolean=false;
  getTableData(dataType:any) {
    this.isLoading = true;
    let url = `type=${dataType}`;
      
    this.userData.getPdfData(url,this.selectedVins).subscribe(
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

 
}



 