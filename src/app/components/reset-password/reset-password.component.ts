import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService } from '../../services/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/api-service.service';
import { FrontHeaderComponent } from '../FrontLayout/front-header/front-header.component';
import { FrontFooterComponent } from '../FrontLayout/front-footer/front-footer.component';
import Swal from 'sweetalert2';
import {passwordValidator} from '../custom-validator/password-validator';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule,FrontHeaderComponent,FrontFooterComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  logo: string = 'assets/images/logo.png';
  token : string | null = null;
  resetForm: FormGroup;
             constructor(private fb: FormBuilder,              
              private sessionService: SessionService,
              private authService: AuthService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              ){
                
                this.resetForm = this.fb.group({
                  password: [
                    '',
                    [
                      Validators.required,
                      passwordValidator(),
                    ],
                  ],
                  confirmPassword: ['', [Validators.required, ]],
                });
              }

              ngOnInit(): void {
                
                // Check if the user is already logged in
                if (this.sessionService.isLoggedIn()) {
                  // If logged in, redirect to the dashboard
                  this.router.navigate(['/dashboard']);
                }
                this.activeRoute.paramMap.subscribe((params) => {
                  this.token=params.get('token');
                  //console.log('Token:', this.token);
                });
              }

              onSubmit() {
                if (this.resetForm.valid) {
                  console.log("test",this.resetForm.value);
                  let formData  = this.resetForm.value;
                  if(formData.password == formData.confirmPassword){
                    let resetdata = {
                      "password" : formData.password,
                      "token" :this.token 

                    }
                  this.authService.resetPwd(resetdata).subscribe(
                    (res:any) => {
                      console.log('Login successful:', res);
                     
                      if(!res.error){
                        
                        Swal.fire({
                          title: 'Success!',
                          text: res.message,
                          icon: 'success',
                          confirmButtonText: 'OK',
                        });           
                        this.router.navigate(['/']);
                      }else{
                       
                        Swal.fire({
                          title: 'Error!',
                          text: res.message,
                          icon: 'error',
                          confirmButtonText: 'OK',
                        }); 
                      }
                    },
                    (err) => {
                     // console.error('failed:', err);
                     
                      Swal.fire({
                        title: 'Error!',
                        text: 'Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                      });
                    }
                  );
                  
                  }else{
                   
                    Swal.fire({
                      title: 'Error!',
                      text: 'Password and confirm password do not match.',
                      icon: 'error',
                      confirmButtonText: 'OK',
                    });
                  }
                } else {
                  
                  Swal.fire({
                    title: 'Error!',
                    text: 'Please fill out the form correctly.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                  });
                }
              }


}