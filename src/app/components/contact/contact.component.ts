import { Component } from '@angular/core';
import { FrontHeaderComponent } from '../FrontLayout/front-header/front-header.component';
import { FrontFooterComponent } from '../FrontLayout/front-footer/front-footer.component';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/api-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { strictEmailValidator } from '../custom-validator/strict-email.validator';
import { LoaderComponent } from '../layout/common/loader/loader.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule,CommonModule,FrontHeaderComponent,FrontFooterComponent,LoaderComponent],
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
                 // phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/) ]],
                //  phone: ['', [Validators.required, Validators.pattern('^(\\+1\\s?)?\\(?\\d{3}\\)?[-\\s]?\\d{3}[-\\s]?\\d{4}$') ]],
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
                          text: res.message,
                          icon: 'success',
                          confirmButtonText: 'OK',
                        });         
                       
                      }else{
                        this.isLoading=false;
                     
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
                     this.isLoading=false;

                      Swal.fire({
                        title: 'Error!',
                        text: 'Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                      }); 
                    }
                  ); 
                
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
