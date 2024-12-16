import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/api-service.service';
import { SessionService } from '../../../services/session.service';
import { LoaderComponent } from '../common/loader/loader.component';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import {ProfileService} from '../../../services/state-management';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  profilePhoto: string | ArrayBuffer | null = null;
  profile:string |null = null;
  userId: string = "";
  profileData :any="";
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private sessionService: SessionService,private profileService: ProfileService){
      this.profileData = this.profileService.getInitialProfileData()                   
    }

  isLoading: boolean = false;

  ngOnInit(): void {
    this.userId = this.sessionService.getSessionData("memberId") || "";

    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: [{ value: '', disabled: true }],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      company: [''],
      title: [''],
      address: ['']
    });

    this.loadUserData();
  }

  loadUserData(): void {
    const sessionData = this.sessionService.getSessionData("data");
    const sessionProfile = this.sessionService.getSessionData("profile");
    const mockUserData = {
      name: sessionData.name || "",
      email: sessionData.email || "",
      phone: sessionData.phoneNumber || "",
      company: sessionData.company || "",
      title: sessionData.title || "",
      address: sessionData.address || "",
      profilePhoto:  null ,
      profile: sessionProfile || null 
    };

    this.profileForm.patchValue(mockUserData);
    this.profile = mockUserData.profile;
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
      this.profile = null;
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
      
      // Populate FormData
      formData.append('userId', this.userId);
      formData.append('name', this.profileForm.value.name);
      formData.append('phoneNumber', this.profileForm.value.phone);
      formData.append('company', this.profileForm.value.company);
      formData.append('title', this.profileForm.value.title);
      formData.append('address', this.profileForm.value.address);

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
