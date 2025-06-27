import { Component, Input, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { userData } from '../../../services/api-service.service';
import { CreatePDFService } from '../../../services/create-pdf.service';
import { PDF_SETTINGS } from '../../../constants';
import { LoaderComponent } from '../common/loader/loader.component';
import { SingleVinComponent } from '../dashboard/single-vin/single-vin.component';
import { FileExportComponent } from '../get-recent-alert-file-export/get-recent-alert-file-export.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, LoaderComponent, SingleVinComponent, FileExportComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  constructor(private userData: userData, private router: Router, private pdfService: CreatePDFService,) { }
  
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
  icon9: string = 'assets/images/icons/sidebar-icon/file.svg';
  helpPdf: any = 'assets/helpdoc/NMVTIS_help_doc.pdf';
  @Input() isSidebarActive: boolean = true;

  isExportOpen: boolean = false

  openExportModal = () => {
    this.isExportOpen = !this.isExportOpen;
  }
  @HostListener('document:click', ['$event'])
  closeModal(event: Event) {
    this.isExportOpen = false;
  }

  routerNavigation() { 
    let url = `page=1&limit=1`;
    this.userData.getUserDataForVigateFirstItem(url).subscribe(
      (res: any) => {
        if (!res.error) { 
          if (res?.data?.items.length) {
            const lastUpdateDate = res?.data?.items[0];
            const timestamp = new Date().getTime();
            this.router.navigate(['/title-details'], {
              queryParams: {
                vin: lastUpdateDate?.vin || '',
                model: lastUpdateDate?.model || '',
                refresh: timestamp
              }
            });
          }  
        }
      },
      (err) => {
      }
    );
  }
  exportToPDF(type: any) {
    this.getTableData(type);
  }
  selectedVins: [] = [];
  isLoading: boolean = false;
  getTableData(dataType: any) {
    this.isLoading = true;
    let url = `type=${dataType}`;

    this.userData.getPdfData(url, this.selectedVins).subscribe(
      (res: any) => {
         const today = new Date();
            const formattedDate = `${String(today.getUTCDate()).padStart(2, '0')}${String(today.getUTCMonth() + 1).padStart(2, '0')}${today.getUTCFullYear()}`;
            const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

            const typeLabel = dataType === 'all' || dataType === 'update' ? capitalizeFirstLetter(dataType) : 'Updated';
            const FinalfileName = `${typeLabel}-Vins-VINify-Report-${formattedDate}`;
        if (!res.error) {
          if (res?.data?.items.length > 0) {
            this.pdfService.generatePDF(
              PDF_SETTINGS.COMPANY_NAME,
              PDF_SETTINGS.LOGO_URL,
              res?.data?.items || [],
                `${FinalfileName}`
            );
          } else {
            Swal.fire({
              title: 'Error!',
              showClass: {
                popup: 'animated fadeInDown faster',
                icon: 'animated heartBeat delay-1s'
              },
              text: "No data found",
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }

        }
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }


}



