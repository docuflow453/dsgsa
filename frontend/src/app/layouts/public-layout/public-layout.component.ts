import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

/**
 * Public Layout Component - Layout for public pages
 * Includes the two-tier navigation we built earlier
 */
@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent {
  isScrolled = false;
  isCollapsed = true;
  currentYear = new Date().getFullYear();

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.pageYOffset > 0) {
      this.isScrolled = true;
      document.querySelector('.main-nav')?.classList.add('landing-nav');
      document.querySelector('.main-nav')?.classList.remove('default');
    } else {
      this.isScrolled = false;
      document.querySelector('.main-nav')?.classList.add('default');
      document.querySelector('.main-nav')?.classList.remove('landing-nav');
    }
  }
}

