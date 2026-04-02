import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShowHoldingBodyService } from '../../services/show-holding-body.service';
import { DashboardStats, RevenueData } from '../../models/show-holding-body.model';

@Component({
  selector: 'app-shb-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  revenueData: RevenueData[] = [];
  loading = true;

  constructor(private shbService: ShowHoldingBodyService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    this.shbService.getDashboardStats().subscribe(stats => {
      this.stats = stats;
      this.loading = false;
    });

    this.shbService.getRevenueData().subscribe(data => {
      this.revenueData = data;
    });
  }

  formatCurrency(amount: number): string {
    return `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-ZA', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'member_request': 'ti-user-plus',
      'competition_entry': 'ti-trophy',
      'payment': 'ti-credit-card',
      'competition_created': 'ti-calendar-plus'
    };
    return icons[type] || 'ti-bell';
  }
}

