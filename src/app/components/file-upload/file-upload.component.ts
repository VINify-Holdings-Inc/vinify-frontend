import { Component, ViewChild, ElementRef, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../layout/common/loader/loader.component';
import { userData } from '../../services/api-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule,LoaderComponent],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  constructor(private userData : userData,){}
  @ViewChild('fileInput') fileInput!: ElementRef;
  errorMessage: WritableSignal<string | null> = signal(null);
  successMessage: WritableSignal<string | null> = signal(null);
  selectedFile: File | null = null;
  isLoading : boolean=false;
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      //this.errorMessage.set('No file selected');
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
     // this.errorMessage.set('Invalid file name. It must be MY.T.CINQ.INPUT.TXT');
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

  validateFileContent(content: string): boolean {
    const lines = content.split('\n').map((line) => line.trim());

    if (lines.length < 2) {
      //this.errorMessage.set('Invalid file format. CMY record or data records are missing.');
      Swal.fire({
        title: 'Error!',
        showClass: {
          popup: 'animated fadeInDown faster',
          icon: 'animated heartBeat delay-1s'
        },
        text: 'Invalid file format. CMY record or data records are missing.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return false;
    }

    const firstLine = lines[0];
    if (!firstLine.startsWith('CMY')) {
      //this.errorMessage.set('File must start with "CMY".');
      Swal.fire({
        title: 'Error!',
        showClass: {
          popup: 'animated fadeInDown faster',
          icon: 'animated heartBeat delay-1s'
        },
        text: 'File must start with "CMY".',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return false;
    }

    const parts = firstLine.split(/\s+/); // Split by spaces
    if (parts.length < 2) {
      //console.error("Invalid format, missing second part.");
      Swal.fire({
        title: 'Error!',
        showClass: {
          popup: 'animated fadeInDown faster',
          icon: 'animated heartBeat delay-1s'
        },
        text: 'Invalid format',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return false;
    }

    const recordInfo = parts[1]; 

    const recordCount = parseInt(recordInfo.substring(0, recordInfo.length - 8).trim(), 10);


   // const recordCount = parseInt(firstLine.charAt(11).trim(), 10);
    const datePart = firstLine.slice(-8);
   // console.log("recordCount",recordCount,datePart,lines.length);

    if (isNaN(recordCount) || isNaN(Number(datePart))) {
     // this.errorMessage.set('Invalid record count or date format.');
     Swal.fire({
      title: 'Error!',
      showClass: {
        popup: 'animated fadeInDown faster',
        icon: 'animated heartBeat delay-1s'
      },
      text: 'Invalid record count or date format.',
      icon: 'error',
      confirmButtonText: 'OK',
    });
      return false;
    }

    if (lines.length - 1 !== recordCount) {
       //this.errorMessage.set(`Expected ${recordCount} records, but found ${lines.length - 1}.`);
       Swal.fire({
        title: 'Error!',
        showClass: {
          popup: 'animated fadeInDown faster',
          icon: 'animated heartBeat delay-1s'
        },
        text: `Expected ${recordCount} records, but found ${lines.length - 1}.`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return false;
    }
    // console.log("recordCount",recordCount,lines.length-1);

     //  this.successMessage.set('File is valid! Ready to upload.');
    return true;
  }

  uploadFile() {
    if (!this.selectedFile) {
          //this.errorMessage.set('No valid file selected for upload.');
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
         //this.successMessage.set('File uploaded successfully!'); 
         Swal.fire({
          title: 'Info!',
          showClass: {
            popup: 'animated fadeInDown faster',
            icon: 'animated heartBeat delay-1s'
          },
          text: res.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
      },
      (err) => {
       // this.errorMessage.set('File upload failed. Please try again.');
       Swal.fire({
        title: 'Info!',
        showClass: {
          popup: 'animated fadeInDown faster',
          icon: 'animated heartBeat delay-1s'
        },
        text: 'File upload failed. Please try again.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      }
      
    );
  }
}
