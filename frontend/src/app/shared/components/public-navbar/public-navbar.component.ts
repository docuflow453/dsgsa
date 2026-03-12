import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './public-navbar.component.html',
  styleUrls: ['./public-navbar.component.scss']
})
export class PublicNavbarComponent {
  mobileMenuOpen = signal(false);
  activeDropdown = signal<string | null>(null);

  navItems: NavItem[] = [
    { 
      label: 'Home', 
      route: '/',
      children: [
        { label: 'About Us', route: '/about' }
      ]
    },
    { label: 'Provinces', route: '/provinces' },
    { label: 'National Calendar', route: '/calendar' },
    { label: 'Results', route: '/results' },
    { label: 'Officials', route: '/officials' },
    { label: 'News', route: '/news' },
    { label: 'Contact Us', route: '/contact' }
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(value => !value);
  }

  toggleDropdown(label: string): void {
    this.activeDropdown.update(current => current === label ? null : label);
  }

  closeDropdown(): void {
    this.activeDropdown.set(null);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
    this.activeDropdown.set(null);
  }
}

