import { Component, Output, EventEmitter,OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../../../services/session.service';
import { Router,RouterLink } from '@angular/router';
import { NotificationService, ProfileService } from '../../../services/state-management';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { userData,AuthService } from '../../../services/api-service.service';
import { DateFormatPipe } from '../../../pipes/date-format.pipe';
import Swal from 'sweetalert2';
import { LoaderComponent } from '../common/loader/loader.component';
import { SoapService } from '../../../services/soap.service';
@Component({
  selector: 'app-dashboard-header',
  imports: [CommonModule,FormsModule,DateFormatPipe,LoaderComponent,RouterLink],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css'
})
export class DashboardHeaderComponent implements OnInit , OnDestroy {
  searchIconToggle:boolean=true
  logo: string = 'assets/images/ta-logo.png';
  mlogo: string = 'assets/images/logo.png';
  profileIcon: string = 'assets/images/icons/sub-profile.svg';
  arrowIcon: string = 'assets/images/icons/down-arrow.svg';
  searchIcon: string = 'assets/images/icons/vin-search.svg';
  logIcon: string = 'assets/images/icons/log-out.svg';
  notifications: string = 'assets/images/icons/bell.png';
  @Output() sidebarToggle = new EventEmitter<void>();
  private subscription!: Subscription; // To manage subscription lifecycle
  constructor(private sessionServies: SessionService, private router : Router,
              private profileService: ProfileService,private userData: userData,
              private authService: AuthService,
              private soapService: SoapService,private notificationService: NotificationService){
    this.profileData = this.profileService.getInitialProfileData()  ;
    this.userEmail=JSON.parse(localStorage.getItem("profileData")||"")?.email;
    
  }
  profileData: any;
  userName : string="";
  profile : string ="";
  searchValue :string="";
  userEmail:string="";
  unreadCount = 0;
  //profileComplete:string="";
  toggleSidebar() { 
    this.sidebarToggle.emit();
  }

 logout(){
  this.sessionServies.clearSession();
  localStorage.clear();
  this.router.navigate(['']);
  
 }

 member: string = "";
 tableData :any[] =[];
 lastUpdateDate:string ="";
 alertCount : number =0;
 notificationData: any[]=[];
 ngOnInit() {
  // Subscribe to the profile data observable
  this.subscription = this.profileService.profileData$.subscribe((data) => {
    this.profileData = data; // Update local variable when data changes
    this.userName = data.name; // Dynamically update userName
    this.profile = data.profile; // Dynamically update profile
   // this.lastUpdateDate = this.sessionServies.getSessionData("data").createdAt || "";
    //console.log("data",data);
    // this.profileComplete = data.profileComplete; 
  });
  this.member = this.sessionServies.getSessionData("memberId")
  this.getProfileData();
  this.getTableData();
  this.showAlertCountData();
  this.getNotificationData();
  this.notificationService.unreadCount$.subscribe(count => {
    this.unreadCount = count; // Update count in the UI
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
  if(this.searchValue && this.searchValue.trim() !== ""){
    
  //  console.log("test space",this.searchValue);
    this.getVinSearch(this.searchValue.trim());
      /* const timestamp = new Date().getTime(); 
        this.router.navigate(['/title-details'], { queryParams: { vin: this.searchValue, refresh: timestamp }}).then(() => {
          this.searchValue="";
      }); */
  }else{
    this.searchValue="";
  }
}

getTableData() { 
  let url = `page=1&limit=1`;
 
 this.userData.getCurrentVinDataForUser(url).subscribe(
   (res: any) => {
     if (!res.error) {
       this.tableData = res?.data?.items || [];  
       //console.log("this",this.tableData);
       if(res?.data?.items.length){
         this.lastUpdateDate=res?.data?.items[0].updatedAt;
         localStorage.setItem("singleVin",JSON.stringify(res?.data?.items[0]))
       }else{
         this.lastUpdateDate="";
       }
     }
   },
   (err) => {    
   }
 );
}


onEnterKey(dropdownMenu: HTMLElement) {
  this.getSearchVal(); 
  this.closeDropdown(dropdownMenu);
}

closeDropdown(dropdownMenu: HTMLElement) {
  dropdownMenu.classList.remove('show'); 
}
isLoading:boolean=false;
getVinSearch(vin:any){
    
    this.isLoading= true;
     let url = `vin=${vin}&page=1&limit=1`;
        
    this.userData.searchVinDataForUser(url).subscribe(
      (res:any) => {
       // console.log("data",res?.data);
          this.isLoading=false; 
          this.searchValue="";
          this.searchIconToggle=!this.searchIconToggle
        if(!res.error){
           if(res?.data?.totalItems>0){
            this
                const timestamp = new Date().getTime(); 
                    this.router.navigate(['/title-details'], { queryParams: { vin: vin, refresh: timestamp }}).then(() => {
                    this.searchValue="";
                    });
           }
        }else{
          
          Swal.fire({
            title: 'Action!',
            text: res.message,
            showClass: {
              popup: 'animated fadeInDown faster',
              icon: 'animated heartBeat delay-1s'
            },
            icon: 'info',
            showCancelButton: true, // Enables the cancel button
            confirmButtonText: 'Yes', // Text for the confirm button
            cancelButtonText: 'No',  // Text for the cancel button
          })
        } 
      },
      (err) => {
        this.isLoading=false;
      }
    );
  }

  getProfileData() {
    this.authService.getProfileData(this.userEmail).subscribe(
      (res: any) => {

        if (!res.error) {
             
              this.userName = res.data.firstName + " " +  res.data.lastName; 
              this.profile = "https://mvmapi.techwagger.com/api/uploads/"+res.data.profile; 
            //  this.profileComplete =  res.data.profileComplete; 
          }
      },
      (err) => {

      }
    );
  }

  callSoapService() {
    this.soapService.sendSoapRequest().subscribe(
      (res) => {
        console.log('SOAP Response:', res);
       
      },
      (err) => {
        console.error('SOAP Request Error:', err);
        
      }
    );
  }

  
showAlertCountData() { 
   this.userData.getUnreadCount().subscribe(
   (res: any) => {
     if (!res.error) {
      this.alertCount=res?.data?.totalNotificationCount||0
      this.notificationService.setUnreadCount(
        res?.data?.totalNotificationCount||0
      ); 
      this.lastUpdateDate= res?.data?.lastUpdatedDate||""    
     }
   },
   (err) => {    
   }
 );
}

getNotificationData() { 
  let url = `page=1&limit=9&isRead=false`;
 
 this.userData.getCurrentVinData(url).subscribe(
   (res: any) => {
     if (!res.error) {
       this.notificationData = res?.data?.items || [];  
      
     }
   },
   (err) => {    
   }
 );
}



}

 
