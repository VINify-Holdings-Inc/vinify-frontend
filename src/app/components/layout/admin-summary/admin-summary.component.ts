import { Component } from '@angular/core';
import { SummaryInnerComponent } from "../admin-summary/summary-inner/summary-inner.component";
import { SummaryTitleComponent } from '../admin-summary/summary-title/summary-title.component';
import { SummaryAdditionalComponent } from '../admin-summary/summary-additional/summary-additional.component';

@Component({
  selector: 'app-admin-summary',
  imports: [SummaryInnerComponent, SummaryTitleComponent, SummaryAdditionalComponent],
  templateUrl: './admin-summary.component.html',
  styleUrl: './admin-summary.component.css'
})
export class AdminSummaryComponent {
  
}
