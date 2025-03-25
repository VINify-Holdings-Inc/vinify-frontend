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
                
                  setTimeout(() => {
                    this.modifySwalAttributes();
                  }, 1000);
                
                
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