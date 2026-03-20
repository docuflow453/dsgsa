/**
 * Accounting Periods List Component
 * Displays all accounting periods in the system with search, filter, sort, and action capabilities
 */

import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DecimalPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs';

// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AccountingPeriod } from './accounting-periods-list-type';
import { AccountingPeriodsListService } from './accounting-periods-list.service';

// NgBootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accounting-periods-list',
  standalone: true,
  imports: [SharedModule, RouterModule, DatePipe, CurrencyPipe],
  templateUrl: './accounting-periods-list.component.html',
  styleUrl: './accounting-periods-list.component.scss',
  providers: [AccountingPeriodsListService, DecimalPipe]
})
export class AccountingPeriodsListComponent implements OnInit {
  service = inject(AccountingPeriodsListService);
  private modalService = inject(NgbModal);
  private router = inject(Router);

  // Public props
  periods$: Observable<AccountingPeriod[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  // Filter options
  statuses: string[] = ['Active', 'Inactive', 'Closed'];
  fiscalYears: string[] = [];

  // Selected period for actions
  selectedPeriod: AccountingPeriod | null = null;

  // Constructor
  constructor() {
    this.periods$ = this.service.periods$;
    this.total$ = this.service.total$;
    this.loading$ = this.service.loading$;
  }

  ngOnInit(): void {
    // Load filter options
    this.fiscalYears = this.service.getUniqueFiscalYears();
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
   * Navigate to create page
   */
  createPeriod(): void {
    this.router.navigate(['/admin/settings/accounting-periods/create']);
  }

  /**
   * View period details
   */
  viewPeriod(period: AccountingPeriod): void {
    this.router.navigate(['/admin/settings/accounting-periods', period.id]);
  }

  /**
   * Edit period
   */
  editPeriod(period: AccountingPeriod): void {
    this.router.navigate(['/admin/settings/accounting-periods', period.id, 'edit']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any, period: AccountingPeriod): void {
    this.selectedPeriod = period;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete period
   */
  deletePeriod(): void {
    if (this.selectedPeriod) {
      this.service.deletePeriod(this.selectedPeriod.id);
      this.modalService.dismissAll();
      this.selectedPeriod = null;
    }
  }

  /**
   * Reset filters
   */
  resetFilters(): void {
    this.service.resetFilters();
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number | undefined): string {
    if (!amount) return 'R 0';
    return `R ${(amount / 1000).toFixed(0)}k`;
  }
}

