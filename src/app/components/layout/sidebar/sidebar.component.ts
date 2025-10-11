import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  Input,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { userData } from '../../../services/api-service.service';
import { CreatePDFService } from '../../../services/create-pdf.service';
import { PDF_SETTINGS } from '../../../constants';
import { LoaderComponent } from '../common/loader/loader.component';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import * as XLSX from 'xlsx';  // <-- import xlsx

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    LoaderComponent,
    FormsModule,
    MatCheckboxModule,
    MatTableModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  constructor(
    private userData: userData,
    private router: Router,
    private pdfService: CreatePDFService,
    private elementRef: ElementRef
  ) { }

  @Input() isSidebarActive: boolean = true;

  icon1 = 'assets/images/icons/sidebar-icon/dashboard.svg';
  icon2 = 'assets/images/icons/sidebar-icon/vehicle.svg';
  icon3 = 'assets/images/icons/sidebar-icon/new-alert.svg';
  icon4 = 'assets/images/icons/sidebar-icon/export-report.svg';
  icon5 = 'assets/images/icons/sidebar-icon/profile.svg';
  icon6 = 'assets/images/icons/sidebar-icon/support.svg';
  icon7 = 'assets/images/icons/sidebar-icon/information.png';
  icon8 = 'assets/images/icons/sidebar-icon/upload.svg';
  icon9 = 'assets/images/icons/sidebar-icon/file.svg';
  helpPdf = 'assets/helpdoc/NMVTIS_help_doc.pdf';

  isClick = false;
  isExportOpen = false;
  isLoading = false;

  vin: any = '';
  modalTableData: any[] = [];
  modalSearchValue = '';
  modalSelectedVins: any[] = [];
  modalCheckAll: 'single' | 'all' = 'single';
  modalIsLoading = false;
  modalIsOpen = false;
  modalDisplayedColumns: string[] = ['select', 'vin'];

  modalPage = 1;
  modalLimit = 1000;
  modalTotalPages = 0;
  modalTotalRecords = 0;
  modalVisiblePages: number[] = [];
  maxVisiblePages = 5;

  ngOnInit(): void {
    this.modifyLabelText();
  }

  openExportModal() {
    this.isExportOpen = !this.isExportOpen;
  }

  openSingleVinModal() {
    this.isClick = true;
    this.modalIsOpen = true;
    this.getTableDataForModal();
  }

  routerNavigation() {
    this.isLoading = true;
    const url = `page=1&limit=1`;
    this.userData.getUserDataForVigateFirstItem(url).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (!res.error && res?.data?.items?.length) {
          const item = res.data.items[0];
          const timestamp = new Date().getTime();
          this.router.navigate(['/title-details'], {
            queryParams: {
              vin: item?.vin,
              model: item?.model,
              refresh: timestamp,
            },
          });
        }
      },
      () => (this.isLoading = false)
    );
  }

  exportToPDF(type: string) {
    this.isLoading = true;
    const url = `type=${type}`;
    this.userData.getPdfData(url, this.modalSelectedVins).subscribe(
      async (res: any) => {
        const today = new Date();
        const formattedDate = `${String(today.getUTCDate()).padStart(2, '0')}${String(
          today.getUTCMonth() + 1
        ).padStart(2, '0')}${today.getUTCFullYear()}`;
        const label = type[0].toUpperCase() + type.slice(1);
        const filename = `${label}-Vins-VINify-Report-${formattedDate}`;
        if (!res.error && res?.data?.items?.length) {
          await this.pdfService.generatePDF(
            PDF_SETTINGS.COMPANY_NAME,
            PDF_SETTINGS.LOGO_URL,
            res.data.items,
            filename
          );
        } else {
          Swal.fire('Error!', 'No data found', 'error');
        }
        this.isLoading = false;
      },
      () => (this.isLoading = false)
    );
  }

  @HostListener('document:click', ['$event'])
  handleDocClick(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isExportOpen = false;
    }
  }

  getTableDataForModal() {
    this.isLoading = true;
    const offset = (this.modalPage - 1) * this.modalLimit;
    let url = `page=${this.modalPage}&limit=${this.modalLimit}`;
    if (this.vin) url += `&vin=${this.vin}`;

    this.userData.getVinDataForPDF(url).subscribe(
      (res: any) => {
        if (!res.error) {
          const data = res?.data?.items || [];
          data.forEach((item: any) => (item.isSelected = false));
          this.modalTableData = data;
          this.modalTotalRecords = res?.data?.totalRecords || 0;
          this.modalTotalPages = res?.data?.totalPages || 0;
          this.updateModalVisiblePages();
        }
        this.isLoading = false;
      },
      () => (this.isLoading = false)
    );
  }

  // -------------------- CSV DOWNLOAD USING XLSX --------------------
  downloadCsvButton() {
    this.isLoading = true;
    const url = ``;
    this.userData.getVinDataForCSVDownload(url).subscribe(
      (res: any) => {
        if (!res.error) {
          const data = res?.data || [];
          if (data.length === 0) {
            Swal.fire('Info!', 'No data available for CSV', 'info');
            this.isLoading = false;
            return;
          }

          // Map data to desired column order and rename keys with first char uppercase
          const mappedData = data.map((item: any) => ({
            Vin: item.vin || '',
            Brand: item.brand ? item.brand.split(' ')[0] : '',
            State: item.state || '',
            AlertType: item.alertType || '',
            Date: item.titleBrandDate || '',
            Status: item.status || '',
            Odometer: item.titleUnique || '',
            Description: item.description || '',
            Export: item.export || '',
            City: item.city || '',
            RptgEntity: item.rptgEntity || '',
            Email: item.email || '',
            Mobile: item.mobile || '',
            IsRead: item.isRead ?? false,
            IsOld: item.isOld ?? false,
            IsDel: item.isDel ?? false,
            Lienholder: item.lienholder || '',
            ItemNumber: item.itemNumber || '',
            Reason: item.reason || ''
          }));


          // Convert mapped JSON to worksheet
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData);

          // Create a workbook and append worksheet
          const workbook: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'VinData');

          // Download file
          const filename = `vin_data_${this.getFormattedDate()}.xlsx`;
          XLSX.writeFile(workbook, filename);

          Swal.fire('Success!', 'CSV/Excel downloaded successfully', 'success');
        }
        this.isLoading = false;
      },
      () => (this.isLoading = false)
    );
  }


  toggleSelectAllModal(event: any): void {
    const isChecked = event.checked;
    this.modalTableData.forEach((row) => (row.isSelected = isChecked));
    this.modalSelectedVins = isChecked
      ? this.modalTableData.map((row) => ({ vin: row.vin, id: row.id }))
      : [];
    this.modalCheckAll = isChecked ? 'all' : 'single';
  }

  onModalRowSelectionChange(item: any): void {
    if (item.isSelected) {
      const exists = this.modalSelectedVins.some(
        (v) => v.vin === item.vin && v.id === item.id
      );
      if (!exists) this.modalSelectedVins.push({ vin: item.vin, id: item.id });
    } else {
      this.modalSelectedVins = this.modalSelectedVins.filter(
        (v) => v.vin !== item.vin || v.id !== item.id
      );
    }
    this.modalCheckAll = 'single';
  }

  isAllModalSelected(): boolean {
    return (
      this.modalTableData.length > 0 &&
      this.modalTableData.every((row) => row.isSelected)
    );
  }

  isModalIndeterminate(): boolean {
    const selected = this.modalTableData.filter((row) => row.isSelected).length;
    return selected > 0 && selected < this.modalTableData.length;
  }

  getPDFDataModal() {
    this.isLoading = true;
    if (this.modalCheckAll === 'single' && this.modalSelectedVins.length === 0) {
      this.isLoading = false;
      Swal.fire('Info!', 'Please select VINs', 'info');
      return;
    }

    const url = `type=${this.modalCheckAll}`;
    const ids = this.modalSelectedVins.map((item) => item.id);
    const FinalfileName = `Specific-Vins-VINify-Report-${this.getFormattedDate()}`;

    this.userData.getPdfData(url, ids).subscribe(
      async (res: any) => {
        if (!res.error) {
          await this.pdfService.generatePDF(
            PDF_SETTINGS.COMPANY_NAME,
            PDF_SETTINGS.LOGO_URL,
            res?.data?.items || [],
            FinalfileName
          );
        }
        this.isLoading = false;
      },
      () => (this.isLoading = false)
    );
  }

  modalGetSearchVal() {
    this.modalCheckAll = 'single';
    this.modalTableData.forEach((row) => (row.isSelected = false));
    this.modalSelectedVins = [];
    if (this.modalSearchValue.trim().length > 0) {
      this.handleModalSearch(this.modalSearchValue.trim());
    } else {
      this.modalSearchValue = '';
      this.vin = '';
    }
  }

  onTypeModal(value: string) {
    if (value === '') {
      this.modalSelectedVins = [];
      this.handleModalSearch('');
    }
  }

  handleModalSearch(vin: any) {
    this.vin = vin;
    this.modalPage = 1;
    this.getTableDataForModal();
  }

  clearAllModalData() {
    this.vin = '';
    this.modalSelectedVins = [];
    this.modalSearchValue = '';
    this.modalCheckAll = 'single';
    this.modalPage = 1;
    this.getTableDataForModal();
  }

  goToModalPage(page: number) {
    if (page < 1 || page > this.modalTotalPages) return;
    this.modalPage = page;
    this.getTableDataForModal();
    this.updateModalVisiblePages();
  }

  nextModalPage() {
    if (this.modalPage < this.modalTotalPages) {
      this.goToModalPage(this.modalPage + 1);
    }
  }

  previousModalPage() {
    if (this.modalPage > 1) {
      this.goToModalPage(this.modalPage - 1);
    }
  }

  updateModalVisiblePages() {
    const totalPages = this.modalTotalPages;
    const currentPage = this.modalPage;
    const maxVisible = 3; // fixed to 3 pages

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages: number[] = [];

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push(-1);
    }

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(-1);
      pages.push(totalPages);
    }

    this.modalVisiblePages = pages;
  }

  getFormattedDate(): string {
    const today = new Date();
    return `${String(today.getUTCDate()).padStart(2, '0')}${String(
      today.getUTCMonth() + 1
    ).padStart(2, '0')}${today.getUTCFullYear()}`;
  }

  modifyLabelText() {
    // Placeholder for any UI label adjustments
  }
}
