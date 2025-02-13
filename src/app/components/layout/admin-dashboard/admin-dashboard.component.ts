import { Component, AfterViewInit  } from '@angular/core';
import { BarChartComponent } from '../dashboard/bar-chart/bar-chart.component';
import { LineChartComponent } from '../dashboard/line-chart/line-chart.component';
import { PieChartComponent } from '../dashboard/pie-chart/pie-chart.component';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-dashboard',
  imports: [BarChartComponent,LineChartComponent,PieChartComponent,CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements AfterViewInit {
  ngAfterViewInit(): void {
  let tooltipElements = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipElements.forEach((tooltipElem) => {
    new bootstrap.Tooltip(tooltipElem);
  });
}

isChartSelected : string ="line";
changeChart (x:string) {
  this.isChartSelected=x;
}

}
