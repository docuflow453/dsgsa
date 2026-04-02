import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShowHoldingBodyService } from '../../services/show-holding-body.service';

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  processingFee: number;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {
  paymentMethods: PaymentMethod[] = [];
  loading = true;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  constructor(private shbService: ShowHoldingBodyService) {}

  ngOnInit(): void {
    this.loadPaymentMethods();
  }

  loadPaymentMethods(): void {
    this.loading = true;
    this.shbService.getPaymentMethods().subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payment methods:', error);
        this.showErrorToast('Failed to load payment methods');
        this.loading = false;
      }
    });
  }

  toggleStatus(method: PaymentMethod): void {
    const updatedMethod = { ...method, isActive: !method.isActive };
    this.shbService.updatePaymentMethod(method.id, updatedMethod).subscribe({
      next: (response) => {
        this.showSuccessToast(`Payment method ${updatedMethod.isActive ? 'enabled' : 'disabled'} successfully`);
        this.loadPaymentMethods();
      },
      error: (error) => {
        this.showErrorToast('Failed to update payment method');
      }
    });
  }

  showSuccessToast(message: string): void {
    this.toastMessage = message;
    this.toastType = 'success';
    this.showToast = true;
    setTimeout(() => { this.showToast = false; }, 3000);
  }

  showErrorToast(message: string): void {
    this.toastMessage = message;
    this.toastType = 'error';
    this.showToast = true;
    setTimeout(() => { this.showToast = false; }, 3000);
  }
}

