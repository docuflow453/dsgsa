/**
 * Show Form Component
 * Handles both creating new shows and editing existing shows
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Types and Data
import { Show, ShowStatus } from './shows-list-type';
import { SHOWS } from './shows-list-data';

@Component({
  selector: 'app-show-form',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule],
  templateUrl: './show-form.component.html',
  styleUrl: './show-form.component.scss'
})
export class ShowFormComponent implements OnInit {
  showForm!: FormGroup;
  isEditMode = false;
  showId: number = 0;
  pageTitle = 'Create Show';

  // Dropdown options
  statuses: ShowStatus[] = ['Upcoming', 'Open', 'Closed', 'Completed', 'Cancelled'];
  levels: string[] = ['Preliminary', 'Novice', 'Elementary', 'Medium', 'Advanced', 'Grand Prix', 'All Levels'];
  provinces: string[] = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'Northern Cape',
    'North West',
    'Western Cape'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialize form
    this.initForm();

    // Check if edit mode
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.showId = +params['id'];
        this.pageTitle = 'Edit Show';
        this.loadShow();
      }
    });
  }

  /**
   * Initialize form with validation
   */
  initForm() {
    this.showForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      showHoldingBody: ['', Validators.required],
      venue: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      entryClosingDate: ['', Validators.required],
      status: ['Upcoming', Validators.required],
      level: ['All Levels', Validators.required],
      description: [''],
      maxEntries: [100, [Validators.required, Validators.min(1)]],
      currentEntries: [0, [Validators.min(0)]],
      entryFee: [0, [Validators.required, Validators.min(0)]],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', Validators.required],
      province: ['', Validators.required],
      city: ['', Validators.required],
      isActive: [true],
      judges: [''],
      classes: ['']
    });
  }

  /**
   * Load show data for editing
   */
  loadShow() {
    const show = SHOWS.find((s) => s.id === this.showId);
    
    if (!show) {
      console.error('Show not found');
      this.router.navigate(['/admin/shows']);
      return;
    }

    // Format dates for input fields
    const formatDate = (date: Date) => {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };

    this.showForm.patchValue({
      name: show.name,
      showHoldingBody: show.showHoldingBody,
      venue: show.venue,
      startDate: formatDate(show.startDate),
      endDate: formatDate(show.endDate),
      entryClosingDate: formatDate(show.entryClosingDate),
      status: show.status,
      level: show.level,
      description: show.description || '',
      maxEntries: show.maxEntries || 100,
      currentEntries: show.currentEntries || 0,
      entryFee: show.entryFee || 0,
      contactEmail: show.contactEmail || '',
      contactPhone: show.contactPhone || '',
      province: show.province || '',
      city: show.city || '',
      isActive: show.isActive,
      judges: show.judges?.join(', ') || '',
      classes: show.classes?.join(', ') || ''
    });
  }

  /**
   * Submit form
   */
  onSubmit() {
    if (this.showForm.invalid) {
      this.showForm.markAllAsTouched();
      return;
    }

    const formValue = this.showForm.value;

    const showData: Show = {
      id: this.isEditMode ? this.showId : this.getNextId(),
      name: formValue.name,
      showHoldingBody: formValue.showHoldingBody,
      showHoldingBodyId: 1, // This would come from a dropdown in a real app
      venue: formValue.venue,
      startDate: new Date(formValue.startDate),
      endDate: new Date(formValue.endDate),
      entryClosingDate: new Date(formValue.entryClosingDate),
      status: formValue.status,
      level: formValue.level,
      dateCreated: this.isEditMode ? SHOWS.find((s) => s.id === this.showId)!.dateCreated : new Date(),
      isActive: formValue.isActive,
      description: formValue.description,
      maxEntries: formValue.maxEntries,
      currentEntries: formValue.currentEntries,
      entryFee: formValue.entryFee,
      contactEmail: formValue.contactEmail,
      contactPhone: formValue.contactPhone,
      province: formValue.province,
      city: formValue.city,
      judges: formValue.judges ? formValue.judges.split(',').map((j: string) => j.trim()).filter((j: string) => j) : [],
      classes: formValue.classes ? formValue.classes.split(',').map((c: string) => c.trim()).filter((c: string) => c) : []
    };

    if (this.isEditMode) {
      // Update existing show
      const index = SHOWS.findIndex((s) => s.id === this.showId);
      if (index > -1) {
        SHOWS[index] = showData;
      }
    } else {
      // Add new show
      SHOWS.push(showData);
    }

    // Navigate back to list
    this.router.navigate(['/admin/shows']);
  }

  /**
   * Get next available ID
   */
  getNextId(): number {
    return Math.max(...SHOWS.map((s) => s.id), 0) + 1;
  }

  /**
   * Cancel and go back
   */
  cancel() {
    this.router.navigate(['/admin/shows']);
  }

  /**
   * Check if field has error
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.showForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  /**
   * Get error message for field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.showForm.get(fieldName);

    if (!field || !field.errors) {
      return '';
    }

    if (field.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (field.hasError('minlength')) {
      const minLength = field.errors['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }

    if (field.hasError('min')) {
      const min = field.errors['min'].min;
      return `${this.getFieldLabel(fieldName)} must be at least ${min}`;
    }

    return '';
  }

  /**
   * Get field label
   */
  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Show Name',
      showHoldingBody: 'Show Holding Body',
      venue: 'Venue',
      startDate: 'Start Date',
      endDate: 'End Date',
      entryClosingDate: 'Entry Closing Date',
      status: 'Status',
      level: 'Level',
      description: 'Description',
      maxEntries: 'Maximum Entries',
      currentEntries: 'Current Entries',
      entryFee: 'Entry Fee',
      contactEmail: 'Contact Email',
      contactPhone: 'Contact Phone',
      province: 'Province',
      city: 'City',
      judges: 'Judges',
      classes: 'Classes'
    };
    return labels[fieldName] || fieldName;
  }
}

