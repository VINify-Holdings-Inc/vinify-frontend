import { Component } from '@angular/core';
import { FrontHeaderComponent } from '../header-footer/front-header/front-header.component';
import { FrontFooterComponent } from '../header-footer/front-footer/front-footer.component';

@Component({
  selector: 'app-terms-of-services',
  imports: [FrontHeaderComponent,FrontFooterComponent],
  templateUrl: './terms-of-services.component.html',
  styleUrl: './terms-of-services.component.css'
})
export class TermsOfServicesComponent {

}
