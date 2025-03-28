import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../../../services/session.service';
import { Router, RouterLink } from '@angular/router';
import { LastUpdatedService, NotificationService, ProfileService } from '../../../services/state-management';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { userData, AuthService } from '../../../services/api-service.service';
import { DateFormatPipe } from '../../../pipes/date-format.pipe';
import Swal from 'sweetalert2';
import { LoaderComponent } from '../common/loader/loader.component';
import { SoapService } from '../../../services/soap.service';
import { CreateSoapPdfService } from '../../../services/create-soap-pdf.service';
import { PDF_SETTINGS, UPLOAD_FOLDER } from '../../../../app/constants';
import { NavPdfService } from '../../../services/nav-pdf.service';
@Component({
  selector: 'app-dashboard-header',
  imports: [CommonModule, FormsModule, DateFormatPipe, LoaderComponent, RouterLink],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css'
})
export class DashboardHeaderComponent implements OnInit, OnDestroy {
  searchIconToggle: boolean = true
  logo: string = 'assets/images/ta-logo.png';
  mlogo: string = 'assets/images/logo.png';
  profileIcon: string = 'assets/images/icons/sub-profile.svg';
  arrowIcon: string = 'assets/images/icons/down-arrow.svg';
  searchIcon: string = 'assets/images/icons/vin-search.svg';
  logIcon: string = 'assets/images/icons/log-out.svg';
  notifications: string = 'assets/images/icons/bell.png';
  @Output() sidebarToggle = new EventEmitter<void>();
  private subscription!: Subscription; // To manage subscription lifecycle
  constructor(private sessionServies: SessionService, private router: Router,
    private profileService: ProfileService, private userData: userData,
    private authService: AuthService,
    private soapService: SoapService, private notificationService: NotificationService,
    private lastUpdatedService: LastUpdatedService,
    private navPdf : NavPdfService,
    private soapPdf :CreateSoapPdfService ){
    this.profileData = this.profileService.getInitialProfileData();
    this.userEmail = JSON.parse(localStorage.getItem("profileData") || "")?.email;
  }
  profileData: any;
  userName: string = "";
  profile: string = "";
  searchValue: string = "";
  userEmail: string = "";
  unreadCount = 0;
  soapToken: any = "";
  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  logout() {
    this.sessionServies.clearSession();
    localStorage.clear();
    this.router.navigate(['']);

  }

