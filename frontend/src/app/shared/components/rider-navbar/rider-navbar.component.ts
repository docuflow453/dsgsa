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
    { label: 'Dashboard', icon: 'bi-grid', route: '/my/dashboard' },
    { label: 'Entries', icon: 'bi-calendar-check', route: '/my/entries' },
    { label: 'Horses', icon: 'bi-heart', route: '/my/horses' },
    { label: 'Results', icon: 'bi-trophy', route: '/my/results' },
    { label: 'Profile', icon: 'bi-person', route: '/my/profile' }
  ];

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  getUserInitials(user: { first_name?: string | null; last_name?: string | null }): string {
    return `${user.first_name?.charAt(0) ?? ''}${user.last_name?.charAt(0) ?? ''}` || 'DR';
  }

  getUserFirstName(user: { first_name?: string | null }): string {
    return user.first_name?.trim() || 'Rider';
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
  }
}

