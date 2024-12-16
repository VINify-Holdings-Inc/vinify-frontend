import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: `./pie-chart.component.html`,
  styleUrl: `./pie-chart.component.css`
})
export class PieChartComponent {
  public chartOptions: Partial<{
    series: number[];
    chart: any;
    labels: string[];
    colors: string[];
    tooltip: any;
    plotOptions: any;
    legend: any;
  
  }> = {};

  constructor() {
    this.initializeChartOptions();
  }

  private initializeChartOptions() {
    const seriesValues :number[]= [1000, 40, 40, 40]; // Series data
    const labels :string[]= ['Florida', 'California', 'Miami', 'Taxes']; // Labels data

    this.chartOptions = {
      series: seriesValues, // Values for the donut chart
      chart: {
        type: 'donut',
        height: 300,
      },
      labels: labels, // Labels for each segment
      tooltip: {
        custom: ({
          series,
          seriesIndex,
          w,
        }: {
          series: number[];
          seriesIndex: number;
          w: any;
        }) => {
          // Generate the tooltip content
          const selectedLabel = w.globals.labels[seriesIndex];
          const selectedValue = series[seriesIndex];

          let tooltipHtml = `
            <div style="padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
              <div style="font-weight: bold; margin-bottom: 5px;">
                 ${selectedLabel}: ${selectedValue} 
              </div>
              <div style="border-top: 1px solid #ddd; margin-top: 5px; padding-top: 5px;">
          `;

          series.forEach((value: number, index: number) => {
            tooltipHtml += `
              <div>
                ${w.globals.labels[index]}: ${value} 
              </div>
            `;
          });

          tooltipHtml += '</div></div>';
          return tooltipHtml;
        },
      },
      colors: ['#7f56d9', '#9e77ed', '#b692f6', '#d6bbfb'], // Donut chart segment colors
      
      plotOptions: {
        pie: {
          donut: {
            size: '45%', // Define the size of the donut hole
          },
        },
      },
      
      legend: {
        position: 'bottom', // Place the legend at the bottom
        horizontalAlign: 'center', // Center align the legend
        fontSize: '12px', // Font size for legend items
        formatter: (seriesName: string, opts: any) => {
          // Customize legend to display label and series value
          const value = opts.w.globals.series[opts.seriesIndex];
          return `${seriesName}: ${value}`; // Example: Florida: 1000
        },
        markers: {
          width: 10,
          height: 10,
          radius: 10, // Rounded markers
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
    };
  }
}
