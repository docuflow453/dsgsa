/**
 * Payment Method Form Component
 * Handles creation and editing of payment methods
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Service
import { PaymentMethodStatus } from './payment-methods-list-type';
import { PaymentMethodsListService } from './payment-methods-list.service';

@Component({
  selector: 'app-payment-method-form',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './payment-method-form.component.html',
  styleUrl: './payment-method-form.component.scss'
})
export class PaymentMethodFormComponent implements OnInit {
  paymentMethodForm!: FormGroup;
  submitted = false;
  isEditMode = false;
  paymentMethodId: number | null = null;
  pageTitle = 'Add Payment Method';
  statuses: PaymentMethodStatus[] = ['Active', 'Inactive'];
  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentMethodsService: PaymentMethodsListService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.checkEditMode();
  }

  /**
   * Initialize the form
   */
  initializeForm() {
    this.paymentMethodForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      code: ['', [Validators.required, Validators.maxLength(50)]],
      description: [''],
      processingFee: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      status: ['Active', Validators.required],
      isActive: [true],
      allowForEntries: [true],
      allowForRenewals: [true],
      notes: ['']
    });
  }

  /**
   * Check if we're in edit mode and load data
   */
  checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.paymentMethodId = parseInt(id, 10);
      this.pageTitle = 'Edit Payment Method';
      this.loadPaymentMethod(this.paymentMethodId);
    }
  }

  /**
   * Load payment method data for editing
   */
  loadPaymentMethod(id: number) {
    this.loading = true;
    this.paymentMethodsService.getPaymentMethodById(id).subscribe({
      next: (paymentMethod) => {
        if (paymentMethod) {
          this.paymentMethodForm.patchValue({
            name: paymentMethod.name,
            code: paymentMethod.code,
            description: paymentMethod.description,
            processingFee: paymentMethod.processingFee,
            status: paymentMethod.status,
            isActive: paymentMethod.isActive,
            allowForEntries: paymentMethod.allowForEntries,
            allowForRenewals: paymentMethod.allowForRenewals,
            notes: paymentMethod.notes
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payment method:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Handle form submission
   */
  onSubmit() {
    this.submitted = true;

    if (this.paymentMethodForm.invalid) {
      return;
    }

    this.saving = true;
    const formValue = this.paymentMethodForm.value;

    if (this.isEditMode && this.paymentMethodId) {
      this.paymentMethodsService.updatePaymentMethod(this.paymentMethodId, formValue).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/admin/settings/payment-methods']);
        },
        error: (error) => {
          console.error('Error updating payment method:', error);
          this.saving = false;
        }
      });
    } else {
      this.paymentMethodsService.createPaymentMethod(formValue).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/admin/settings/payment-methods']);
        },
        error: (error) => {
          console.error('Error creating payment method:', error);
          this.saving = false;
        }
      });
    }
  }

  /**
   * Cancel and go back
   */
  cancel() {
    this.router.navigate(['/admin/settings/payment-methods']);
  }

  /**
   * Sync status with isActive checkbox
   */
  onActiveChange() {
    const isActive = this.paymentMethodForm.get('isActive')?.value;
    this.paymentMethodForm.patchValue({
      status: isActive ? 'Active' : 'Inactive'
    });
  }
}

