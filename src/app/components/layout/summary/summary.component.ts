import { Component, OnInit  } from '@angular/core';
import { SummaryTitleComponent } from "./summary-title/summary-title.component";
import { SummaryInnerComponent } from "./summary-inner/summary-inner.component";
import { SummaryAdditionalComponent } from './summary-additional/summary-additional.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  imports: [SummaryTitleComponent, SummaryInnerComponent,SummaryAdditionalComponent,],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit {
  receivedData: any;
  vin:string="";
  model:string="";

  constructor(private router: Router) {}

  ngOnInit() {
    this.receivedData = history.state; // Retrieve the state data
    console.log('Received Data:', this.receivedData);
    this.vin=this.receivedData.vin;
    this.model=this.receivedData.model;
  }
}
