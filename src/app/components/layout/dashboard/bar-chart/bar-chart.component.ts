import { Component } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';  

export interface ChartOptions {
  series: any;
  chart: any;
  xaxis: any;
  yaxis: any;
  plotOptions: any;
  tooltip: any;
  fill: any;
  dataLabels: any;
  stroke: any;
  colors: any;
}

@Component({
  selector: 'app-bar-chart',
  imports: [NgApexchartsModule],
  standalone: true,
  templateUrl: `./bar-chart.component.html`,
  styleUrl:`./bar-chart.component.css`
})
export class BarChartComponent {
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Customs Fraud',
          data: [100, 25, 35, 20, 40, 50, 45],
        },
        {
          name: 'Title Fraud',
          data: [80, 15, 25, 10, 30, 35, 40],
        },
        {
          name: 'Impounded',
          data: [60, 10, 20, 5, 25, 30, 35],
        },
        {
          name: 'Theft Alerts',
          data: [40, 5, 15, 2, 20, 25, 30],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
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
        max: 100,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val: any) => `${val} `,
        },
      },
      colors: ['#edfcb9', '#c0c4f1', '#e1e1e1', '#f0b4a2'],
    };
  }
}

