import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/layout/dashboard/dashboard.component';
import { VehicleComponent } from './components/layout/vehicle/vehicle.component';
import { NotFoundComponent } from './components/not-found/not-found.component'; // Import your error component
import { AuthGuard } from './auth.guard';
import { SummaryComponent } from './components/layout/summary/summary.component';
import { AdminDashboardComponent } from './components/layout/admin-dashboard/admin-dashboard.component';
import { AdminVehicleComponent } from './components/layout/admin-vehicle/admin-vehicle.component';
import { AdminSummaryComponent } from './components/layout/admin-summary/admin-summary.component';
import { CsvImportComponent } from './components/csv-import/csv-import.component'
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsOfServicesComponent } from './components/terms-of-services/terms-of-services.component';
import { UserProfileComponent } from './components/layout/user-profile/update-user-profile/user-profile.component';
import {ViewUserProfileComponent} from './components/layout/user-profile/view-user-profile/view-user-profile.component';
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
    path: '', 
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent ,canActivate:[AuthGuard] },
      { path: 'user-vehicle-list', component: VehicleComponent,canActivate:[AuthGuard] },
      { path: 'user-summary-list', component: SummaryComponent,canActivate:[AuthGuard] },
      { path: 'main-dashboard', component: AdminDashboardComponent,canActivate: [AuthGuard]}, //admin-dashboad
      { path: 'vehicle-list', component: AdminVehicleComponent,canActivate: [AuthGuard]}, //admin-vehicle-list
      { path: 'summary-list', component: AdminSummaryComponent,canActivate: [AuthGuard]}, //admin-summary-list
      { path: 'csv-import', component:CsvImportComponent ,canActivate: [AuthGuard]}, //admin-summary-list
      { path: 'user-profile', component:UserProfileComponent ,canActivate: [AuthGuard]}, //user-profile
      { path: 'view-user-profile', component:ViewUserProfileComponent ,canActivate: [AuthGuard]}, //user-profile
    ]
  },
  // This route is used for any invalid routes
  { 
    path: '**', 
    component: NotFoundComponent 
  },
];
