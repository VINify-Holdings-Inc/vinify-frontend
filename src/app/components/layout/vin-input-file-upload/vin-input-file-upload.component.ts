import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../common/loader/loader.component';
import { userData } from '../../../services/api-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './vin-input-file-upload.component.html',
  styleUrl: './vin-input-file-upload.component.css'
})
export class FileUploadComponent implements OnInit {
  constructor(private userData: userData, private router: Router) {}

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  isLoading: boolean = false;
  idData: any = false;

  ngOnInit(): void {
    this.fetchVinData(); // API call on load
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'txt') {
      this.processTxtFile(file);
    } else if (ext === 'csv') {
      this.processCsvFile(file);
    } else if (ext === 'xlsx' || ext === 'xls') {
      this.processExcelFile(file);
    } else {
      this.showError('Only .txt, .csv, .xlsx are allowed.');
    }
  }

  fetchVinData() {
    this.isLoading = true;
    const url = ''; // Add endpoint if needed
    this.userData.getVinDataForCSVDownload(url).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.idData = !res.error && res.data?.length > 0;
      },
      () => {
        this.isLoading = false;
        this.idData = false;
      }
    );
  }

  processTxtFile(file: File) {
    const validPattern = /^MY\.[TP]\.CINQ\.INPUT\d*\.TXT$/;
    if (!validPattern.test(file.name.toUpperCase())) {
      this.showError('TXT file name should follow MY.P.CINQ.INPUT.TXT or MY.T.CINQ.INPUT.TXT format.');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const content = (e.target as any).result;
      if (this.validateTxtContent(content)) {
        this.selectedFile = file;
      } else {
        this.resetInput();
      }
    };
    reader.readAsText(file);
  }

  processCsvFile(file: File) {
    const reader = new FileReader();
    reader.onload = e => {
      const content = (e.target as any).result;
      const lines = content.split('\n').map((line: string) => line.trim()).filter(Boolean);
      const headers = lines[0].split(',').map((h: any) => h.trim().toLowerCase());
      const vinIndex = headers.indexOf('VIN');

      if (vinIndex === -1 || headers.length > 1) {
        this.showError('CSV must only contain one column named "VIN".');
        return;
      }

      const vins: any = [...new Set(lines.slice(1).map((l: any) => l.split(',')[vinIndex].trim()).filter(Boolean))];
      this.generateTxtFromVins(vins);
    };
    reader.readAsText(file);
  }

  processExcelFile(file: File) {
    const reader = new FileReader();
    reader.onload = e => {
      const data = new Uint8Array((e.target as any).result);
      const wb = XLSX.read(data, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 });

      const headers = rows[0].map((h: any) => h?.toString().toLowerCase().trim());
      const vinIndex = headers.indexOf('vin');

      if (vinIndex === -1 || headers.length > 1) {
        this.showError('Excel must only contain one column named "VIN".');
        return;
      }

      const vins = [...new Set(rows.slice(1).map(r => r[vinIndex]?.toString().trim()).filter(Boolean))];
      this.generateTxtFromVins(vins);
    };
    reader.readAsArrayBuffer(file);
  }

  generateTxtFromVins(vins: string[]) {
    if (!vins.length) {
      this.showError('No VINs found.');
      return;
    }

    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const recordCount = vins.length.toString();
    const spaces = ' '.repeat(9 - recordCount.length);
    const header = `CMY${spaces}${recordCount}${yyyy}${mm}${dd}`;
    const lines = [header, ...vins.map(v => 'D' + v)];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });

    const txtFile = new File([blob], 'MY.T.CINQ.INPUT.TXT');
    this.selectedFile = txtFile;
  }

  uploadGeneratedFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.idData = false;

    Swal.fire({
      title: 'Upload Successful!',
      text: `Your file has been uploaded successfully. Processing may take some time. You can wait or revisit later to download the processed file.`,
      icon: 'success',
      confirmButtonText: 'OK'
    });

    this.userData.uploadTxtFile(formData).subscribe(
      (res: any) => {
        this.resetInput();
        this.idData = !res.error;
        if (res.error) this.fetchVinData();
      },
      () => {
        this.isLoading = false;
        this.fetchVinData();
      }
    );
  }

  validateTxtContent(content: string): boolean {
    const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines[0].startsWith('CMY')) {
      this.showError('TXT must start with CMY header.');
      return false;
    }

    const match = lines[0].match(/^CMY\s+(\d+)(\d{8})$/);
    if (!match) {
      this.showError('Invalid CMY header format.');
      return false;
    }

    const count = parseInt(match[1], 10);
    const records = lines.slice(1);
    if (records.length !== count) {
      this.showError(`Expected ${count} records, found ${records.length}.`);
      return false;
    }

    for (let i = 0; i < records.length; i++) {
      if (!/^D[A-Z0-9]+$/.test(records[i])) {
        this.showError(`Invalid VIN format at line ${i + 2}`);
        return false;
      }
    }

    return true;
  }

  showError(msg: string) {
    Swal.fire("Error", msg, "error");
    this.resetInput();
  }

  resetInput() {
    this.selectedFile = null;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.showError("No file selected.");
      return;
    } 
    this.uploadGeneratedFile(this.selectedFile);
    this.selectedFile=null;
  }

  downloadVinCsv() {
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

          const mappedData = data.map((item: any) => ({
            VIN: item.vin || '',
            Status: item.status || '',
            Date: item.titleBrandDate || '',
            AlertType: item.alertType || '',
            Brand: item.brand ? item.brand.split(' ')[0] : '',
            Odometer: item.titleUnique || '',
            State: item.state || '',
            City: item.city || '',
            Description: item.description || '',
            Export: item.export || '',
            RptgEntity: item.rptgEntity || '',
            Mobile: item.mobile || '',
            Email: item.email || '',
            Lienholder: item.lienholder || '',
            ItemNumber: item.itemNumber || '',
            Reason: item.reason || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData);
          const workbook: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'VinData');

          const filename = `VIN_DATA_${this.getFormattedDate()}.xlsx`;
          XLSX.writeFile(workbook, filename);
        }

        this.isLoading = false;
      },
      () => (this.isLoading = false)
    );
  }

  getFormattedDate(): string {
    const today = new Date();
    return `${String(today.getUTCDate()).padStart(2, '0')}${String(
      today.getUTCMonth() + 1
    ).padStart(2, '0')}${today.getUTCFullYear()}`;
  }
}
