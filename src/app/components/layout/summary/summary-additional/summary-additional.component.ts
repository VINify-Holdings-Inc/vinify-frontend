import { Component, AfterViewInit} from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-summary-additional',
  imports: [],
  templateUrl: './summary-additional.component.html',
  styleUrl: './summary-additional.component.css'
})
export class SummaryAdditionalComponent implements AfterViewInit{
  ngAfterViewInit(): void {
    let tooltipElements = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipElements.forEach((tooltipElem) => {
      new bootstrap.Tooltip(tooltipElem);
    });
  }

}
