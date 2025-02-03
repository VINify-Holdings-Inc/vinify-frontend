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
import { NgIf } from '@angular/common';
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
  soapToken:any="";
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
      //   this.lastUpdateDate=res?.data?.items[0].updatedAt; 
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
          }).then((result) => {
            if (result.isConfirmed) {
              this.isLoading=true;
             this.callSoapServiceAuth().then((success) => {
              if (success) {
                   this.getVinSearchDataFromSoap(this.soapToken,vin).then((resp) => {
                     this.isLoading=false;
                      if(resp.type){
                            // xml data 
                            Swal.fire({
                              title: 'Info!',
                              showClass: {
                                popup: 'animated fadeInDown faster',
                                icon: 'animated heartBeat delay-1s'
                              },
                              //text: JSON.stringify(resp.xml),
                              text: "Work in progress",
                              icon: 'success',
                              confirmButtonText: 'OK',
                            });
                      }else{
                          Swal.fire({
                            title: 'Error!',
                            showClass: {
                              popup: 'animated fadeInDown faster',
                              icon: 'animated heartBeat delay-1s'
                            },
                            text: "Error is occurred while fetching Vin Details",
                            icon: 'error',
                            confirmButtonText: 'OK',
                          });
                      }
                      
                   })
              } else {
                    this.isLoading=false;
                        Swal.fire({
                              title: 'Error!',
                              showClass: {
                                popup: 'animated fadeInDown faster',
                                icon: 'animated heartBeat delay-1s'
                              },
                              text: "Sever is down",
                              icon: 'error',
                              confirmButtonText: 'OK',
                            }); 

                //console.log("Failed to retrieve SOAP Token.");
              }
            });
            }
          });
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

  callSoapServiceAuth(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.getVariable('tk') == null || this.getVariable('tk') == "") {
        console.log("this.getVariable('tk')", this.getVariable('tk'));
  
        this.soapService.getToken().subscribe(
          (res) => {
            if (!res.error) {
              let token = res.data?.encValue;
              this.setVariable('tk', token);
              this.soapToken = token;
              resolve(true);
            } else {
              resolve(false);
            }
          },
          (err) => {
            console.error('SOAP Request Error:', err);
            resolve(false);
          }
        );
      } else {
        this.soapToken = this.getVariable('tk');
        resolve(this.soapToken != null && this.soapToken != "");
      }
    });
  }

setVariable(key:any, value:any, ttl = 30 * 60 * 1000) {
  const expiry = Date.now() + ttl;
  localStorage.setItem(key, JSON.stringify({ value, expiry }));
}

getVariable(key:any) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
      return null; // Return null if the item doesn't exist
  }

  try {
      const item = JSON.parse(itemStr);
      if (!item || !item.expiry || Date.now() > item.expiry) {
          localStorage.removeItem(key);
          return null;
      }
      return item.value;
  } catch (error) {
      console.error("Error parsing JSON from localStorage:", error);
      localStorage.removeItem(key); // Remove the corrupted data
      return null;
  }
}
getVinSearchDataFromSoap(tk: any, vin: any): Promise<{ type: boolean; xml?: any }> {
  return new Promise((resolve) => {
    const data = { token: tk, vin: vin };

    this.soapService.getVinData(data).subscribe(
      (res) => {
        if (!res.error) {
              console.log("XML Response:", res.data);
          resolve({ type: true, xml: res.data });
        } else {
              console.error("SOAP Error:", res.error);
          resolve({ type: false });
        }
      },
      (err) => {
            console.error("SOAP Request Error:", err);
        resolve({ type: false });
      }
    );
  });
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
  let url = `page=1&limit=5`;
 
 this.userData.getTopTenNotification(url).subscribe(
   (res: any) => {
     if (!res.error) {
      console.log('ff',res?.data);
       this.notificationData = res?.data?.items || [];  
      
     }
   },
   (err) => {    
   }
 );
}

getAllNotification(){
  this.router.navigate(['/notification']).then(() => {
      
  });
}

}

 
