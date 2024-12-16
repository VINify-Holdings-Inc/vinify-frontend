import { Component, AfterViewInit  } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-summary-inner',
  imports: [],
  templateUrl: './summary-inner.component.html',
  styleUrl: './summary-inner.component.css'
})
export class SummaryInnerComponent implements AfterViewInit{
  ngAfterViewInit(): void {
    let tooltipElements = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipElements.forEach((tooltipElem) => {
      new bootstrap.Tooltip(tooltipElem);
    });
  }
}
