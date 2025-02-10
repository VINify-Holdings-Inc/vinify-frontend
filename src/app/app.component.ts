import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { userData } from './services/api-service.service';
import { NotificationService } from './services/state-management';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mvm';

  constructor(private router: Router,private userData: userData,
               private notificationService: NotificationService,) {
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
      }
    },
    (err) => {    
    }
  );
 }
}
