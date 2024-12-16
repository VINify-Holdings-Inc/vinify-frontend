import { Component } from '@angular/core';
import { FrontHeaderComponent } from '../FrontLayout/front-header/front-header.component';
import { FrontFooterComponent } from '../FrontLayout/front-footer/front-footer.component';

@Component({
  selector: 'app-privacy-policy',
  imports: [FrontHeaderComponent,FrontFooterComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css'
})
export class PrivacyPolicyComponent {

}
