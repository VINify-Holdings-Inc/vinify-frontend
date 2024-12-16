import { Component, AfterViewInit} from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-admin-vehicle',
  imports: [],
  templateUrl: './admin-vehicle.component.html',
  styleUrl: './admin-vehicle.component.css'
})
export class AdminVehicleComponent implements AfterViewInit{
  ngAfterViewInit(): void {
    let tooltipElements = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipElements.forEach((tooltipElem) => {
      new bootstrap.Tooltip(tooltipElem);
    });
  }
}
