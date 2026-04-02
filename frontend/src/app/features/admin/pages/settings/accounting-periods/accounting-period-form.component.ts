/**
 * Accounting Period Form Component
 * Handles creating and editing accounting periods
 */

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AccountingPeriod } from './accounting-periods-list-type';
import { ACCOUNTING_PERIODS } from './accounting-periods-list-data';

@Component({
  selector: 'app-accounting-period-form',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './accounting-period-form.component.html',
  styleUrl: './accounting-period-form.component.scss'
})
export class AccountingPeriodFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  periodForm!: FormGroup;
  isEditMode = false;
  periodId: number | null = null;
  loading = false;
  submitted = false;

  // Dropdown options
  statuses = ['Active', 'Inactive', 'Closed'];
  quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  /**
   * Initialize form
   */
  initForm(): void {
    this.periodForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: [''],
      status: ['Active', Validators.required],
      fiscalYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      quarter: [''],
      notes: ['']
    });
  }

  /**
   * Check if in edit mode and load data
   */
  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.periodId = Number(id);
      this.loadPeriod(this.periodId);
    }
  }

  /**
   * Load period data for editing
   */
  loadPeriod(id: number): void {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      const period = ACCOUNTING_PERIODS.find((p) => p.id === id);
      if (period) {
        this.periodForm.patchValue({
          name: period.name,
          code: period.code,
          startDate: this.formatDateForInput(period.startDate),
          endDate: this.formatDateForInput(period.endDate),
          description: period.description || '',
          status: period.status,
          fiscalYear: period.fiscalYear,
          quarter: period.quarter || '',
          notes: period.notes || ''
        });
      }
      this.loading = false;
    }, 300);
  }

  /**
   * Format date for input field
   */
  formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get form control
   */
  get f() {
    return this.periodForm.controls;
  }

  /**
   * Submit form
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.periodForm.invalid) {
      return;
    }

    // Validate end date is after start date
    const startDate = new Date(this.periodForm.value.startDate);
    const endDate = new Date(this.periodForm.value.endDate);
    if (endDate <= startDate) {
      alert('End date must be after start date');
      return;
    }

    this.loading = true;

    // Simulate API call
    setTimeout(() => {
      const formValue = this.periodForm.value;

      if (this.isEditMode && this.periodId) {
        // Update existing period
        const index = ACCOUNTING_PERIODS.findIndex((p) => p.id === this.periodId);
        if (index > -1) {
          ACCOUNTING_PERIODS[index] = {
            ...ACCOUNTING_PERIODS[index],
            ...formValue,
            startDate: new Date(formValue.startDate),
            endDate: new Date(formValue.endDate),
            isActive: formValue.status === 'Active',
            isClosed: formValue.status === 'Closed'
          };
        }
      } else {
        // Create new period
        const newPeriod: AccountingPeriod = {
          id: Math.max(...ACCOUNTING_PERIODS.map((p) => p.id)) + 1,
          ...formValue,
          startDate: new Date(formValue.startDate),
          endDate: new Date(formValue.endDate),
          dateCreated: new Date(),
          isActive: formValue.status === 'Active',
          isClosed: formValue.status === 'Closed',
          transactionsCount: 0,
          totalRevenue: 0,
          totalExpenses: 0
        };
        ACCOUNTING_PERIODS.push(newPeriod);
      }

      this.loading = false;
      this.router.navigate(['/admin/settings/accounting-periods']);
    }, 500);
  }

  /**
   * Cancel and go back
   */
  onCancel(): void {
    this.location.back();
  }
}

