import { Component, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements AfterViewInit {
  logo: string = 'assets/images/ta-logo.png';
  nmvtlogo: string = 'assets/images/nmvtis-1.png';
  reportSummary: string = 'assets/images/icons/sidebar-icon/export-report.svg';
  activeTab: string = 'reportsummary';  // Active tab to apply conditional classes
  scrollCall = true;

  @ViewChild('scrollableSections', { static: true }) scrollableSections: ElementRef | undefined;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() { 
    if (this.scrollCall) {
      this.initScrollListener();
    }
  }

  // Scroll to section method using @ViewChild
  scrollToSection(sectionId: string) {  
    this.activeTab = sectionId;
    console.log(sectionId, "Value printed here");

    this.scrollCall = false; // Prevent re-initialization
    const targetElement = document.getElementById(sectionId);
    
    if (targetElement) {
      // Calculate the offset position
      const targetPosition = targetElement.offsetTop - 110; // 110px offset for header

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth' // Smooth scroll effect
      }); 
    }

    // Ensure the scroll listener is initialized
    this.initScrollListener(); 
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

  // Scroll event handler to track which section is in view
  onScroll() {
    const sections = document.querySelectorAll('section'); // Get all sections
    const navLi = document.querySelectorAll('nav .container ul li'); // Get all navigation items
    let current = '';

    // Loop through all sections and check which one is currently in view
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (
        window.pageYOffset >= sectionTop - 110 &&
        window.pageYOffset < sectionTop + sectionHeight - 110
      ) {
        current = section.getAttribute('id') || ''; // Get the id of the section in view
      }
    });

    // Loop through navigation items to update active class
    navLi.forEach((li) => {
      li.classList.remove('active');
      if (li.classList.contains(current)) {
        li.classList.add('active');
      }
    });

    // Update activeTab based on the section in view
    this.activeTab = current;
  }
}
