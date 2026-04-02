/**
 * Payment Method Detail Component
 * Displays detailed information about a payment method
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Service
import { PaymentMethod } from './payment-methods-list-type';
import { PaymentMethodsListService } from './payment-methods-list.service';

@Component({
  selector: 'app-payment-method-detail',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule],
  templateUrl: './payment-method-detail.component.html',
  styleUrl: './payment-method-detail.component.scss'
})
export class PaymentMethodDetailComponent implements OnInit {
  paymentMethod: PaymentMethod | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private paymentMethodsService: PaymentMethodsListService
  ) {}

  ngOnInit() {
    this.loadPaymentMethod();
  }

  /**
   * Load payment method details
   */
  loadPaymentMethod() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.paymentMethodsService.getPaymentMethodById(parseInt(id, 10)).subscribe({
        next: (paymentMethod) => {
          this.paymentMethod = paymentMethod || null;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading payment method:', error);
          this.loading = false;
        }
      });
    }
  }

  /**
   * Navigate to edit page
   */
  editPaymentMethod() {
    if (this.paymentMethod) {
      this.router.navigate(['/admin/settings/payment-methods', this.paymentMethod.id, 'edit']);
    }
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete payment method
   */
  deletePaymentMethod() {
    if (this.paymentMethod) {
      this.paymentMethodsService.deletePaymentMethod(this.paymentMethod.id).subscribe({
        next: () => {
          this.modalService.dismissAll();
          this.router.navigate(['/admin/settings/payment-methods']);
        },
        error: (error) => {
          console.error('Error deleting payment method:', error);
        }
      });
    }
  }

  /**
   * Go back to list
   */
  goBack() {
    this.router.navigate(['/admin/settings/payment-methods']);
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    return status === 'Active' ? 'bg-success' : 'bg-secondary';
  }

  /**
   * Format date
   */
  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

