import { Component } from '@angular/core';
import { FrontHeaderComponent } from '../header-footer/front-header/front-header.component';
import { FrontFooterComponent } from '../header-footer/front-footer/front-footer.component';

@Component({
  selector: 'app-faq',
  imports: [FrontHeaderComponent,FrontFooterComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  faqIcon1: string = 'assets/images/icons/heart.svg';
  faqIcon2: string = 'assets/images/icons/left-right.svg';
  faqIcon3: string = 'assets/images/icons/disable.svg';
  faqIcon4: string = 'assets/images/icons/document.svg';
  faqIcon5: string = 'assets/images/icons/billing.svg';
  faqIcon6: string = 'assets/images/icons/mail.svg';
  faqImg1: string = 'assets/images/faq-img-1.png';
  faqImg2: string = 'assets/images/faq-img-2.png';
  faqImg3: string = 'assets/images/faq-img-3.png';

}
