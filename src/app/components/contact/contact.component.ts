import { Component } from '@angular/core';
import { FrontHeaderComponent } from '../header-footer/front-header/front-header.component';
import { FrontFooterComponent } from '../header-footer/front-footer/front-footer.component';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/api-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { strictEmailValidator } from '../custom-validator/strict-email.validator';
import { LoaderComponent } from '../layout/common/loader/loader.component';
import Swal from 'sweetalert2';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule,CommonModule,FrontHeaderComponent,FrontFooterComponent,LoaderComponent,NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  logo: string = 'assets/images/logo.png';
 isLoading:boolean=false;
  contactForm: FormGroup;
             constructor(private fb: FormBuilder,              
              
              private authService: AuthService,
              private router: Router,
          
              ){
                
            
                this.contactForm = this.fb.group({
                  name: ['', [Validators.required, ]],
                  subject: ['', [Validators.required, ]],
                  message: ['', [Validators.required, ]],
                  email: ['', [Validators.required,strictEmailValidator() ]], 
                  phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
                 });
              }

              onSubmit(){
                if (this.contactForm.valid) {
                  this.isLoading=true;
                                 
                  this.authService.sendContactUsMessage(this.contactForm.value).subscribe(
                    (res:any) => {
                     
                      if(!res.error){
                         
                        this.contactForm.reset({
                          name: '',
                          email: '',
                          phone: '',
                          subject: '',
                          message: '',
                        });
                
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
                       
                      }else{
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
                   
                     this.isLoading=false;

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
                
                } else {
                  Swal.fire({
                    title: 'Error!',
                    showClass: {
                      popup: 'animated fadeInDown faster',
                      icon: 'animated heartBeat delay-1s'
                    },
                    text: 'Please fill out the form correctly.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                  }); 
                }
            }       

}
