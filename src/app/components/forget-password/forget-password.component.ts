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

  ngOnInit(): void {}

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
              icon: 'success',
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

