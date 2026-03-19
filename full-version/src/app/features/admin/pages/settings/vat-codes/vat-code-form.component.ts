/**
 * VAT Code Form Component
 * Handles both creating and editing VAT codes
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Data
import { VATCode, VATCodeStatus } from './vat-codes-list-type';
import { VAT_CODES } from './vat-codes-list-data';

@Component({
  selector: 'app-vat-code-form',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './vat-code-form.component.html',
  styleUrl: './vat-code-form.component.scss'
})
export class VATCodeFormComponent implements OnInit {
  vatCodeForm!: FormGroup;
  isEditMode = false;
  vatCodeId: number = 0;
  pageTitle = 'Add VAT Code';
  submitted = false;

  // Dropdown options
  statuses: VATCodeStatus[] = ['Active', 'Inactive'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

  /**
   * Initialize form
   */
  initForm() {
    this.vatCodeForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      rate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      status: ['Active', Validators.required],
      effectiveDate: [''],
      expiryDate: [''],
      applicableToMemberships: [false],
      applicableToCompetitions: [false],
      notes: ['']
    });
  }

  /**
   * Check if in edit mode and load data
   */
  checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.vatCodeId = +id;
      this.pageTitle = 'Edit VAT Code';
      this.loadVATCodeData();
    }
  }

  /**
   * Load VAT code data for editing
   */
  loadVATCodeData() {
    const code = VAT_CODES.find((c) => c.id === this.vatCodeId);
    if (code) {
      this.vatCodeForm.patchValue({
        code: code.code,
        name: code.name,
        description: code.description,
        rate: code.rate,
        status: code.status,
        effectiveDate: code.effectiveDate,
        expiryDate: code.expiryDate,
        applicableToMemberships: code.applicableToMemberships,
        applicableToCompetitions: code.applicableToCompetitions,
        notes: code.notes
      });
    }
  }

  /**
   * Submit form
   */
  onSubmit() {
    this.submitted = true;
    if (this.vatCodeForm.valid) {
      console.log('Form submitted:', this.vatCodeForm.value);
      this.router.navigate(['/admin/settings/vat-codes']);
    }
  }

  /**
   * Cancel and go back
   */
  cancel() {
    this.router.navigate(['/admin/settings/vat-codes']);
  }
}

