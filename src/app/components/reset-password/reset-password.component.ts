import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService } from '../../services/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/api-service.service';
import { FrontHeaderComponent } from '../header-footer/front-header/front-header.component';
import { FrontFooterComponent } from '../header-footer/front-footer/front-footer.component';
import Swal from 'sweetalert2';
import {passwordValidator} from '../custom-validator/password-validator';
import { LoaderComponent } from '../layout/common/loader/loader.component';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule,FrontHeaderComponent,FrontFooterComponent,LoaderComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  logo: string = 'assets/images/logo.png';
  token : string | null = null;
  eye : boolean=false;
  ceye : boolean=false;
  isLoading : boolean=false;
  isValid :boolean=false;
  message : string ="";
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
                
                });
                this.checkToken();
              }
            checkToken(){
              this.isLoading= true;
                
              this.authService.checkTokenData({"token":this.token}).subscribe(
                (res:any) => {
                  this.isLoading= false;                     
                  if(!res.error){
                    this.isValid=true;
                    this.message="";
                  }else{
                  
                    this.message=res.message;
                   
                  }
                },
                (err) => {
                
                 this.isLoading= false; 
                  Swal.fire({
                    title: 'Error!',
                    showClass: {
                      popup: 'animated fadeInDown faster',
                      icon: 'animated heartBeat delay-1s'
                    },
                    text: 'Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                  });
                }
              );     
            }  
              onSubmit() {
                
                if (this.resetForm.valid) {
                 
                  let formData  = this.resetForm.value;
                  if(formData.password == formData.confirmPassword){
                    this.isLoading= true;
                    let resetdata = {
                      "password" : formData.password,
                      "token" :this.token 

                    }
                  this.authService.resetPwd(resetdata).subscribe(
                    (res:any) => {
                      this.isLoading= false;                     
                      if(!res.error){
                        
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
                        this.router.navigate(['/']);
                      }else{
                        this.isLoading= false; 
                        Swal.fire({
                          title: 'Error!',
                          text: res.message,
                          showClass: {
                            popup: 'animated fadeInDown faster',
                            icon: 'animated heartBeat delay-1s'
                          },
                          icon: 'error',
                          confirmButtonText: 'OK',
                        }); 
                      }
                    },
                    (err) => {
                    
                     this.isLoading= false; 
                      Swal.fire({
                        title: 'Error!',
                        text: 'Please try again.',
                        showClass: {
                          popup: 'animated fadeInDown faster',
                          icon: 'animated heartBeat delay-1s'
                        },
                        icon: 'error',
                        confirmButtonText: 'OK',
                      });
                    }
                  );
                  
                  }else{
                   
                    Swal.fire({
                      title: 'Error!',
                      showClass: {
                        popup: 'animated fadeInDown faster',
                        icon: 'animated heartBeat delay-1s'
                      },
                      text: 'Password and confirm password do not match.',
                      icon: 'error',
                      confirmButtonText: 'OK',
                    });
                  }
                } else {
                  
                  Swal.fire({
                    title: 'Error!',
                    text: 'Please fill out the form correctly.',
                    showClass: {
                      popup: 'animated fadeInDown faster',
                      icon: 'animated heartBeat delay-1s'
                    },
                    icon: 'error',
                    confirmButtonText: 'OK',
                  });
                }
              }

  showPwd(){
    this.eye=!this.eye;
  }
  showConfirmPwd(){
    this.ceye=!this.ceye;
  }          

}