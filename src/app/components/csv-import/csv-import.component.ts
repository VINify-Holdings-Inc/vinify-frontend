import { Component, ElementRef, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { AuthService } from '../../services/api-service.service';

@Component({
  selector: 'app-csv-import',
  imports: [],
  templateUrl: './csv-import.component.html',
  styleUrl: './csv-import.component.css',
  standalone: true,
})
export class CsvImportComponent {
  sidebarActive = false;
  overlayActive = false;
  data: any[] = [];
  data1: any[] = [];
  toast = { type: '', message: '' };
  btnDisabled = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private authService: AuthService) {}

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }

  toggleOverlay() {
    this.overlayActive = !this.overlayActive;
    this.sidebarActive = !this.sidebarActive;
  }

  resetToast() {
    this.toast = { type: '', message: '' };
  }

  async handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    this.btnDisabled = true;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;

      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });

      const allSheetsData: { [sheetName: string]: any[] } = {};

      // Iterate over all sheet names
      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        // Process and store data from each sheet
        allSheetsData[sheetName] = jsonData.map((item: any) => ({
          ...item, // Add specific processing logic here if needed
        }));
      });

      console.log('All Sheets Data:', allSheetsData);

      // Example: Assign data from specific sheets to `data` and `data1`
      const sheet1Headers = ['VIN', 'Title', 'Brand', 'Insurance', 'Junk&Salvage'];
      const sheet2Headers = [
        'JSI Info set',
        'VIN ID',
        'status',
        'VIN',
        'SOT',
        'Brand Code',
        'Make',
        'Model Year',
        'Title / Brand Date',
        'Member',
      ];

      Object.keys(allSheetsData).forEach((sheetName) => {
        const sheetData = allSheetsData[sheetName];
        if (sheetData.length) {
          const headers = Object.keys(sheetData[0]);
          const isSheet1 = sheet1Headers.every((header) => headers.includes(header));
          const isSheet2 = sheet2Headers.every((header) => headers.includes(header));

          if (isSheet1) {
            this.data = sheetData.map((item: any) => ({
              VIN: item['VIN'] || '',
              Title: item['Title'] || '',
              Brand: item['Brand'] || '',
              Insurance: item['Insurance'] || '',
              Junk_Salvage: item['Junk&Salvage'] || '',
            }));
          } else if (isSheet2) {
            this.data1 = sheetData.map((item: any) => ({
              JSI_Info_set: item['JSI Info set'] || '',
              Vin_id: item['VIN ID'] || '',
              status: item['status'] || '',
              VIN: item['VIN'] || '',
              SOT: item['SOT'] || '',
              Brand_Code: item['Brand Code'] || '',
              Make: item['Make'] || '',
              Model_Year: item['Model Year'] || '',
              Title_Brand_Date: item['Title / Brand Date'] || '',
              Member: item['Member'] || '',
            }));
          } else {
            console.warn(`Unrecognized format in sheet: ${sheetName}`);
          }
        }
      });

      console.log('Data:', this.data);
      console.log('Data1:', this.data1);
    };
    reader.readAsArrayBuffer(file);
  }

  async handleSubmit() {
    try {
      if (this.data.length) {
        console.log(this.data);
       
        this.authService.insertData({ data: this.data }).subscribe((response: any) => {
          this.handleApiResponse(response);
        });
      }
      if (this.data1.length) {
        console.log(this.data1);
       
        this.authService.insertSheet2Data({ data: this.data1 }).subscribe((response: any) => {
          this.handleApiResponse(response);
        });
      }
    } catch (error) {
      console.error('Error:', error);
      this.showToast('error', 'An unexpected error occurred. Please try again later.');
    }
  }

  handleApiResponse(response: any) {
    const { type, message } = response;
    this.showToast(type, message);
    this.btnDisabled = false;
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }

  showToast(type: string, message: string) {
    alert(`Type: ${type}, Message: ${message}`);
  }
}
