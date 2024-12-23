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


@Component({
  selector: 'app-view-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent,RouterLink],
 templateUrl: './view-user-profile.component.html',
  styleUrl: './view-user-profile.component.css'
})
export class ViewUserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  profilePhoto: string | ArrayBuffer | null = null;
  profile:string |null = null;
  userId: string = "";
  profileData :any="";
  eye :boolean=false;
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
          });


    this.loadUserData();

    

}

  loadUserData(): void {
   
    const sessionData = this.sessionService.getSessionData("data");
    const sessionProfile = this.sessionService.getSessionData("profile");

    console.log(sessionData);
    const mockUserData = {
      name: sessionData.name || "",
      lname: sessionData.lname || "",
      email: sessionData.email || "",
      phone: sessionData.phoneNumber || "",
      company: sessionData.company || "",
      title: sessionData.title || "",
      address: sessionData.address || "",
      password: sessionData.password || "",
      profilePhoto:  null ,
      profile: sessionProfile || null 
    };

    this.profileForm.patchValue(mockUserData);
    this.profile = mockUserData.profile;
    this.isLoading=false;
  }

 
    showPwd(){
      this.eye=!this.eye;
    }
   

}
