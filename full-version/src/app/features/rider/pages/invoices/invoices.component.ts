import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RiderService } from '../../services/rider.service';
import { Invoice } from '../../models/rider.model';

/**
 * Invoices Component - View and manage invoices
 */
@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  loading = false;
  selectedStatus = 'All';
  
  statusOptions = ['All', 'Pending', 'Paid', 'Overdue', 'Cancelled'];

  constructor(private riderService: RiderService) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    this.riderService.getInvoices().subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        this.filterInvoices();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.loading = false;
      }
    });
  }

  filterInvoices(): void {
    if (this.selectedStatus === 'All') {
      this.filteredInvoices = this.invoices;
    } else {
      this.filteredInvoices = this.invoices.filter(inv => inv.status === this.selectedStatus);
    }
  }

  onStatusChange(): void {
    this.filterInvoices();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Overdue':
        return 'danger';
      case 'Cancelled':
        return 'secondary';
      default:
        return 'secondary';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'Membership':
        return 'ti-id-badge';
      case 'Entry Fee':
        return 'ti-ticket';
      case 'Subscription':
        return 'ti-repeat';
      default:
        return 'ti-file-invoice';
    }
  }

  viewInvoice(invoice: Invoice): void {
    // TODO: Open invoice detail modal or navigate to detail page
    console.log('View invoice:', invoice);
    alert(`Viewing invoice ${invoice.invoiceNumber}\n\nThis would open a detailed view of the invoice.`);
  }

  downloadInvoice(invoice: Invoice): void {
    this.riderService.downloadInvoice(invoice.id).subscribe({
      next: (blob) => {
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${invoice.invoiceNumber}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading invoice:', error);
        alert('Failed to download invoice. Please try again.');
      }
    });
  }

  getTotalPending(): number {
    return this.invoices
      .filter(inv => inv.status === 'Pending' || inv.status === 'Overdue')
      .reduce((sum, inv) => sum + (inv.total - inv.paidAmount), 0);
  }

  getTotalPaid(): number {
    return this.invoices
      .filter(inv => inv.status === 'Paid')
      .reduce((sum, inv) => sum + inv.paidAmount, 0);
  }

  getOverdueCount(): number {
    return this.invoices.filter(inv => inv.status === 'Overdue').length;
  }
}

