import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/api-service.service';
import { SessionService } from '../../../../services/session.service';
import { LoaderComponent } from '../../common/loader/loader.component';
import { environment } from '../../../../../environments/environment';
import Swal from 'sweetalert2';
import {ProfileService} from '../../../../services/state-management';
import {passwordValidator} from '../../../custom-validator/password-validator';
import { Router } from '@angular/router';  // Import Router

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './user-profile.component.html',
  styleUrls:  ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  profilePhoto: string | ArrayBuffer | null = null;
  profile:string |null = null;
  userId: string = "";
  profileData :any="";
  eye : boolean=false;
  ceye : boolean=false;
  isPasswordModified: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private sessionService: SessionService,
    private profileService: ProfileService,
    private router: Router,){
              this.profileData = this.profileService.getInitialProfileData()                   
    }

  isLoading: boolean = false;

  ngOnInit(): void {
    this.userId = this.sessionService.getSessionData("memberId") || "";

    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      lname: [''],
      email: [{ value: '',disable:true }],
     // phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
   //  phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      company: [''],
      title: [''],
   //   address: [''],
      password: [
        '',
        [passwordValidator()],
      ],
      confirmPassword: [''],

    });

   
  
    this.loadUserData();
    
     // Monitor password changes to dynamically set required validators
    this.profileForm.controls['password'].valueChanges.subscribe((value) => {
      if (value && !this.isPasswordModified) {
        this.isPasswordModified = true;
        this.profileForm.controls['password'].setValidators([
          Validators.required,
          passwordValidator(),
        ]);
        this.profileForm.controls['confirmPassword'].setValidators([Validators.required]);

        // Ensure the update doesn't trigger another valueChanges event
        this.profileForm.controls['password'].updateValueAndValidity({ emitEvent: false });
        this.profileForm.controls['confirmPassword'].updateValueAndValidity({ emitEvent: false });
      } else if (!value && this.isPasswordModified) {
        this.isPasswordModified = false;
        this.profileForm.controls['password'].clearValidators();
        this.profileForm.controls['confirmPassword'].clearValidators();

        // Update validity without triggering another valueChanges event
        this.profileForm.controls['password'].updateValueAndValidity({ emitEvent: false });
        this.profileForm.controls['confirmPassword'].updateValueAndValidity({ emitEvent: false });
      }
  });

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
       this.profile = URL.createObjectURL(file);
       this.profilePhoto = e.target?.result || null;
      };
      reader.readAsArrayBuffer(file); // Read as ArrayBuffer directly
      
    } else {
      this.profilePhoto = null;
      this.profile = this.sessionService.getSessionData("profile")
    }
  }

  updateSessionData(data:any):void{

    let sessionData= this.sessionService.getSessionData("data"); 
   
    let updatedData = {...sessionData,...data}
        updatedData = {...updatedData,profile:`${environment.img_url}/${data.profile}`}
       delete updatedData.emailId;
       delete updatedData.userId;
       delete updatedData.id;
   
     this.sessionService.setSessionData("name",data.name)
     this.sessionService.setSessionData("profile",`${environment.img_url}/${data.profile}`)
    this.sessionService.setSessionData("data",updatedData)
     let new_data ={"name":data.name,"profile":`${environment.img_url}/${data.profile}`}
    this.profileService.updateProfileData({...this.profileData,...new_data});

  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const formData = new FormData();
      //console.log("test",this.isPasswordModified);
      // Populate FormData
      if(this.isPasswordModified){
        if(this.profileForm.value.password !== this.profileForm.value.confirmPassword){
           Swal.fire({
                      title: 'Error!',
                      text: 'Password and confirm password do not match.',
                      icon: 'error',
                      confirmButtonText: 'OK',
                    });
          this.isLoading = false;
          return ;
        }
      }
      formData.append('userId', this.userId);
      formData.append('firstName', this.profileForm.value.name);
      formData.append('lastName', this.profileForm.value.lname);
      formData.append('emailId', this.profileForm.value.email);
      //formData.append('phoneNumber', this.profileForm.value.phone);
      formData.append('companyId', this.profileForm.value.company);
      formData.append('title', this.profileForm.value.title);
      //formData.append('address', this.profileForm.value.address);
      if(this.isPasswordModified){
        //console.log("isPassword");
        formData.append('password', this.profileForm.value.password);
      }

      if (this.profilePhoto) {
        const blob = new Blob([this.profilePhoto as ArrayBuffer], { type: 'image/jpeg' });
        formData.append('profile', blob, 'profile.jpg');
      }
      
     
     // console.log('FormData payload:', formData);

      this.authService.updateProfile(formData).subscribe({
        next: (response) => {
          if (!response.error) {
            this.isLoading = false;
            this.updateSessionData(response?.data);
           
            Swal.fire({
              title: 'Success!',
              text: response.message,
              icon: 'success',
              confirmButtonText: 'OK',
            });
            this.isPasswordModified=false;
            this.router.navigate(['/view-user-profile']);
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

    showPwd(){
      this.eye=!this.eye;
    }
    showConfirmPwd(){
      this.ceye=!this.ceye;
    }

}
