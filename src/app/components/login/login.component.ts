import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/api-service.service'; 
import { SessionService } from '../../services/session.service'
import { Router } from '@angular/router';  // Import Router
import {strictEmailValidator} from '../custom-validator/strict-email.validator'
import {passwordValidator} from '../custom-validator/password-validator';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { LoaderComponent } from "../layout/common/loader/loader.component";

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], 
  imports: [ReactiveFormsModule, CommonModule, ForgetPasswordComponent, LoaderComponent],
})
export class LoginComponent {
 
  eye : boolean = false;
  isLoading : boolean=false;
  logo: string = 'assets/images/ta-logo.png';
  vehicleImg: string = 'assets/images/login-bg.png'; 
  gasImg: string = 'assets/images/icons/login-icon/gas-station.svg';
  carImg: string = 'assets/images/icons/login-icon/car.svg';
  settingImg: string = 'assets/images/icons/login-icon/setting.svg';
  parkingImg: string = 'assets/images/icons/login-icon/parking.svg';
  checkCircle: string = 'assets/images/icons/check-circle.svg';

  loginForm: FormGroup;
  isResInProgLogin :boolean=false; 

  constructor(private fb: FormBuilder, 
              private authService: AuthService,
              private sessionService: SessionService,
              private router: Router,
               ) {
             
     this.loginForm = this.fb.group({
      email: ['', [Validators.required, strictEmailValidator()]],
      password: [
        '',
        [
          Validators.required,
          passwordValidator(),
        ],
      ],
    });
    
  }

  ngOnInit(): void {
    // Check if the user is already logged in
    if (this.sessionService.isLoggedIn()) {
      // If logged in, redirect to the dashboard
      this.router.navigate(['/dashboard']);
    }
  }
  
  

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading =true;
      this.isResInProgLogin=true;
      this.authService.login(this.loginForm.value).subscribe(
        (res:any) => {
                  
          if(!res.error){
            this.isLoading =false;
            this.sessionService.setSessionData("email",res.data.email);
            this.sessionService.setSessionData("token",res.data.token);
            this.sessionService.setSessionData("memberId",res.data.memberId);
            this.sessionService.setSessionData("name",res.data?.firstName +" "+ res.data?.lastName);
            this.sessionService.setSessionData("profile",res.data.profile ? `${environment.img_url}/${res.data.profile}` :"assets/images/user.jpg");
            this.sessionService.setSessionData("data",res.data);
       
            localStorage.setItem('profileData', JSON.stringify({"name":res.data?.firstName+ " "+res.data?.lastName ,"email":res.data.email,"profile":res.data.profile ? `${environment.img_url}/${res.data.profile}` :"assets/images/user.jpg"}));
            this.isResInProgLogin=false;
            this.router.navigate(['/dashboard']);
          }else{
            this.isResInProgLogin=false;
            this.isLoading =false;
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
       
          this.isResInProgLogin=false;
          this.isLoading =false;
          Swal.fire({
            title: 'Error!',
            showClass: {
              popup: 'animated fadeInDown faster',
              icon: 'animated heartBeat delay-1s'
            },
            text: 'Login failed! Please try again.',
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
        showClass: {
          popup: 'animated fadeInDown faster',
          icon: 'animated heartBeat delay-1s'
        },
        confirmButtonText: 'OK',
      });
    }
  }

  showPwd(){
    this.eye=!this.eye;
  }

}
