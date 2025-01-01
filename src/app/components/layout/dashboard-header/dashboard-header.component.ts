import { Component, Output, EventEmitter,OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../../../services/session.service';
import { Router,RouterLink } from '@angular/router';
import { ProfileService } from '../../../services/state-management';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dashboard-header',
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css'
})
export class DashboardHeaderComponent implements OnInit , OnDestroy {
  searchIconToggle:boolean=true
  logo: string = 'assets/images/ta-logo.png';
  profileIcon: string = 'assets/images/icons/sub-profile.svg';
  arrowIcon: string = 'assets/images/icons/down-arrow.svg';
  searchIcon: string = 'assets/images/icons/vin-search.svg';
  logIcon: string = 'assets/images/icons/log-out.svg';
  notifications: string = 'assets/images/icons/bell.png';
  @Output() sidebarToggle = new EventEmitter<void>();
  private subscription!: Subscription; // To manage subscription lifecycle
  constructor(private sessionServies: SessionService, private router : Router,private profileService: ProfileService){
    this.profileData = this.profileService.getInitialProfileData()                   
  }
  profileData: any;
  userName : string="";
  profile : string ="";
  searchValue :string="";
  toggleSidebar() {
    
    this.sidebarToggle.emit();
  }

 logout(){
  this.sessionServies.clearSession();
  this.router.navigate(['']);
  
 }


 ngOnInit() {
  // Subscribe to the profile data observable
  this.subscription = this.profileService.profileData$.subscribe((data) => {
    this.profileData = data; // Update local variable when data changes
    this.userName = data.name; // Dynamically update userName
    this.profile = data.profile; // Dynamically update profile
  });
}

 ngOnDestroy() {
   // Clean up the subscription to avoid memory leaks
   if (this.subscription) {
     this.subscription.unsubscribe();
   }
 }
 changeSearchIcon=()=>{
    this.searchIconToggle=!this.searchIconToggle
    //  alert(this.searchIconToggle)
 }

 getSearchVal(){
  if(this.searchValue!=""){
    console.log(this.searchValue)
    //const data = { vin: this.searchValue }; // Data to send
    const timestamp = new Date().getTime(); 
   // this.router.navigateByUrl('/user-summary-list', { state: data });
    this.router.navigate(['/user-summary-list'], { queryParams: { vin: this.searchValue, refresh: timestamp }}).then(() => {
      // You can trigger additional actions after navigation
      console.log('Navigation complete');
    });
  }
}

}

 
