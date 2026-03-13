import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

interface RiderNavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-rider-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './rider-navbar.component.html',
  styleUrls: ['./rider-navbar.component.scss']
})
export class RiderNavbarComponent {
  authService = inject(AuthService);
  showUserMenu = false;

  navItems: RiderNavItem[] = [
    { label: 'My Dashboard', icon: 'bi-grid', route: '/rider/dashboard' },
    { label: 'My Entries', icon: 'bi-calendar-check', route: '/rider/entries' },
    { label: 'My Horses', icon: 'bi-heart', route: '/rider/horses' },
    { label: 'Results', icon: 'bi-trophy', route: '/rider/results' },
    { label: 'My Profile', icon: 'bi-person', route: '/rider/profile' }
  ];

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
  }
}

