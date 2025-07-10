import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges,
  ChangeDetectorRef,
  AfterViewInit,
  OnChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreatePDFService } from '../../../../services/create-pdf.service';
import { PDF_SETTINGS } from '../../../../constants';
import { userData } from '../../../../services/api-service.service';
import { LoaderComponent } from '../../common/loader/loader.component';
import Swal from 'sweetalert2';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CsvExportService } from '../../../../services/csv-export.service';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    LoaderComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
  ],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css'],
})
export class UserTableComponent implements AfterViewInit, OnChanges {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private pdfService: CreatePDFService,
    private userData: userData,
    private cdr: ChangeDetectorRef,
    private csvExportService: CsvExportService
  ) {}

  @Input() tableData: any[] = [];
  @Input() page = 0;
  @Input() totalPages = 0;
  @Input() tableName = '';
  @Input() serchKpiType: any = '';
  @Input() totalItems = 0;
  @Input() resetData = false;
  @Input() limit = 0;
  @Output() handelPaginagtion = new EventEmitter<any>();
  @Output() handelSearch = new EventEmitter<any>();
  @Output() handelAlertFil = new EventEmitter<any>();
  @Output() handelAlertTypeFilter = new EventEmitter<any>();


   filerIcon = 'assets/images/icons/filter-lines.svg';
  calendarIcon = 'assets/images/icons/calendar.svg';
  pdfIcon = 'assets/images/icons/pdf.svg';

  searchValue = '';
  selectedVins: { vin: string; alertDate: string }[] = [];
  displayedColumns: string[] = ['vin', 'title', 'brand', 'jsi', 'details'];
  currentPage = 1;
  visiblePages: number[] = [];
  maxVisiblePages = 4;
  isLoading = false;

  isAllSelected(): any {
    return this.tableData.length && this.tableData.every(row => row.isSelected);
  }

  isIndeterminate(): boolean {
    const selected = this.tableData.filter(row => row.isSelected).length;
    return selected > 0 && selected < this.tableData.length;
  }

  onRowSelectionChange(item: any): void {
    if (item.isSelected) {
      const alreadyExists = this.selectedVins.some(v => v.vin === item.vin);
      if (!alreadyExists) this.selectedVins.push(item);
    } else {
      this.selectedVins = this.selectedVins.filter(v => v.vin !== item.vin);
    }
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.checked;
    this.tableData.forEach(row => (row.isSelected = isChecked));
    this.selectedVins = isChecked ? [...this.tableData] : [];
  }

  clearAll(): void {
    this.selectedVins = [];
    this.tableData.forEach(row => (row.isSelected = false));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resetData']) {
      this.searchValue = '';
      this.onType('');
      this.updateVisiblePages();
    }
    if (changes['page'] || changes['totalPages']) {
      this.currentPage = this.page;
      this.updateVisiblePages();
    }
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.currentPage = this.page;
    this.updateVisiblePages();
    this.cdr.detectChanges();

    const modal = document.getElementById('exampleModalvivek');
    if (modal) {
      modal.addEventListener('shown.bs.modal', () => {
        this.modalIsOpen = true;
        this.getTableDataForModal();
      });

      modal.addEventListener('hidden.bs.modal', () => {
        this.clearAllModalData();
        this.modalIsOpen = false;
      });
    }
  }

  onClick(pages: number) {
    this.handelPaginagtion.emit({ page: pages, search: this.searchValue });
    this.getValifExist();
    this.selectedVins = [];
  }

  redirectToOtherPage(vin: string, model: string) {
    const data = { vin, model };
    this.router.navigateByUrl('/user-summary-list', { state: data });
  }

  getSearchVal() {
    if (this.searchValue.trim().length > 0) {
      this.handelSearch.emit(this.searchValue.trim());
      this.handelPaginagtion.emit({ page: 1, search: this.searchValue });
    } else {
      this.searchValue = '';
    }
  }

  onType(value: string) {
    if (value === '') {
      this.handelSearch.emit(value.trim());
    }
  }

  getVinDetails(vin: string, model: string) {
    sessionStorage.setItem('navigationKeyDashboard', this.serchKpiType);
    const timestamp = new Date().getTime();
    this.router.navigate(['/title-details'], {
      queryParams: { vin: vin.trim(), model, refresh: timestamp },
    });
  }

  exportToPDF(type: any) {
    this.getTableData(type);
  }

 async getTableData(dataType: any) {
  this.isLoading = true;
  let url = `type=${dataType}`;

  if (dataType === 'single' && this.selectedVins.length === 0) {
    this.isLoading = false;
    Swal.fire('Info!', 'Please select VINs', 'info');
    return;
  }

  this.userData.getPdfData(url, this.selectedVins).subscribe(
    async (res: any) => {
      if (!res.error) {
        const FinalfileName = `${dataType}-Vins-VINify-Report-${this.getFormattedDate()}`;
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


  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.handelPaginagtion.emit({ page, search: this.searchValue });
    this.updateVisiblePages();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(++this.currentPage);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(--this.currentPage);
    }
  }

  updateVisiblePages() {
    const start = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
    const end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);
    const visible: number[] = [];
    for (let i = start; i <= end; i++) visible.push(i);
    if (start > 1) visible.unshift(1);
    if (start > 2) visible.splice(1, 0, -1);
    if (end < this.totalPages) visible.push(this.totalPages);
    if (end < this.totalPages - 1) visible.splice(visible.length - 1, 0, -1);
    this.visiblePages = visible;
    this.getValifExist();
  }

  getValifExist() {
    if (this.searchValue !== '') {
      this.handelSearch.emit(this.searchValue.trim());
    }
  }

  alertTypeFilter(type: string | null) {
    this.handelAlertTypeFilter.emit(type);
  }

  getFormattedDate(): string {
    const today = new Date();
    return `${String(today.getUTCDate()).padStart(2, '0')}${String(today.getUTCMonth() + 1).padStart(2, '0')}${today.getUTCFullYear()}`;
  }

  // ============== MODAL =================
  modalTableData: any[] = [];
  vin: any = '';
  modalSearchValue = '';
  modalSelectedVins: any[] = [];
  modalCheckAll: 'single' | 'all' = 'single';
  modalIsLoading = false;
  modalIsOpen = false;
  modalDisplayedColumns: string[] = ['select', 'vin'];

  // ✅ Modal Pagination
  modalPage = 1;
  modalLimit = 1000;
  modalTotalPages = 0;
  modalTotalRecords = 0;
  modalVisiblePages: number[] = [];

  getTableDataForModal(vin: any = null) {
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

  toggleSelectAllModal(event: any): void {
    const isChecked = event.checked;
    this.modalTableData.forEach(row => (row.isSelected = isChecked));
    this.modalSelectedVins = isChecked
      ? this.modalTableData.map(row => ({ vin: row.vin, id: row.id }))
      : [];
    this.modalCheckAll = isChecked ? 'all' : 'single';
  }

  onModalRowSelectionChange(item: any): void {
    if (item.isSelected) {
      const exists = this.modalSelectedVins.some(v => v.vin === item.vin && v.id === item.id);
      if (!exists) this.modalSelectedVins.push({ vin: item.vin, id: item.id });
    } else {
      this.modalSelectedVins = this.modalSelectedVins.filter(
        v => v.vin !== item.vin || v.id !== item.id
      );
    }
    this.modalCheckAll = 'single';
  }

  isAllModalSelected(): boolean {
    return this.modalTableData.length > 0 && this.modalTableData.every(row => row.isSelected);
  }

  isModalIndeterminate(): boolean {
    const selected = this.modalTableData.filter(row => row.isSelected).length;
    return selected > 0 && selected < this.modalTableData.length;
  }

 getPDFDataModal() {
  this.isLoading = true;

  if (this.modalCheckAll == 'single' && this.modalSelectedVins.length == 0) {
    this.isLoading = false;
    Swal.fire('Info!', 'Please select VINs', 'info');
    return;
  }

  let url = `type=${this.modalCheckAll}`;
  const ids = this.modalSelectedVins.map(item => item.id);
  const FinalfileName = `Specific-Vins-VINify-Report-${this.getFormattedDate()}`;

  this.userData.getPdfData(url, ids).subscribe(
    (res: any) => {
      (async () => {
        if (!res.error) {
          try {
            await this.pdfService.generatePDF(
              PDF_SETTINGS.COMPANY_NAME,
              PDF_SETTINGS.LOGO_URL,
              res?.data?.items || [],
              FinalfileName
            );
          } catch (err) {
            console.error('PDF generation failed:', err);
          }
        }
        this.isLoading = false;
      })();
    },
    () => {
      this.isLoading = false;
    }
  );
}

  modalGetSearchVal() {
    this.modalCheckAll = 'single';
    this.modalTableData.forEach(row => (row.isSelected = false));
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
    this.modalPage = 1; // reset to first page
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

  // ✅ Modal pagination handlers
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
    const start = Math.max(1, this.modalPage - Math.floor(this.maxVisiblePages / 2));
    const end = Math.min(this.modalTotalPages, start + this.maxVisiblePages - 1);
    const visible: number[] = [];
    for (let i = start; i <= end; i++) visible.push(i);
    if (start > 1) visible.unshift(1);
    if (start > 2) visible.splice(1, 0, -1);
    if (end < this.modalTotalPages) visible.push(this.modalTotalPages);
    if (end < this.modalTotalPages - 1) visible.splice(visible.length - 1, 0, -1);
    this.modalVisiblePages = visible;
  }
}
