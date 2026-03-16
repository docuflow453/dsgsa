import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../core/services/auth.service';
import { User, UserRole } from '../../core/models/user.model';

/**
 * Full Layout Component - Admin-style layout for all administrative roles
 * (Admin, SAEF, Provincial, Club, Official)
 */
@Component({
  selector: 'app-full-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule],
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss']
})
export class FullLayoutComponent implements OnInit {
  currentUser: User | null = null;
  sidebarCollapsed = false;
  currentYear = new Date().getFullYear();
  UserRole = UserRole;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }

  hasRole(role: UserRole): boolean {
    return this.authService.hasRole(role);
  }
}

