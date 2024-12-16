import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-vehicle',
  imports: [RouterLink],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css'
})
export class VehicleComponent implements AfterViewInit{
  ngAfterViewInit(): void {
    let tooltipElements = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipElements.forEach((tooltipElem) => {
      new bootstrap.Tooltip(tooltipElem);
    });
  }
}
