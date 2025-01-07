import { Component, Output, EventEmitter,OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../../../services/session.service';
import { Router,RouterLink } from '@angular/router';
import { ProfileService } from '../../../services/state-management';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { userData } from '../../../services/api-service.service';
import { DateFormatPipe } from '../../../pipes/date-format.pipe';
@Component({
  selector: 'app-dashboard-header',
  imports: [RouterLink,CommonModule,FormsModule,DateFormatPipe],
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
  constructor(private sessionServies: SessionService, private router : Router,private profileService: ProfileService,private userData: userData,){
    this.profileData = this.profileService.getInitialProfileData()  ;
    this.userEmail=JSON.parse(localStorage.getItem("profileData")||"")?.email;
    
  }
  profileData: any;
  userName : string="";
  profile : string ="";
  searchValue :string="";
  userEmail:string="";
  profileComplete:string="";
  toggleSidebar() { 
    this.sidebarToggle.emit();
  }

 logout(){
  this.sessionServies.clearSession();
  localStorage.clear();
  this.router.navigate(['']);
  
 }

 member: string = "";

 ngOnInit() {
  // Subscribe to the profile data observable
  this.subscription = this.profileService.profileData$.subscribe((data) => {
    this.profileData = data; // Update local variable when data changes
    this.userName = data.name; // Dynamically update userName
    this.profile = data.profile; // Dynamically update profile
    this.profileComplete = data.profileComplete; // Dynamically update profile
  });
  this.member = this.sessionServies.getSessionData("memberId")
  this.getTableData();
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
    const timestamp = new Date().getTime(); 
      this.router.navigate(['/title-details'], { queryParams: { vin: this.searchValue, refresh: timestamp }}).then(() => {
        this.searchValue="";
      // You can trigger additional actions after navigation
      //console.log('Navigation complete');
    });
  }
}

tableData :any[] =[];
lastUpdateDate:string ="";
getTableData() { 
   let url = `page=1&limit=1&member=${(this.member)}`;
  
  this.userData.getCurrentVinDataForUser(url).subscribe(
    (res: any) => {
      if (!res.error) {
        this.tableData = res?.data?.items || [];  
        //console.log("this",this.tableData);
        if(res?.data?.items.length){
          this.lastUpdateDate=res?.data?.items[0].updatedAt;
        }else{
          this.lastUpdateDate="";
        }
      }
    },
    (err) => {    
    }
  );
}



}

 
