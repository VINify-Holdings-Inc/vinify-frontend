import { Component, Input ,OnInit} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { userData } from '../../../services/api-service.service';
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
    constructor(private userData: userData,private router: Router){ }
    tableData :any[] =[]; 
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
  
    let url = `page=1&limit=1`;
   this.userData.getCurrentVinDataForUser(url).subscribe(
     (res: any) => {
       if (!res.error) {
         this.tableData = res?.data?.items || [];  
         //console.log("this",this.tableData);
         if(res?.data?.items.length){
        const lastUpdateDate=res?.data?.items[0]; 
        const timestamp = new Date().getTime();
        this.router.navigate(['/title-details'], {
          queryParams: {
            vin: lastUpdateDate?.vin || '',
            model:lastUpdateDate?.model || '',
            refresh: timestamp
          }
        });
         }else{
          this.tableData = res?.data?.items || []; 
         }
       }
     },
     (err) => {    
     }
   );
  }
}



 