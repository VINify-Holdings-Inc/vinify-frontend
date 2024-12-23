import { CommonModule, JsonPipe } from '@angular/common';
import { Component ,OnInit,ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/api-service.service'; 
import { SessionService } from '../../services/session.service'
import { Router } from '@angular/router';  // Import Router
import {strictEmailValidator} from '../custom-validator/strict-email.validator'
import {passwordValidator} from '../custom-validator/password-validator';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Corrected typo: `styleUrl` -> `styleUrls`
  imports: [ReactiveFormsModule, CommonModule,ForgetPasswordComponent],
})
export class LoginComponent {
 
  eye : boolean = false;
 
  logo: string = 'assets/images/ta-logo.png';
  vehicleImg: string = 'assets/images/login-bg.png';
  gasImg: string = 'assets/images/icons/gas-station.png';
  carImg: string = 'assets/images/icons/car.png';
  settingImg: string = 'assets/images/icons/settings.png';
  parkingImg: string = 'assets/images/icons/parking.png';

  loginForm: FormGroup;
  isResInProgLogin :boolean=false; 

  constructor(private fb: FormBuilder, 
              private authService: AuthService,
              private sessionService: SessionService,
              private router: Router,
               ) {
             
     this.loginForm = this.fb.group({
      //email: ['', [Validators.required, Validators.email]],
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
      this.isResInProgLogin=true;
      this.authService.login(this.loginForm.value).subscribe(
        (res:any) => {
          console.log('Login successful:', res);
         
          if(!res.error){
            this.sessionService.setSessionData("email",res.data.email);
            this.sessionService.setSessionData("token",res.data.token);
            this.sessionService.setSessionData("memberId",res.data.memberId);
            this.sessionService.setSessionData("name",res.data.name);
            this.sessionService.setSessionData("profile",res.data.profile ? `${environment.img_url}/${res.data.profile}` :"assets/images/user.jpg");
            
            this.sessionService.setSessionData("data",res.data);
            localStorage.setItem('profileData', JSON.stringify({"name":res.data.name,"profile":res.data.profile ? `${environment.img_url}/${res.data.profile}` :"assets/images/user.jpg"}));
            this.isResInProgLogin=false;
            this.router.navigate(['/dashboard']);
          }else{
            this.isResInProgLogin=false;
           
            Swal.fire({
              title: 'Error!',
              text: res.message,
              icon: 'error',
              confirmButtonText: 'OK',
            });

          }
        },
        (err) => {
       
          this.isResInProgLogin=false;
         
          Swal.fire({
            title: 'Error!',
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
        confirmButtonText: 'OK',
      });
    }
  }

  showPwd(){
    this.eye=!this.eye;
  }

}
