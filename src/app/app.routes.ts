import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/layout/dashboard/dashboard.component';
import { VehicleComponent } from './components/layout/vehicle/vehicle.component';
import { NotFoundComponent } from './components/page-not-found/not-found.component'; // Import your error component
import { AuthGuard } from './auth.guard';
import { SummaryComponent } from './components/layout/summary/summary.component';
//import { AdminDashboardComponent } from './components/layout/admin-dashboard/admin-dashboard.component';
// import { AdminVehicleComponent } from './components/layout/admin-vehicle/admin-vehicle.component';
// import { AdminSummaryComponent } from './components/layout/admin-summary/admin-summary.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsOfServicesComponent } from './components/terms-of-services/terms-of-services.component';
import { UserProfileComponent } from './components/layout/user-profile/user-profile.component';
import { TitleDetailsMainComponent } from './components/layout/title-details-main/title-details-main.component';
import { AlertTableMainComponent } from './components/layout/alert-table-main/alert-table-main.component';
import {NotificationComponent} from './components/layout/notification/notification.component';
import { FileUploadComponent } from './components/layout/vin-input-file-upload/vin-input-file-upload.component';
import { FileExportComponent } from './components/layout/get-recent-alert-file-export/get-recent-alert-file-export.component';
import { ReportComponent } from './components/report/report.component';
export const routes: Routes = [
  { 
    path: '', 
    component: LoginComponent 
  },
  {
    path: 'resetpassword/:token', component: ResetPasswordComponent  
  },
  {
    path: 'contact-us', component: ContactComponent  
  },
  {
    path: 'about-us', component: AboutComponent  
  },
  {
    path: 'privacy-policy', component: PrivacyPolicyComponent  
  },
  {
    path: 'terms-and-conditions', component: TermsOfServicesComponent  
  }
  ,
  {
    path: 'reports', component: ReportComponent  
  }
  ,
  { 
    path: '', 
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent ,canActivate:[AuthGuard] },
      { path: 'alert-list', component: AlertTableMainComponent,canActivate:[AuthGuard] },
      { path: 'user-vehicle-list', component: VehicleComponent,canActivate:[AuthGuard] },
      { path: 'user-summary-list', component: SummaryComponent,canActivate:[AuthGuard] },
     // { path: 'main-dashboard', component: AdminDashboardComponent,canActivate: [AuthGuard]}, 
      // { path: 'vehicle-list', component: AdminVehicleComponent,canActivate: [AuthGuard]},  
      // { path: 'summary-list', component: AdminSummaryComponent,canActivate: [AuthGuard]},   
      { path: 'user-profile', component:UserProfileComponent ,canActivate: [AuthGuard]},  
      { path: 'title-details', component:TitleDetailsMainComponent ,canActivate: [AuthGuard]},  
      { path: 'user-profile', component:UserProfileComponent ,canActivate: [AuthGuard]} ,
      { path: 'notification', component:NotificationComponent ,canActivate: [AuthGuard]} ,
      { path: 'file-upload', component:FileUploadComponent ,canActivate: [AuthGuard]},  
      { path: 'file-export', component:FileExportComponent ,canActivate: [AuthGuard]},  
    ]
  },
  // This route is used for any invalid routes
  { 
    path: '**', 
    component: NotFoundComponent 
  },
];
