/**
 * Accounting Period Detail Component
 * Displays detailed information about a specific accounting period
 */

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DatePipe, CurrencyPipe, Location } from '@angular/common';

// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AccountingPeriod } from './accounting-periods-list-type';
import { ACCOUNTING_PERIODS } from './accounting-periods-list-data';

// NgBootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accounting-period-detail',
  standalone: true,
  imports: [SharedModule, RouterModule, DatePipe, CurrencyPipe],
  templateUrl: './accounting-period-detail.component.html',
  styleUrl: './accounting-period-detail.component.scss'
})
export class AccountingPeriodDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private modalService = inject(NgbModal);

  period: AccountingPeriod | null = null;
  loading = true;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPeriod(id);
  }

  /**
   * Load period data
   */
  loadPeriod(id: number): void {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.period = ACCOUNTING_PERIODS.find((p) => p.id === id) || null;
      this.loading = false;
    }, 300);
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'badge bg-light-success';
      case 'Inactive':
        return 'badge bg-light-secondary';
      case 'Closed':
        return 'badge bg-light-danger';
      default:
        return 'badge bg-light-secondary';
    }
  }

  /**
   * Navigate back
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Edit period
   */
  editPeriod(): void {
    if (this.period) {
      this.router.navigate(['/admin/settings/accounting-periods', this.period.id, 'edit']);
    }
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any): void {
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete period
   */
  deletePeriod(): void {
    if (this.period) {
      const index = ACCOUNTING_PERIODS.findIndex((p) => p.id === this.period!.id);
      if (index > -1) {
        ACCOUNTING_PERIODS.splice(index, 1);
        this.modalService.dismissAll();
        this.router.navigate(['/admin/settings/accounting-periods']);
      }
    }
  }

  /**
   * Calculate net income
   */
  getNetIncome(): number {
    if (!this.period) return 0;
    return (this.period.totalRevenue || 0) - (this.period.totalExpenses || 0);
  }
}

