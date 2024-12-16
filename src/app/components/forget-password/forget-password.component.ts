import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import {strictEmailValidator} from '../custom-validator/strict-email.validator';
import { AuthService } from '../../services/api-service.service';
import Swal from 'sweetalert2';
declare var bootstrap: any; // Needed for Bootstrap Modal

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit {
  forgetForm: FormGroup;
  isResInProg = false;

  constructor(private fb: FormBuilder, private authService: AuthService,) {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, strictEmailValidator()]],
    });
  }

  ngOnInit(): void {}

  onForgetSubmit() {
    //console.log('Password reset request successful:', this.forgetForm.value);
    if (this.forgetForm.valid) {
      this.isResInProg=true;
      this.authService.forgetPassword(this.forgetForm.value).subscribe(
        (res) => {
          if(!res.error){
             
             Swal.fire({
              title: 'Success!',
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
           
            Swal.fire({
              title: 'Error!',
              text: res.message,
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }         
        },
        (err) => {
          this.isResInProg=false;
           
           Swal.fire({
            title: 'Error!',
            text: 'Password reset failed! Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
    } else {
      
          Swal.fire({
            title: 'Error!',
            text: 'Please provide a valid email.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
     
    }
  }
}

