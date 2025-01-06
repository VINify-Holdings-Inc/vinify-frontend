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
import { strictEmailValidator } from '../../../custom-validator/strict-email.validator';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './user-profile.component.html',
  styleUrls:  ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  SmsIcon: string = 'assets/images/icons/sms.svg';
  userProf: string = 'assets/images/user.jpg';
  profileForm!: FormGroup;
  profileFormEmail!: FormGroup;
  profilePhoto: string | ArrayBuffer | null = null;
  profile:string |null = null;
  userId: string = "";
  profileData :any="";
  eye : boolean=false;
  ceye : boolean=false;
  isPasswordModified: boolean = false;
  proPassword :string="";
  showOther :boolean=false;
  editMode :boolean=false;
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
      //  phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      company: [''],
      title: [''],
      password: [
        '',
        [passwordValidator()],
      ],
      confirmPassword: [''],
    });  
/*
    this.profileForm = this.fb.group({
      name: [{ value: '',disable:true }, [Validators.required]],
      lname: [{ value: '',disable:true }],
      email: [{ value: '',disable:true }],
      company: [{ value: '',disable:true }],
      title: [{ value: '',disable:true }],
      password: [
        { value: '',disable:true },
        [passwordValidator()],
      ],
      confirmPassword: [''],
    }); */

    this.profileFormEmail= this.fb.group({
    
      secondaryEmailId: ['', [Validators.required, strictEmailValidator()]],

    });
   
  
    this.loadUserData();
    
     // Monitor password changes to dynamically set required validators
    this.profileForm.controls['password'].valueChanges.subscribe((value) => { 
      if (value && !this.isPasswordModified && this.proPassword!=value) {  
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
        this.profileForm.patchValue({ confirmPassword: '' });
        // Update validity without triggering another valueChanges event
        this.profileForm.controls['password'].updateValueAndValidity({ emitEvent: false });
        this.profileForm.controls['confirmPassword'].updateValueAndValidity({ emitEvent: false });
      }
  });

  this.toggleFields(false);

}

loadUserData(): void {
  const sessionData = this.sessionService.getSessionData("data");
  const sessionProfile = this.sessionService.getSessionData("profile");
  
  const mockUserData = {
    name: '',
    lname: '',
    email: '',
    //email: sessionData?.email || '',
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
        mockUserData.email = res?.data?.emailId || '';
        mockUserData.title = res?.data?.title || '';
        mockUserData.password = res?.data?.password || '';
        mockUserData.profile = sessionProfile || '';
        mockUserData.secondaryEmailId=res?.data?.secondaryEmailId || "";
        this.proPassword=res?.data?.password || '';
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
      this.profileFormEmail.patchValue(mockUserData);
      
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
    console.log("data",data);
    let sessionData= this.sessionService.getSessionData("data"); 
   
    let updatedData = {...sessionData,...data}
        updatedData = {...updatedData,profile:`${environment.img_url}/${data.profile}`}
       delete updatedData.emailId;
       delete updatedData.userId;
       delete updatedData.id;
   
     this.sessionService.setSessionData("name",data?.firstName + " " + data?.lastName)
     this.sessionService.setSessionData("profile",`${environment.img_url}/${data.profile}`)
    this.sessionService.setSessionData("data",updatedData)
     let new_data ={"name":data?.firstName + " " + data?.lastName,"profile":`${environment.img_url}/${data.profile}`,"profileComplete":data.profileComplete}
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
            this.toggleFields(false);
            Swal.fire({
              title: 'Success!',
              text: response.message,
              icon: 'success',
              confirmButtonText: 'OK',
            });
            this.editMode=false;
            this.isPasswordModified=false;
            this.isLoading = false;
           // this.router.navigate(['/view-user-profile']);
          } else {
            this.isLoading = false;
           
            Swal.fire({
              title: 'Error!',
              text: response.message,
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        
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

    handelOtherEmail(){
      this.showOther=!this.showOther
    }
    handelSave(){
        const secondaryEmailId = this.profileFormEmail.get('secondaryEmailId')?.value;
        console.log("secondaryEmailId",secondaryEmailId);
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
               
              },
              error: (error) => {
                this.isLoading = false;
                Swal.fire({
                  title: 'Error!',
                  text: 'Failed to update profile. Please try again.',
                  icon: 'error',
                  confirmButtonText: 'OK',
                });
         
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

       

   toggleFields(data:boolean): void {
     if (data) {
      this.profileForm.controls['email'].disable();
      this.profileForm.controls['name'].enable();
      this.profileForm.controls['lname'].enable(); 
      this.profileForm.controls['title'].enable(); 
      this.profileForm.controls['company'].enable();
      this.profileForm.controls['password'].enable(); 
    } else {
      this.profileForm.controls['email'].disable();
      this.profileForm.controls['name'].disable();
      this.profileForm.controls['lname'].disable(); 
      this.profileForm.controls['title'].disable(); 
      this.profileForm.controls['company'].disable();
      this.profileForm.controls['password'].disable(); 
    }
  }

  editModeFun(data:boolean){
    this.editMode=data;
    this.toggleFields(data);
   } 

}
