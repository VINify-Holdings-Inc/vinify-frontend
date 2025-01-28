import { Component, Input ,OnInit} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  constructor(private router: Router) {}
  localData:any=""
  storageData:any=""
 
  ngOnInit(): void { 
  }
  icon1: string = 'assets/images/icons/sidebar-icon/dashboard.svg';
  icon2: string = 'assets/images/icons/sidebar-icon/vehicle.svg';
  icon3: string = 'assets/images/icons/sidebar-icon/new-alert.svg';
  icon4: string = 'assets/images/icons/sidebar-icon/export-report.svg';
  icon5: string = 'assets/images/icons/sidebar-icon/profile.svg';
  icon6: string = 'assets/images/icons/sidebar-icon/support.svg';
  icon7: string = 'assets/images/icons/sidebar-icon/information.png';
  helpPdf: any = 'assets/helpdoc/NMVTIS_help_doc.pdf';
  @Input() isSidebarActive: boolean = true;
  
  routerNavigation() { 
    this.localData=localStorage.getItem("singleVin")
    this.storageData= JSON.parse(this.localData)
    const timestamp = new Date().getTime();
    this.router.navigate(['/title-details'], {
      queryParams: {
        vin: this?.storageData?.vin || '',
        model: this?.storageData?.model || '',
        refresh: timestamp
      }
    });
  }
 
}



 