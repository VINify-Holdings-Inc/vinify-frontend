import { Component, AfterViewInit, Renderer2, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule,DateFormatPipe],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit,AfterViewInit  {
  //assets
  logo: string = 'assets/images/ta-logo.png';
  nmvtlogo: string = 'assets/images/nmvtis-1.png';
  reportSummary: string = 'assets/images/icons/sidebar-icon/export-report.svg';
  activeTab: string = 'reportsummary';  // Active tab to apply conditional classes...
  scrollCall = true;

  @ViewChild('scrollableSections', { static: true }) scrollableSections: ElementRef | undefined;

  constructor(private renderer: Renderer2, private el: ElementRef) {}
 ngOnInit(): void {
  this.initScrollListener();
 }

data :any={}
vinData :any="";

 ngAfterViewInit(): void {
  //store data
  const apiData: string | null = localStorage.getItem("apiData");
  const apiDataVin: any  = localStorage.getItem("apiDataVin");

  if (apiData) {
    this.data = JSON.parse(apiData);
    this.vinData = JSON.parse(apiDataVin); 
  }
}

isSidebarOpen = true; // Initially open

toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
}

 private isScrolling = false; // Lock for manual scroll.

scrollToSection(sectionId: string) {  
  this.isScrolling = true;  // Lock scrolling events......
  this.activeTab = sectionId;
  
  const targetElement = document.getElementById(sectionId);
  
  if (targetElement) {
    const targetPosition = targetElement.offsetTop - 110; // Adjust for header

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    }); 
    // Unlock scrolling after transition completes
    setTimeout(() => {
      this.isScrolling = false;
    }, 1000); // Timeout should match scroll animation duration
  }
}

  initScrollListener() {
    let ticking = false; 

    this.renderer.listen('window', 'scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.onScroll();
          ticking = false;
        });
        ticking = true;
      }
    }); 
  }

  //pdf scroll section for the same....
  onScroll() {
    if (this.isScrolling) return; // Ignore auto-scroll interference
  
    const sections = document.querySelectorAll('section');
    let current = '';
  
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (
        window.pageYOffset >= sectionTop - 110 &&
        window.pageYOffset < sectionTop + sectionHeight - 110
      ) {
        current = section.getAttribute('id') || '';
      }
    });

    if (!this.isScrolling) {
      this.activeTab = current; // Only update when not locked
    }
  }

  

}