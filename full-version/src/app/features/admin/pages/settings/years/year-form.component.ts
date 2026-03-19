/**
 * Year Form Component
 * Handles both creating and editing years
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Data
import { Year, YearStatus } from './years-list-type';
import { YEARS } from './years-list-data';

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
  yearId: number = 0;
  pageTitle = 'Add Year';
  submitted = false;

  // Dropdown options
  statuses: YearStatus[] = ['Active', 'Inactive', 'Archived'];

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
    this.yearForm = this.fb.group({
      year: ['', [Validators.required, Validators.min(2020), Validators.max(2100)]],
      name: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['Active', Validators.required],
      registrationOpen: [false],
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
      this.yearId = +id;
      this.pageTitle = 'Edit Year';
      this.loadYearData();
    }
  }

  /**
   * Load year data for editing
   */
  loadYearData() {
    const year = YEARS.find((y) => y.id === this.yearId);
    if (year) {
      this.yearForm.patchValue({
        year: year.year,
        name: year.name,
        description: year.description,
        startDate: year.startDate,
        endDate: year.endDate,
        status: year.status,
        registrationOpen: year.registrationOpen,
        notes: year.notes
      });
    }
  }

  /**
   * Submit form
   */
  onSubmit() {
    this.submitted = true;
    if (this.yearForm.valid) {
      console.log('Form submitted:', this.yearForm.value);
      this.router.navigate(['/admin/settings/years']);
    }
  }

  /**
   * Cancel and go back
   */
  cancel() {
    this.router.navigate(['/admin/settings/years']);
  }
}

