import { AfterViewInit, Component, ElementRef, HostListener, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userData } from '../../../services/api-service.service';
import { LoaderComponent } from '../common/loader/loader.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { FileDownloadService } from '../../../services/file-download.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-export',
  imports: [CommonModule, MatTableModule, FormsModule, MatCheckboxModule, LoaderComponent],
  templateUrl: './get-recent-alert-file-export.component.html',
  styleUrl: './get-recent-alert-file-export.component.css'
})
export class FileExportComponent implements OnInit, AfterViewInit {
  constructor(
    private userData: userData,
    private router: Router,
    private elementRef: ElementRef,
    private fileService: FileDownloadService
  ) {}

  isModalOpen = true;
  tableData: any[] = [""];
  isLoading: boolean = false;
  vin: any = '';
  limit = 1000000;
  page = 1;
  checkall: any = "single";
  selectedVins: any[] = [];
  displayedColumns: string[] = ['select', 'vin'];
  searchValue: string = "";

  @ViewChild('targetElement', { static: false }) targetElement!: ElementRef;

  ngOnChanges(changes: SimpleChanges) {
    this.selectReleventData();
  }

  ngOnInit() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.getTableData();
          this.tableData?.forEach((row: any) => {
            if (this.selectedVins?.includes(row?.vin)) {
              row.isSelected = true;
            }
          });
        }
      },
      { threshold: 0.1 }
    );

    if (this.targetElement?.nativeElement) {
      observer.observe(this.targetElement.nativeElement);
    }
  }

  ngAfterViewInit() {
    const modal = document?.getElementById('exampleModalExport');

    if (modal) {
      modal?.addEventListener('shown.bs.modal', () => {
        this.openModal();
      });

      modal?.addEventListener('hidden.bs.modal', () => {
        this.clearAll();
      });
    }
  }

  selectReleventData() {
    this.tableData?.forEach((row: any) => {
      if (this.selectedVins?.includes(row?.vin)) {
        row.isSelected = true;
      }
    });
  }

  getTableData(vin: any = null) {
    this.isLoading = true;
    let url = `page=${this.page}&limit=${this.limit}`;
    if (this.vin) {
      url += `&vin=${this.vin}`;
    }

    this.userData.getVinData(url).subscribe(
      (res: any) => {
        if (!res?.error) {
          const data = res?.data || [];
          data.forEach((item: any) => (item.isSelected = false));
          this.tableData = data;
        }

        this.selectReleventData();
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  toggleSelectAll(event: any): void {
    const isChecked = event?.checked;
    if (isChecked) {
      this.tableData?.forEach((row) => {
        row.isSelected = true;
        if (!this.selectedVins.includes(row.vin)) {
          this.selectedVins.push(row.vin);
        }
      });
    } else {
      this.tableData?.forEach((row) => {
        row.isSelected = false;
      });
      this.selectedVins = [];
    }
    this.checkall = isChecked ? 'all' : 'single';
  }

  onRowSelectionChange(item: any): void {
    if (item?.isSelected) {
      const vinExists = this.selectedVins?.some(
        (selected) => selected === item?.vin
      );
      if (!vinExists) {
        this.selectedVins?.push(item?.vin);
      }
    } else {
      this.selectedVins = this.selectedVins?.filter(
        (selected) => selected !== item?.vin
      );
    }
    this.checkall = 'single';
  }

  isAllSelected(): boolean {
    return this.tableData?.every((row) => row?.isSelected) ?? false;
  }

  isIndeterminate(): boolean {
    const selected = this.tableData?.filter((row) => row?.isSelected)?.length ?? 0;
    return selected > 0 && selected < this.tableData?.length;
  }

  getPDFData() {
    if (this.checkall === "single" && this.selectedVins?.length === 0) {
      this.isLoading = false;
      Swal.fire({
        title: 'Info!',
        text: 'Please select VINs',
        icon: 'info',
        confirmButtonText: 'OK',
        showClass: { popup: 'animated fadeInDown faster', icon: 'animated heartBeat delay-1s' }
      });
      return;
    }

    if (this.searchValue.trim() !== '' && this.selectedVins?.length === 0) {
      return;
    }

    let data = { data: this.selectedVins };

    Swal.fire({
      title: 'Action!',
      text: "Are you sure you want to initiate process of VINs?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      showClass: { popup: 'animated fadeInDown faster', icon: 'animated heartBeat delay-1s' }
    }).then((result) => {
      if (result?.isConfirmed) {
        this.isLoading = true;
        this.closeModal();

        this.userData.sendVinData(data).subscribe(
          (res: any) => {
            if (!res?.error) {
              this.tableData?.forEach((item: any) => (item.isSelected = false));
            }
            this.selectedVins = [];
            this.isLoading = false;
            setTimeout(() => {
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate([this.router.url]);
              });
            }, 1);
          },
          () => {
            this.isLoading = false;
          }
        );
      } else {
        this.isLoading = false;
      }
    });
  }

  closeData() {
    this.checkall = "single";
    this.selectedVins = [];
  }

  getSearchVal() {
    this.checkall = 'single';

    if (this.searchValue?.trim().length === 0) {
      this.searchValue = "";
      this.vin = "";
    } else {
      this.handelSearch(this.searchValue.trim());
    }
  }

  onType(value: string) {
    if (value === "") {
      this.handelSearch(value.trim());
    }
  }

  handelSearch(vin: any) {
    this.vin = vin;
    this.getTableData();
  }

  clearAll() {
    this.vin = "";
    this.selectedVins = [];
    this.searchValue = "";
    this.checkall = "single";
    this.getTableDataAfetrClose();
  }

  handleOutsideClick() {
    if (!this.isModalOpen) return;
    this.clearAll();
    this.isModalOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef?.nativeElement?.contains(event?.target);
    if (!clickedInside) {
      this.handleOutsideClick();
    }
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  getTableDataAfetrClose(vin: any = null) {
    let url = `page=${this.page}&limit=${this.limit}`;
    if (this.vin) {
      url += `&vin=${this.vin}`;
    }

    this.userData.getVinData(url).subscribe(
      (res: any) => {
        if (!res?.error) {
          const data = res?.data || [];
          data.forEach((item: any) => (item.isSelected = false));
          this.tableData = data;
        }
      },
      () => {}
    );
  }

  closeModal() {
    this.clearAll();
    const modal = document?.getElementById('exampleModalExport');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.hide();

      setTimeout(() => {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('style', 'display: none');

        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.remove();
        }

        document.body.classList.remove('modal-open');
      }, 300);
    }
  }
}