  member: string = "";
  tableData: any[] = [];
  lastUpdateDate: any = "";
  alertCount: number = 0;
  notificationData: any[] = [];
  ngOnInit() {
    // Subscribe to the profile data observable
    this.subscription = this.profileService.profileData$.subscribe((data) => {
      this.profileData = data; // Update local variable when data changes
      this.userName = data.name; // Dynamically update userName
      this.profile = data.profile; // Dynamically update profile
    });
    this.member = this.sessionServies.getSessionData("memberId")
    // this.getProfileData();
    // this.getTableData();
    // this.showAlertCountData();

    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count; // Update count in the UI
    });

    this.lastUpdatedService.getLastUpdate$().subscribe(date => {
      this.lastUpdateDate = date;
    });

    // Call this function once when the app initializes
    setTimeout(() => {
      this.modifySwalAttributes();
    }, 1000);

  }

  modifySwalAttributes() {
    const observer = new MutationObserver(() => {
     document.querySelectorAll('.swal2-image').forEach(img => {
        if (!(img as HTMLImageElement).alt) {
          (img as HTMLImageElement).alt = 'image'; 
        }
      });
    document.querySelectorAll('.swal2-input').forEach(input => {
        if (!(input as HTMLInputElement).id) {
          (input as HTMLInputElement).id = 'swal2-input';
          (input as HTMLInputElement).setAttribute('aria-label', 'swal2-input');
        }
      });
      document.querySelectorAll('.swal2-range input ').forEach(input => {
        if (!(input as HTMLInputElement).id) {
          (input as HTMLInputElement).id = 'swal2-range-input';
          (input as HTMLInputElement).setAttribute('aria-label', 'swal2-range-input');
        }
      });
      document.querySelectorAll('.swal2-file').forEach(fileInput => {
        if (!(fileInput as HTMLInputElement).id) {
          (fileInput as HTMLInputElement).id = 'swal2-file';
          (fileInput as HTMLInputElement).setAttribute('aria-label', 'swal2-file');
        }
      });
      document.querySelectorAll('.swal2-select').forEach(fileInput => {
        if (!(fileInput as HTMLInputElement).id) {
          (fileInput as HTMLInputElement).id = 'swal2-select';
          (fileInput as HTMLInputElement).setAttribute('aria-label', 'swal2-select');
        }
      });
    document.querySelectorAll('.swal2-textarea').forEach(fileInput => {
        if (!(fileInput as HTMLInputElement).id) {
          (fileInput as HTMLInputElement).id = 'swal2-textarea';
          (fileInput as HTMLInputElement).setAttribute('aria-label', 'swal2-textarea');
        }
      });
    document.querySelectorAll('.swal2-textarea').forEach(fileInput => {
        if (!(fileInput as HTMLInputElement).id) {
          (fileInput as HTMLInputElement).id = 'swal2-textarea';
          (fileInput as HTMLInputElement).setAttribute('aria-label', 'swal2-textarea');
        }
      }); 
     document.querySelectorAll('.swal2-checkbox').forEach(label => {
        if (label.textContent !== '.') {
          label.textContent = '.';   
        }
      }); 

    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  

  

  ngOnDestroy() {
    // Clean up the subscription to avoid memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  changeSearchIcon = () => {
    this.searchIconToggle = !this.searchIconToggle
  }

  getSearchVal() {
    if (this.searchValue && this.searchValue.trim() !== "") {
      this.getVinSearch(this.searchValue.trim());
    } else {
      this.searchValue = "";
    }
  }

  getTableData() {
    let url = `page=1&limit=1`;

    this.userData.getCurrentVinDataForUser(url).subscribe(
      (res: any) => {
        if (!res.error) {
          this.tableData = res?.data?.items || [];
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
  isLoading: boolean = false;
  getVinSearch(vin: any) {

    this.isLoading = true;
    let url = `vin=${vin}&page=1&limit=1`;

    this.userData.searchVinDataForUserPopSoap(url).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.searchValue = "";
        this.searchIconToggle = !this.searchIconToggle
        if (!res.error) {
          if (res?.data?.totalItems > 0) {
            this
            const timestamp = new Date().getTime();
            this.router.navigate(['/title-details'], { queryParams: { vin: vin, refresh: timestamp } }).then(() => {
              this.searchValue = "";
            });
          }
        } else {

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
            // Text for the new button
          }).then((result) => {
            if (result.isConfirmed) {
              this.isLoading = true;
              this.callSoapServiceAuth().then((success) => {
                if (success) {

                  this.getVinSearchDataFromSoap(this.soapToken, vin).then((resp) => {
                    this.isLoading = false;
                    
                    if (resp.type) {
                      if (!resp.xml.error) {  
                        if (resp?.xml?.generatePdf.length) {
                                                    
                             Swal.fire({
                                      title: 'Action!',
                                      text: "How would you prefer the report to be presented?",
                                      showClass: {
                                        popup: 'animated fadeInDown faster',
                                        icon: 'animated heartBeat delay-1s'
                                      },
                                      icon: 'info',
                                    //  showCancelButton: true, // Enables the cancel button
                                      confirmButtonText: 'PDF View', // Text for the confirm button
                                    //  cancelButtonText: 'No',  // Text for the cancel button
                                      showDenyButton: true, // Enables the additional button
                                      denyButtonText: 'Web View',
                                      // Text for the new button
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                            this.navPdf.generatePDF(
                                            PDF_SETTINGS.COMPANY_NAME,
                                            vin,
                                            resp?.xml?.reportData,
                                            PDF_SETTINGS.LOGO_URL,
                                            vin+'-data-req-file.pdf'
                                        );
                                      }
                                      else if (result.isDenied) {
                                        localStorage.setItem("apiData", JSON.stringify(resp?.xml?.reportData));  // Store data
                                        localStorage.setItem("apiDataVin", JSON.stringify(vin));  // Store data
                                        window.open("/reports", "_blank"); // Redirect to new page
                                      }
                                   }) 
                           
                        } else {
                          Swal.fire({
                            title: 'Info!',
                            showClass: {
                              popup: 'animated fadeInDown faster',
                              icon: 'animated heartBeat delay-1s'
                            },
                            text: `No data found for ${vin}`,
                            icon: 'error',
                            confirmButtonText: 'OK',
                          });
                        }
                      } else {
                        Swal.fire({
                          title: 'Info!',
                          showClass: {
                            popup: 'animated fadeInDown faster',
                            icon: 'animated heartBeat delay-1s'
                          },
                          text: `No data found for ${vin}`, //"Something went worng,please try after sometime",
                          icon: 'error',
                          confirmButtonText: 'OK',
                        });
                      }

                    } else {
                      Swal.fire({
                        title: 'Error!',
                        showClass: {
                          popup: 'animated fadeInDown faster',
                          icon: 'animated heartBeat delay-1s'
                        },
                        text: `No data found for ${vin}`, //resp?.xml.message,//"Error is occurred while fetching Vin Details",
                        icon: 'error',
                        confirmButtonText: 'OK',
                      });
                    }

                  })
                } else {
                  this.isLoading = false;
                  Swal.fire({
                    title: 'Error!',
                    showClass: {
                      popup: 'animated fadeInDown faster',
                      icon: 'animated heartBeat delay-1s'
                    },
                    text:  `No data found for ${vin}`,//"Sever is down",
                    icon: 'error',
                    confirmButtonText: 'OK',
                  });
                }
              });
            }
          
          });
        }
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  getProfileData() {
    this.authService.getProfileData(this.userEmail).subscribe(
      (res: any) => {

        if (!res.error) {

          this.userName = res.data.firstName + " " + res.data.lastName;
          this.profile = UPLOAD_FOLDER.UPLOAD + res.data.profile;
        }
      },
      (err) => {

      }
    );
  }

  callSoapServiceAuth(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.getVariable('tk') == null || this.getVariable('tk') == "") {

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
            //  console.error('SOAP Request Error:', err);
            resolve(false);
          }
        );
      } else {
        this.soapToken = this.getVariable('tk');
        resolve(this.soapToken != null && this.soapToken != "");
      }
    });
  }

  setVariable(key: any, value: any, ttl = 30 * 60 * 1000) {
    const expiry = Date.now() + ttl;
    localStorage.setItem(key, JSON.stringify({ value, expiry }));
  }

  getVariable(key: any) {
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
            // console.log("XML Response:", res.data);
            resolve({ type: true, xml: res.data });
          } else {

            resolve({ type: false, xml: res});
          }
        },
        (err) => {

          resolve({ type: false });
        }
      );
    });
  }


  showAlertCountData() {
    this.userData.getUnreadCount().subscribe(
      (res: any) => {
        if (!res.error) {
          this.alertCount = res?.data?.totalNotificationCount || 0
          this.notificationService.setUnreadCount(
            res?.data?.totalNotificationCount || 0
          );

          this.lastUpdatedService.setLastUpdate(res?.data?.lastUpdatedDate || "");
        }
      },
      (err) => {
      }
    );
  }

  getNotificationData() {
    let url = `page=1&limit=8`;

    this.userData.getTopTenNotification(url).subscribe(
      (res: any) => {
        if (!res.error) {
          this.notificationData = res?.data?.items || [];

        }
      },
      (err) => {
      }
    );
  }

  getAllNotification(vin: any, model: any, id: any) {

    let type: any = `type=specific`;
    let datas: any[] = [];
    datas.push(id)
    this.userData.updateSeenAlertCheckBxData(type, datas).subscribe(
      (res: any) => {

        if (!res.error) {
          if (res?.data?.updated) {

            this.notificationService.setUnreadCount(
              res?.data?.totalNotificationCount || 0
            );
            this.getRegirect(vin, model);
          }
        }
      },
      (err) => {

      }
    );


  }
  getRegirect(vin: any, model: any) {
    const timestamp = new Date().getTime();
    this.router.navigate(['/title-details'], { queryParams: { vin: vin.trim(), model: model, refresh: timestamp } }).then(() => {

    })
  }

  readNotification(data: any) {
    Swal.fire({
      title: 'Action!',
      text: "Are you sure to read all the notifications?",
      showClass: {
        popup: 'animated fadeInDown faster',
        icon: 'animated heartBeat delay-1s'
      },
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        let type: any = `type=${data}`;
        let datas: any[] = [];
        datas.push(data.id)
        this.userData.updateSeenAlertCheckBxData(type, datas).subscribe(
          (res: any) => {

            if (!res.error) {
              if (res?.data?.updated) {
                this.notificationService.setUnreadCount(
                  res?.data?.totalNotificationCount || 0
                );

              }
            }

          },
          (err) => {

          }
        )
      }
    });

  }

}


