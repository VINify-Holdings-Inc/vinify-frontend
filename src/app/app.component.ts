import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { userData } from './services/api-service.service';
import { LastUpdatedService, NotificationService } from './services/state-management';
import { IdleTimeoutService } from './services/idle-timeout.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mvm';

  constructor(private router: Router,private userData: userData,
               private notificationService: NotificationService,private lastUpdatedService:LastUpdatedService,
               private idleTimeout: IdleTimeoutService,) {
    // Arms the InfoSec Policy's 15-minute inactivity timeout for the whole app.
    this.idleTimeout.start();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
         this.showAlertCountData();
      }
    });
  }

  showAlertCountData() { 
    this.userData.getUnreadCount().subscribe(
    (res: any) => {
      if (!res.error) {
       this.notificationService.setUnreadCount(
         res?.data?.totalNotificationCount||0
       );
       this.lastUpdatedService.setLastUpdate(res?.data?.lastUpdatedDate||""); 
      }
    },
    (err) => {    
    }
  );
 }
}
