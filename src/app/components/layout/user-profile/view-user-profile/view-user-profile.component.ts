import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/api-service.service';
import { SessionService } from '../../../../services/session.service';
import { LoaderComponent } from '../../common/loader/loader.component';
import { environment } from '../../../../../environments/environment';
import Swal from 'sweetalert2';
import {ProfileService} from '../../../../services/state-management';
import { RouterLink } from '@angular/router';
import { strictEmailValidator } from '../../../custom-validator/strict-email.validator';



@Component({
  selector: 'app-view-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent,RouterLink],
 templateUrl: './view-user-profile.component.html',
  styleUrl: './view-user-profile.component.css'
})
export class ViewUserProfileComponent implements OnInit {
  SmsIcon: string = 'assets/images/icons/sms.svg';
  profileForm!: FormGroup;
  profilePhoto: string | ArrayBuffer | null = null;
  profile:string |null = null;
  userId: string = "";
  profileData :any="";
  eye :boolean=false;
  showOther :boolean=false;
  emailSecond:string="";
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private sessionService: SessionService,private profileService: ProfileService){
      this.profileData = this.profileService.getInitialProfileData()                   
    }

  isLoading: boolean = true;

  ngOnInit(): void {
    
    this.userId = this.sessionService.getSessionData("memberId") || "";

      this.profileForm = this.fb.group({
           name: [{ value: '', disabled: true }],
           lname: [{ value: '', disabled: true }],
           email: [{ value: '', disabled: true }],
           phone: [{ value: '', disabled: true }],
           company: [{ value: '', disabled: true }],
           title: [{ value: '', disabled: true }],
           address: [{ value: '', disabled: true }],
           password: [{ value: '', disabled: true }],
           secondaryEmailId: ['', [Validators.required, strictEmailValidator()]],
          });

    this.loadUserData();
}
  
  loadUserData(): void {
    const sessionData = this.sessionService.getSessionData("data");
    const sessionProfile = this.sessionService.getSessionData("profile");
    
    const mockUserData = {
      name: '',
      lname: '',
      email: sessionData?.email || '',
      secondaryEmailId:  '',
      company: '',
      title: '',
      password: '',
      profilePhoto: null,
      profile: sessionProfile || null,
      
    };
  
    this.isLoading = true; // Ensure the loading state is set correctly
    this.authService.getProfileData(sessionData?.email).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (!res.error) {
          mockUserData.name = res?.data?.firstName || '';
          mockUserData.lname = res?.data?.lastName || '';
          mockUserData.company = res?.data?.companyId || '';
          mockUserData.title = res?.data?.title || '';
          mockUserData.password = res?.data?.password || '';
          mockUserData.profile = sessionProfile || '';
          mockUserData.secondaryEmailId=res?.data?.secondaryEmailId || "";
         
        }
      },
      (err) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Error!',
          text: 'Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
      () => {
       
        this.profileForm.patchValue(mockUserData);
        this.profile = mockUserData.profile;
      }
    );
   
  }

 
    showPwd(){
      this.eye=!this.eye;
    }

    handelOtherEmail(){
      this.showOther=!this.showOther
    }

  handelSave(){
    const secondaryEmailId = this.profileForm.get('secondaryEmailId')?.value;
      if (secondaryEmailId) {
        this.isLoading = true;
        const formData = new FormData();
              
        formData.append('userId', this.userId);
        formData.append('secondaryEmailId', secondaryEmailId);
         
        this.authService.updateProfile(formData).subscribe({
          next: (response) => {
            if (!response.error) {
              this.isLoading = false;
           
             
              Swal.fire({
                title: 'Success!',
                text: response.message,
                icon: 'success',
                confirmButtonText: 'OK',
              });
           
            } else {
              this.isLoading = false;
             
              Swal.fire({
                title: 'Error!',
                text: response.message,
                icon: 'error',
                confirmButtonText: 'OK',
              });
            }
           // console.log('Server Response:', response);
          },
          error: (error) => {
            this.isLoading = false;
            Swal.fire({
              title: 'Error!',
              text: 'Failed to update profile. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          //  console.error('Error:', error);
          }
        });
      } else {
       
        Swal.fire({
          title: 'Error!',
          text: 'Please fill out the required fields correctly.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
   

}
