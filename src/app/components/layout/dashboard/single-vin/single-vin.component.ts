import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { userData } from '../../../../services/api-service.service';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import Swal from 'sweetalert2';
import { PDF_SETTINGS } from '../../../../constants';
import { CreatePDFService } from '../../../../services/create-pdf.service';
import { LoaderComponent } from '../../common/loader/loader.component';

@Component({
  selector: 'app-single-vin',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule, MatCheckboxModule, LoaderComponent],
  templateUrl: './single-vin.component.html',
  styleUrls: ['./single-vin.component.css'],
})
export class SingleVinComponent implements OnInit, AfterViewInit, OnChanges {
  constructor(
    private userData: userData,
    private pdfService: CreatePDFService,
    private elementRef: ElementRef
  ) {}

  @Input() isClick: boolean = false;
  @Output() modalClosed = new EventEmitter<void>();

  isModalOpen = true;
  tableData: any[] = [];
  isLoading: boolean = false;
  vin: any = '';
  limit = 1000000;
  page = 1;
  checkall: any = 'single';
  selectedVins: any[] = [];
  displayedColumns: string[] = ['select', 'vin'];
  searchValue: string = '';

  ngOnInit() {
    this.modifyLabelText();
  }

  ngOnChanges(changes: SimpleChanges) {
    
  console.log('isClick changed', changes['isClick']);
    // alert("sdntestingghf")
  if ( changes['isClick'] &&   changes['isClick'].currentValue === true ) {
    this.getTableData();
  }
}

  ngAfterViewInit() {
    const modal = document.getElementById('exampleModal');

    if (modal) {
      modal.addEventListener('shown.bs.modal', () => {
        this.openModal();
      });

      modal.addEventListener('hidden.bs.modal', () => {
        this.clearAll();
      });

      setTimeout(() => {
        this.modifyLabelText();
      }, 1000);
    }
  }

  modifyLabelText() {
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.mdc-label').forEach(label => {
        if (label.textContent !== '.') {
          label.textContent = '.';
          (label as HTMLElement).style.display = 'none';
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  getTableData(vin: any = null) {
    this.isLoading = true;
    let url = '';
    if (this.vin) {
      url = url + `&vin=${this.vin}`;
    }

    this.userData.getVinDataForPDF(url).subscribe(
      (res: any) => {
      
        if (!res.error) {
          const data = res?.data || [];
          data.forEach((item: any) => (item.isSelected = false));
          this.tableData = data;
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
    if (isChecked) {
      this.tableData.forEach((row) => {
        row.isSelected = isChecked;
        this.selectedVins.push({ vin: row.vin, id: row.id });
      });
    } else {
      this.tableData.forEach((row) => {
        row.isSelected = false;
      });
      this.selectedVins = [];
    }
    this.checkall = isChecked ? 'all' : 'single';
  }

  onRowSelectionChange(item: any): void {
    if (item.isSelected) {
      const vinExists = this.selectedVins.some(
        (selected) => selected.vin === item.vin && selected.id === item.id
      );
      if (!vinExists) {
        this.selectedVins.push({ vin: item.vin, id: item.id });
      }
    } else {
      this.selectedVins = this.selectedVins.filter(
        (selected) => selected.vin !== item.vin || selected.id !== item.id
      );
    }
    this.checkall = 'single';
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

    if (this.checkall == 'single') {
      if (this.selectedVins.length == 0) {
        this.isLoading = false;
        Swal.fire({
          title: 'Info!',
          text: 'Please select VINs',
          icon: 'info',
          confirmButtonText: 'OK',
          showClass: {
            popup: 'animated fadeInDown faster',
            icon: 'animated heartBeat delay-1s',
          },
        });
        return;
      }
    }

    if (this.searchValue.trim() !== '' && this.selectedVins.length == 0) {
      return;
    }

    let url = `type=${this.checkall}`;
    const ids = this.selectedVins.map((item) => item.id);
    const today = new Date();
    const formattedDate = `${String(today.getUTCDate()).padStart(2, '0')}${String(
      today.getUTCMonth() + 1
    ).padStart(2, '0')}${today.getUTCFullYear()}`;
    const FinalfileName = `Specific-Vins-VINify-Report-${formattedDate}`;

    this.userData.getPdfData(url, ids).subscribe(
      (res: any) => {
        if (!res.error) {
          this.pdfService.generatePDF(
            PDF_SETTINGS.COMPANY_NAME,
            PDF_SETTINGS.LOGO_URL,
            res?.data?.items || [],
            FinalfileName
          );
        }
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  closeData() {
    this.checkall = 'single';
    this.selectedVins = [];
  }

  getSearchVal() {
    this.checkall = 'single';
    this.tableData.forEach((row) => {
      row.isSelected = false;
      this.selectedVins = [];
    });

    if (this.searchValue == '') {
      this.searchValue = '';
      this.vin = '';
    } else {
      if (this.searchValue.trim().length === 0) {
        this.searchValue = '';
      } else {
        this.handelSearch(this.searchValue.trim());
      }
    }
  }

  onType(value: string) {
    if (value == '') {
      this.selectedVins = [];
      this.handelSearch(value.trim());
    }
  }

  handelSearch(vin: any) {
    this.vin = vin;
    this.getTableData();
  }

  clearAll() {
    this.vin = '';
    this.selectedVins = [];
    this.searchValue = '';
    this.checkall = 'single';
    this.getTableDataAfetrClose();
  }

  handleOutsideClick() {
    if (!this.isModalOpen) return;
    this.clearAll();
    this.isModalOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.handleOutsideClick();
    }
  }

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
          const data = res?.data || [];
          data.forEach((item: any) => (item.isSelected = false));
          this.tableData = data;
        }
      },
      (err) => {}
    );
  }
}


 