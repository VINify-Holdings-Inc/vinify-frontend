import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: `./line-chart.component.html`,
  styleUrl:`./line-chart.component.css`
})
export class LineChartComponent {
  public chartOptions: Partial<{
    series: any[];
    chart: any;
    xaxis: any;
    stroke: any;
    tooltip: any;
    yaxis: any;
    colors: string[];
  }> = {};

  constructor() {
    this.initializeChartOptions();
  }

  private initializeChartOptions() {
    this.chartOptions = {
      series: [
        { name: 'Customs Fraud', data: [100, 25, 35, 20, 40, 50, 45] },
        { name: 'Title Fraud', data: [80, 15, 25, 10, 30, 35, 40] },
        { name: 'Impounded', data: [60, 10, 20, 5, 25, 30, 35] },
        { name: 'Theft Alerts', data: [40, 5, 15, 2, 20, 25, 30] },
      ],
      chart: {
        type: 'line',
        height: 350,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      xaxis: {
        categories: ['15 Mar', '30 Mar', '15 Apr', '30 Apr', '15 May', '30 May', '15 June'],
        title: {
          text: 'Time Period',
        },
      },
      yaxis: {
        title: {
          text: 'Count of Fraud',
        },
        min: 0,
        max: 120,
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} `,
        },
      },
   //   colors: ['#FF4560', '#008FFB', '#00E396', '#FEB019'], // Explicitly defined colors
        colors: ['#edfcb9', '#c0c4f1', '#e1e1e1', '#f0b4a2'],
    };
  }
}
