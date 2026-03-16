import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RiderService } from '../../services/rider.service';
import { DashboardStats, Rider, Entry, Result } from '../../models/rider.model';

/**
 * Dashboard Component - Rider dashboard with stats and overview
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  riderProfile: Rider | null = null;
  upcomingEntries: Entry[] = [];
  recentResults: Result[] = [];
  loading = true;

  constructor(private riderService: RiderService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Load stats
    this.riderService.getDashboardStats().subscribe(stats => {
      this.stats = stats;
    });

    // Load profile
    this.riderService.getProfile().subscribe(profile => {
      this.riderProfile = profile;
    });

    // Load upcoming entries
    this.riderService.getEntries().subscribe(entries => {
      this.upcomingEntries = entries
        .filter(e => e.status !== 'Completed' && e.status !== 'Withdrawn')
        .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
        .slice(0, 3);
    });

    // Load recent results
    this.riderService.getRecentResults(3).subscribe(results => {
      this.recentResults = results;
      this.loading = false;
    });
  }

  getMembershipStatusClass(): string {
    if (!this.riderProfile?.membership) {
      return 'text-secondary';
    }

    switch (this.riderProfile.membership.status) {
      case 'Active':
        return 'text-success';
      case 'Pending':
        return 'text-warning';
      case 'Expired':
        return 'text-danger';
      case 'Suspended':
        return 'text-danger';
      default:
        return 'text-secondary';
    }
  }

  isExpiringSoon(): boolean {
    if (!this.riderProfile?.membership) {
      return false;
    }

    const validUntil = new Date(this.riderProfile.membership.validUntil);
    const today = new Date();
    const daysUntilExpiry = Math.floor((validUntil.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

