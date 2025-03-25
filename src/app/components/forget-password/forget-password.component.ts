import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import {strictEmailValidator} from '../custom-validator/strict-email.validator';
import { AuthService } from '../../services/api-service.service';
import Swal from 'sweetalert2';
import { LoaderComponent } from '../layout/common/loader/loader.component';
declare var bootstrap: any; // Needed for Bootstrap Modal

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule,CommonModule,LoaderComponent],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit {
  forgetForm: FormGroup;
  isResInProg = false;
  isLoading : boolean=false;

  constructor(private fb: FormBuilder, private authService: AuthService,) {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, strictEmailValidator()]],
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.modifySwalAttributes();
    }, 1000);
  }


  modifySwalAttributes() {
    const observer = new MutationObserver(() => {
     document.querySelectorAll('.swal2-image').forEach(img => {
        if (!(img as HTMLImageElement).alt) {
          (img as HTMLImageElement).alt = 'image'; 
        }
      });
    document.querySelectorAll('.swal2-input').forEach(input => {
        if (!(input as HTMLInputElement).id) {
          (input as HTMLInputElement).id = 'swal2-input';
          (input as HTMLInputElement).setAttribute('aria-label', 'swal2-input');
        }
      });
      document.querySelectorAll('.swal2-range input ').forEach(input => {
        if (!(input as HTMLInputElement).id) {
          (input as HTMLInputElement).id = 'swal2-range-input';
          (input as HTMLInputElement).setAttribute('aria-label', 'swal2-range-input');
        }
      });
      document.querySelectorAll('.swal2-file').forEach(fileInput => {
        if (!(fileInput as HTMLInputElement).id) {
          (fileInput as HTMLInputElement).id = 'swal2-file';
          (fileInput as HTMLInputElement).setAttribute('aria-label', 'swal2-file');
        }
      });
      document.querySelectorAll('.swal2-select').forEach(fileInput => {
        if (!(fileInput as HTMLInputElement).id) {
          (fileInput as HTMLInputElement).id = 'swal2-select';
          (fileInput as HTMLInputElement).setAttribute('aria-label', 'swal2-select');
        }
      });
    document.querySelectorAll('.swal2-textarea').forEach(fileInput => {
        if (!(fileInput as HTMLInputElement).id) {
          (fileInput as HTMLInputElement).id = 'swal2-textarea';
          (fileInput as HTMLInputElement).setAttribute('aria-label', 'swal2-textarea');
        }
      });
    document.querySelectorAll('.swal2-textarea').forEach(fileInput => {
        if (!(fileInput as HTMLInputElement).id) {
          (fileInput as HTMLInputElement).id = 'swal2-textarea';
          (fileInput as HTMLInputElement).setAttribute('aria-label', 'swal2-textarea');
        }
      }); 
     document.querySelectorAll('.swal2-checkbox').forEach(label => {
        if (label.textContent !== '.') {
          label.textContent = '.';   
        }
      }); 

    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  onForgetSubmit() {
    
    if (this.forgetForm.valid) {
      this.isLoading=true;
      this.isResInProg=true;
      this.authService.forgetPassword(this.forgetForm.value).subscribe(
        (res) => {
          if(!res.error){
            this.isLoading=false;
             Swal.fire({
              title: 'Success!',
              showClass: {
                popup: 'animated fadeInDown faster',
                icon: 'animated heartBeat delay-1s'
              },
              text: res.message,
              icon: 'info',
              confirmButtonText: 'OK',
            });
             this.forgetForm.reset({
              email: '',
             });
             this.isResInProg=false;
             const modalElement = document.getElementById('forgetModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide(); // Close the modal
          }else{
            this.isResInProg=false;
            this.isLoading=false;
           
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
          this.isResInProg=false;
          this.isLoading=false; 
           Swal.fire({
            title: 'Error!',
            showClass: {
              popup: 'animated fadeInDown faster',
              icon: 'animated heartBeat delay-1s'
            },
            text: 'Password reset failed! Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
    } else {
      this.isLoading=false;
          Swal.fire({
            title: 'Error!',
            showClass: {
              popup: 'animated fadeInDown faster',
              icon: 'animated heartBeat delay-1s'
            },
            text: 'Please provide a valid email.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
     
    }
  }
}

