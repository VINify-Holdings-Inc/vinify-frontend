import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-front-header',
  imports: [RouterLink],
  templateUrl: './front-header.component.html',
  styleUrl: './front-header.component.css'
})
export class FrontHeaderComponent {
  logo: string = 'assets/images/ta-logo.png';
}
