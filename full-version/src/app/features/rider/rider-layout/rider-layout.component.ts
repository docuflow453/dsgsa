import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/services/auth.service';
import { RiderService } from '../services/rider.service';
import { User } from '../../../core/models/user.model';
import { Rider } from '../models/rider.model';

/**
 * Rider Layout Component - Layout with dual navigation (top public nav + sidebar)
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
  riderProfile: Rider | null = null;
  sidebarCollapsed = false;
  currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private riderService: RiderService
  ) {}

  ngOnInit(): void {
    // Get current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Get rider profile
    this.riderService.getProfile().subscribe(profile => {
      this.riderProfile = profile;
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }

  getMemberSince(): string {
    if (!this.riderProfile?.joinDate) {
      return '';
    }
    return new Date(this.riderProfile.joinDate).getFullYear().toString();
  }
}

