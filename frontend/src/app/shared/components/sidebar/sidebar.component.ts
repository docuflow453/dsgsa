import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  authService = inject(AuthService);
  
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'bi-grid', route: '/dashboard' },
    { label: 'Documents', icon: 'bi-file-earmark-text', route: '/my/documents', roles: ['rider'] },
    { label: 'Reminders', icon: 'bi-bell', route: '/my/reminders', roles: ['rider'] },
    { label: 'Insights', icon: 'bi-graph-up', route: '/my/insights', roles: ['rider'] },
    { label: 'Sharing', icon: 'bi-share', route: '/my/sharing', roles: ['rider'] },
    { label: 'Roo AI', icon: 'bi-robot', route: '/my/ai', roles: ['rider'] },
    { label: 'Integrations', icon: 'bi-puzzle', route: '/my/integrations', roles: ['rider'] },
  ];

  shouldShowItem(item: NavItem): boolean {
    if (!item.roles) return true;
    return this.authService.hasAnyRole(item.roles);
  }
}

