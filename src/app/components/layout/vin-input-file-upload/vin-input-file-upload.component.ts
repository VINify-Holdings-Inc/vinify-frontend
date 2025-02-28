import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../common/loader/loader.component';
import { userData } from '../../../services/api-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-file-upload',
  imports: [CommonModule,LoaderComponent],
  templateUrl: './vin-input-file-upload.component.html',
  styleUrl: './vin-input-file-upload.component.css'
})
export class FileUploadComponent {
  constructor(private userData : userData,private router: Router){}
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  isLoading : boolean=false;


  /*onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
       Swal.fire({
                  title: 'Error!',
                  showClass: {
                    popup: 'animated fadeInDown faster',
                    icon: 'animated heartBeat delay-1s'
                  },
                  text: "No file selected",
                  icon: 'error',
                  confirmButtonText: 'OK',
                });
      return;
    }

    if (file.name !== 'MY.T.CINQ.INPUT.TXT') {
        this.selectedFile=null;
        this.fileInput.nativeElement.value = ""; 
      Swal.fire({
        title: 'Error!',
        showClass: {
          popup: 'animated fadeInDown faster',
          icon: 'animated heartBeat delay-1s'
        },
        text: 'Invalid file name. It must be MY.T.CINQ.INPUT.TXT',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (this.validateFileContent(content)) {
        this.selectedFile = file; // Store file if valid
      }
    };
    reader.readAsText(file);
  }  
*/

onFileSelected(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files?.length) {
    const file = fileInput.files[0];

    if (!file) {
      this.showError("No file selected");
      return;
    }

    if (file.name !== 'MY.T.CINQ.INPUT.TXT') {
      this.resetFileInput();
      this.showError("Invalid file name. It must be MY.T.CINQ.INPUT.TXT");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (this.validateFileContent(content)) {
        this.selectedFile = file; // Store file if valid
      } else {
        this.resetFileInput();
      }
    };
    reader.readAsText(file);
  }
}




  validateFileContent(content: string): boolean {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line !== "");
  
    if (lines.length < 2) {
      this.showError("Invalid file format. CMY record or data records are missing.");
      return false;
    }
  
    const firstLine = lines[0];
  
    if (!firstLine.startsWith('CMY')) {
      this.showError('File must start with "CMY".');
      return false;
    }
  
    // Extract record count and date
    const match = firstLine.match(/^CMY\s+(\d+)(\d{8})$/);
  
    if (!match) {
      this.showError("Invalid format in header line.");
      return false;
    }
  
    const recordCount = parseInt(match[1], 10);
    const datePart = match[2];
  
    if (isNaN(recordCount) || isNaN(Number(datePart))) {
      this.showError("Invalid record count or date format.");
      return false;
    }
  
    // Validate date format (YYYYMMDD) and ensure it's not a future date
    const year = parseInt(datePart.substring(0, 4), 10);
    const month = parseInt(datePart.substring(4, 6), 10);
    const day = parseInt(datePart.substring(6, 8), 10);
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      inputDate.getFullYear() !== year ||
      inputDate.getMonth() + 1 !== month ||
      inputDate.getDate() !== day
    ) {
      this.showError("Invalid date format in header line.");
      return false;
    }

    if (inputDate > today) {
      this.showError("Date in the header cannot be in the future.");
      return false;
    }
  
    // Validate dynamic spacing: "CMY" + (8 - recordCount length) spaces
    const expectedSpaces = 9 - match[1].length;
    const actualSpaces = firstLine.slice(3, firstLine.indexOf(match[1])).length;
  
    if (actualSpaces !== expectedSpaces) {
      this.showError(`Invalid spacing before record count. Expected ${expectedSpaces} spaces but found ${actualSpaces}.`);
      return false;
    }
  
    if (lines.length - 1 !== recordCount) {
      this.showError(`Expected ${recordCount} records, but found ${lines.length - 1}.`);
      return false;
    }

      // Validate that every record starts with 'D' and contains no spaces
      // Validate that every record starts with 'D', contains no spaces, and only uppercase letters and numbers
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].startsWith('D')) {
          this.showError(`Invalid record format. Every record must start with 'D'. Error at line ${i + 1}.`);
          return false;
        }
        if (lines[i].includes(' ')) {
          this.showError(`Invalid record format. Records must not contain spaces. Error at line ${i + 1}.`);
          return false;
        }
        if (!/^[D[A-Z0-9]+$/.test(lines[i])) {
          this.showError(`Invalid record format. Records must contain only uppercase letters and numbers. Error at line ${i + 1}.`);
          return false;
        }
      }
  
    return true;
  }

  private resetFileInput() {
    this.selectedFile = null;
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = "";
    }
  }
  
  // Helper function for showing error messages
  private showError(message: string) {
    this.resetFileInput();
    this.selectedFile = null;
    this.fileInput.nativeElement.value = "";
    Swal.fire({
      title: "Error!",
      showClass: {
        popup: 'animated fadeInDown faster',
        icon: 'animated heartBeat delay-1s'
      },
      text: message,
      icon: "error",
      confirmButtonText: "OK",
    });
  }

  uploadFile() {
    if (!this.selectedFile) {
         this.selectedFile=null;
        this.fileInput.nativeElement.value = ""; 
          Swal.fire({
            title: 'Error!',
            showClass: {
              popup: 'animated fadeInDown faster',
              icon: 'animated heartBeat delay-1s'
            },
            text: 'No valid file selected for upload.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
      return;
    }
    this.isLoading=true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.userData.uploadTxtFile(formData).subscribe(
      (res:any) => {
        this.isLoading=false;
        this.selectedFile=null;
        this.fileInput.nativeElement.value = "";  
        if(!res.error){
          
          Swal.fire({
              title: 'Info!',
              showClass: {
                popup: 'animated fadeInDown faster',
                icon: 'animated heartBeat delay-1s'
              },
              text: 'Fetching the latest alerts—Thank you for your patience.',
              icon: 'info',
              confirmButtonText: 'OK',
            });
            setTimeout(() => {
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate([this.router.url]);
              });
            }, 1000);
        }else{
          Swal.fire({
            title: 'Error!',
            showClass: {
              popup: 'animated fadeInDown faster',
              icon: 'animated heartBeat delay-1s'
            },
            text: res.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } 
        
      },
      (err) => {
        this.isLoading=false;
       Swal.fire({
        title: 'Error!',
        showClass: {
          popup: 'animated fadeInDown faster',
          icon: 'animated heartBeat delay-1s'
        },
        text: 'File upload failed. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      }
      
    );
  }
}
