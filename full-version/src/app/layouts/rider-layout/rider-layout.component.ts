import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

/**
 * Rider Layout Component - Layout for rider dashboard and pages
 * Includes top navigation + collapsible sidebar
 */
@Component({
  selector: 'app-rider-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbModule],
  templateUrl: './rider-layout.component.html',
  styleUrls: ['./rider-layout.component.scss']
})
export class RiderLayoutComponent implements OnInit {
  currentUser: User | null = null;
  sidebarCollapsed = false;
  currentYear = new Date().getFullYear();

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
}

