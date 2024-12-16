import { Component, AfterViewInit } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-summary-title',
  imports: [],
  templateUrl: './summary-title.component.html',
  styleUrl: './summary-title.component.css'
})
export class SummaryTitleComponent implements AfterViewInit{
  ngAfterViewInit(): void {
    let tooltipElements = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipElements.forEach((tooltipElem) => {
      new bootstrap.Tooltip(tooltipElem);
    });
  }
}
