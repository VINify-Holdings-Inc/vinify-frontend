import { Component } from '@angular/core';
import { FrontHeaderComponent } from '../FrontLayout/front-header/front-header.component';
import { FrontFooterComponent } from '../FrontLayout/front-footer/front-footer.component';

@Component({
  selector: 'app-about',
  imports: [FrontHeaderComponent, FrontFooterComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  about1: string = 'assets/images/about-1.png';
  about2: string = 'assets/images/about-2.jpg';
  about3: string = 'assets/images/about-3.jpg';
}