/**
 * Payment Methods List Component
 * Displays and manages payment methods
 */

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Data
import { PaymentMethod } from './payment-methods-list-type';
import { PaymentMethodsListService } from './payment-methods-list.service';

@Component({
  selector: 'app-payment-methods-list',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule],
  templateUrl: './payment-methods-list.component.html',
  styleUrl: './payment-methods-list.component.scss'
})
export class PaymentMethodsListComponent implements OnInit {
  paymentMethods: PaymentMethod[] = [];
  filteredPaymentMethods: PaymentMethod[] = [];
  searchText = '';
  selectedPaymentMethod: PaymentMethod | null = null;
  loading = false;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private paymentMethodsService: PaymentMethodsListService
  ) {}

  ngOnInit() {
    this.loadPaymentMethods();
  }

  /**
   * Load payment methods data
   */
  loadPaymentMethods() {
    this.loading = true;
    this.paymentMethodsService.getPaymentMethods().subscribe({
      next: (data) => {
        this.paymentMethods = data;
        this.filteredPaymentMethods = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payment methods:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Filter payment methods based on search text
   */
  filterPaymentMethods() {
    if (!this.searchText) {
      this.filteredPaymentMethods = this.paymentMethods;
      return;
    }

    const searchLower = this.searchText.toLowerCase();
    this.filteredPaymentMethods = this.paymentMethods.filter(
      (method) =>
        method.name.toLowerCase().includes(searchLower) ||
        method.code.toLowerCase().includes(searchLower) ||
        method.description.toLowerCase().includes(searchLower) ||
        method.status.toLowerCase().includes(searchLower)
    );
  }

  /**
   * Navigate to create page
   */
  createPaymentMethod() {
    this.router.navigate(['/admin/settings/payment-methods/create']);
  }

  /**
   * View payment method details
   */
  viewPaymentMethod(paymentMethod: PaymentMethod) {
    this.router.navigate(['/admin/settings/payment-methods', paymentMethod.id]);
  }

  /**
   * Edit payment method
   */
  editPaymentMethod(paymentMethod: PaymentMethod) {
    this.router.navigate(['/admin/settings/payment-methods', paymentMethod.id, 'edit']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any, paymentMethod: PaymentMethod) {
    this.selectedPaymentMethod = paymentMethod;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete payment method
   */
  deletePaymentMethod() {
    if (this.selectedPaymentMethod) {
      this.paymentMethodsService.deletePaymentMethod(this.selectedPaymentMethod.id).subscribe({
        next: () => {
          this.loadPaymentMethods();
          this.modalService.dismissAll();
          this.selectedPaymentMethod = null;
        },
        error: (error) => {
          console.error('Error deleting payment method:', error);
        }
      });
    }
  }

  /**
   * Toggle active status
   */
  toggleActiveStatus(paymentMethod: PaymentMethod, event: Event) {
    event.stopPropagation();
    this.paymentMethodsService.toggleActiveStatus(paymentMethod.id).subscribe({
      next: (updated) => {
        const index = this.paymentMethods.findIndex(pm => pm.id === updated.id);
        if (index !== -1) {
          this.paymentMethods[index] = updated;
          this.filterPaymentMethods();
        }
      },
      error: (error) => {
        console.error('Error toggling status:', error);
      }
    });
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    return status === 'Active' ? 'bg-success' : 'bg-secondary';
  }
}

