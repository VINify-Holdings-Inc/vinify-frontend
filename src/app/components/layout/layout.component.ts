import { Component } from '@angular/core';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FileExportComponent } from './get-recent-alert-file-export/get-recent-alert-file-export.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, DashboardHeaderComponent, SidebarComponent, FileExportComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isSidebarActive: boolean = false;

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;

  }
}
