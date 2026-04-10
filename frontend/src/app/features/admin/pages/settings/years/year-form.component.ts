/**
 * Year Form Component
 * Handles both creating and editing years
 */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Service
import { Year, YearStatus, YearCreatePayload, YearUpdatePayload } from './years-list-type';
import { YearsListService } from './years-list.service';

@Component({
  selector: 'app-year-form',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './year-form.component.html',
  styleUrl: './year-form.component.scss'
})
export class YearFormComponent implements OnInit {
  yearForm!: FormGroup;
  isEditMode = false;
  yearId: string = '';
  pageTitle = 'Add Year';
  submitted = false;
  loading = false;
  saving = false;

  // Dropdown options
  statuses: YearStatus[] = ['PENDING', 'ACTIVE', 'COMPLETE', 'ARCHIVED'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private yearsService: YearsListService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

  /**
   * Initialize form
   */
  initForm() {
    this.yearForm = this.fb.group({
      year: ['', [Validators.required, Validators.min(2020), Validators.max(2100)]],
      name: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      status: ['PENDING', Validators.required],
      is_registration_open: [false],
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
      this.yearId = id;
      this.pageTitle = 'Edit Year';
      this.loadYearData();
    }
  }

  /**
   * Load year data for editing from backend
   */
  loadYearData() {
    // Defer the loading state change to avoid NG0100 error
    // This happens because we're in ngOnInit and the template has already been checked
    setTimeout(() => {
      this.loading = true;
      this.cdr.detectChanges();

      this.yearsService.getYearById(this.yearId).subscribe({
        next: (year) => {
          this.yearForm.patchValue({
            year: year.year,
            name: year.name,
            start_date: year.start_date,
            end_date: year.end_date,
            status: year.status,
            is_registration_open: year.is_registration_open,
            notes: year.notes
          });
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading year:', error);
          this.loading = false;
          this.cdr.detectChanges();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load year data. Please try again.'
          }).then(() => {
            this.router.navigate(['/admin/settings/years']);
          });
        }
      });
    }, 0);
  }

  /**
   * Submit form
   */
  onSubmit() {
    this.submitted = true;

    if (this.yearForm.invalid) {
      return;
    }

    this.saving = true;
    const formValue = this.yearForm.value;

    if (this.isEditMode) {
      // Update existing year
      const payload: YearUpdatePayload = {
        name: formValue.name,
        year: formValue.year,
        start_date: formValue.start_date,
        end_date: formValue.end_date,
        status: formValue.status,
        is_registration_open: formValue.is_registration_open,
        notes: formValue.notes
      };

      this.yearsService.updateYear(this.yearId, payload).subscribe({
        next: () => {
          this.saving = false;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Year updated successfully!'
          }).then(() => {
            this.router.navigate(['/admin/settings/years']);
          });
        },
        error: (error) => {
          console.error('Error updating year:', error);
          this.saving = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Failed to update year. Please try again.'
          });
        }
      });
    } else {
      // Create new year
      const payload: YearCreatePayload = {
        name: formValue.name,
        year: formValue.year,
        start_date: formValue.start_date,
        end_date: formValue.end_date,
        status: formValue.status,
        is_registration_open: formValue.is_registration_open,
        notes: formValue.notes
      };

      this.yearsService.createYear(payload).subscribe({
        next: () => {
          this.saving = false;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Year created successfully!'
          }).then(() => {
            this.router.navigate(['/admin/settings/years']);
          });
        },
        error: (error) => {
          console.error('Error creating year:', error);
          this.saving = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Failed to create year. Please try again.'
          });
        }
      });
    }
  }

  /**
   * Cancel and go back
   */
  cancel() {
    this.router.navigate(['/admin/settings/years']);
  }

  /**
   * Validate that end date is after start date
   */
  validateDates() {
    const startDate = this.yearForm.get('start_date')?.value;
    const endDate = this.yearForm.get('end_date')?.value;

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      this.yearForm.get('end_date')?.setErrors({ invalidDate: true });
    }
  }
}

