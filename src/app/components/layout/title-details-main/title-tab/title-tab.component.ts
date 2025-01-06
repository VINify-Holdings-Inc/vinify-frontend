import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-title-tab',
  imports: [CommonModule],
  templateUrl: './title-tab.component.html',
  styleUrl: './title-tab.component.css'
})
export class TitleTabComponent {
    filerIcon: string = 'assets/images/icons/filter-lines.svg';
    calendarIcon: string = 'assets/images/icons/calendar.svg';
    pdfIcon: string = 'assets/images/icons/pdf.svg';



}
