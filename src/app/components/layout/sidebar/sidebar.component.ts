import { Component, Input ,OnInit} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  localData:any=localStorage.getItem("singleVin")
 storageData:any= JSON.parse(this.localData)
    timestamp = new Date().getTime(); 
    strUrl: any = `/title-details?vin=${encodeURIComponent(this?.storageData?.vin.trim())}&model=${encodeURIComponent(this?.storageData?.model.trim())}&refresh=${this.timestamp}`;

  ngOnInit(): void {
     
  }
  icon1: string = 'assets/images/icons/sidebar-icon/dashboard.svg';
  icon2: string = 'assets/images/icons/sidebar-icon/vehicle.svg';
  icon3: string = 'assets/images/icons/sidebar-icon/new-alert.svg';
  icon4: string = 'assets/images/icons/sidebar-icon/export-report.svg';
  icon5: string = 'assets/images/icons/sidebar-icon/profile.svg';
  icon6: string = 'assets/images/icons/sidebar-icon/support.svg';
  @Input() isSidebarActive: boolean = true;

 
}
