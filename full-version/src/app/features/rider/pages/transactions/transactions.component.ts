import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RiderService } from '../../services/rider.service';
import { Transaction, DashboardStats } from '../../models/rider.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="transactions-page">
      <div class="page-header mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2>Transactions</h2>
          <p class="text-muted">View your payment history and pending payments</p>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-4 mb-3">
          <div class="stat-card">
            <h3>{{ formatCurrency(stats?.totalSpent || 0) }}</h3>
            <p>Total Spent</p>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="stat-card">
            <h3>{{ formatCurrency(stats?.pendingPayments || 0) }}</h3>
            <p>Pending Payments</p>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="stat-card">
            <h3>{{ transactions.length }}</h3>
            <p>Total Transactions</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h5><i class="ti ti-credit-card me-2"></i>Transaction History</h5>
        </div>
        <div class="card-body">
          <div *ngIf="transactions.length === 0" class="text-center text-muted py-4">
            <i class="ti ti-receipt-off" style="font-size: 3rem; opacity: 0.3;"></i>
            <p class="mt-2">No transactions yet</p>
          </div>
          <div *ngIf="transactions.length > 0" class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let transaction of transactions">
                  <td>{{ formatDate(transaction.date) }}</td>
                  <td>{{ transaction.description }}</td>
                  <td>{{ formatCurrency(transaction.amount) }}</td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success': transaction.status === 'Paid',
                      'bg-warning': transaction.status === 'Pending',
                      'bg-danger': transaction.status === 'Failed'
                    }">{{ transaction.status }}</span>
                  </td>
                  <td>
                    <button *ngIf="transaction.status === 'Paid'" class="btn btn-sm btn-outline-primary">
                      <i class="ti ti-download"></i> Receipt
                    </button>
                    <button *ngIf="transaction.status === 'Pending'" class="btn btn-sm btn-primary">
                      <i class="ti ti-credit-card"></i> Pay Now
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      h3 { font-size: 1.75rem; font-weight: 700; color: #1f2937; margin: 0 0 0.5rem 0; }
      p { color: #6b7280; margin: 0; }
    }
    .card { border: none; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
    .card-header { background: white; border-bottom: 1px solid #e5e7eb; padding: 1.25rem 1.5rem; }
    .card-header h5 { font-size: 1.125rem; font-weight: 600; color: #1f2937; margin: 0; }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  stats: DashboardStats | null = null;

  constructor(private riderService: RiderService) {}

  ngOnInit(): void {
    this.riderService.getTransactions().subscribe(transactions => {
      this.transactions = transactions;
    });
    this.riderService.getDashboardStats().subscribe(stats => {
      this.stats = stats;
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatCurrency(amount: number): string {
    return `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
  }
}

