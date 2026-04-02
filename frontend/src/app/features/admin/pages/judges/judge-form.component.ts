/**
 * Judge Form Component
 * Handles both creating new judges and editing existing judges
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Types and Data
import { Judge, JudgeStatus, JudgeType } from './judges-list-type';
import { JUDGES } from './judges-list-data';

@Component({
  selector: 'app-judge-form',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule],
  templateUrl: './judge-form.component.html',
  styleUrl: './judge-form.component.scss'
})
export class JudgeFormComponent implements OnInit {
  judgeForm!: FormGroup;
  isEditMode = false;
  judgeId: number = 0;
  pageTitle = 'Create Judge';

  // Dropdown options
  statuses: JudgeStatus[] = ['Active', 'Inactive'];
  judgeTypes: JudgeType[] = ['National', 'International', 'Candidate', 'Apprentice'];
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
  specializations: string[] = [
    'Preliminary',
    'Novice',
    'Elementary',
    'Medium',
    'Advanced',
    'Grand Prix',
    'Grand Prix Special',
    'Freestyle'
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
        this.judgeId = +params['id'];
        this.pageTitle = 'Edit Judge';
        this.loadJudge();
      }
    });
  }

  /**
   * Initialize form with validation
   */
  initForm() {
    this.judgeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      judgeType: ['National', Validators.required],
      licenseNumber: ['', [Validators.required, Validators.minLength(5)]],
      status: ['Active', Validators.required],
      province: [''],
      city: [''],
      specialization: [''],
      yearsOfExperience: [0, [Validators.min(0)]],
      certificationDate: [''],
      isActive: [true],
      image: ['']
    });
  }

  /**
   * Load judge data for editing
   */
  loadJudge() {
    const judge = JUDGES.find((j) => j.id === this.judgeId);

    if (!judge) {
      console.error('Judge not found');
      this.router.navigate(['/admin/judges']);
      return;
    }

    // Format date for input field
    const formatDate = (date: Date) => {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };

    this.judgeForm.patchValue({
      firstName: judge.firstName,
      lastName: judge.lastName,
      email: judge.email,
      phone: judge.phone || '',
      judgeType: judge.judgeType,
      licenseNumber: judge.licenseNumber,
      status: judge.status,
      province: judge.province || '',
      city: judge.city || '',
      specialization: judge.specialization || '',
      yearsOfExperience: judge.yearsOfExperience || 0,
      certificationDate: judge.certificationDate ? formatDate(judge.certificationDate) : '',
      isActive: judge.isActive,
      image: judge.image || ''
    });
  }

  /**
   * Submit form
   */
  onSubmit() {
    if (this.judgeForm.invalid) {
      this.judgeForm.markAllAsTouched();
      return;
    }

    const formValue = this.judgeForm.value;

    const judgeData: Judge = {
      id: this.isEditMode ? this.judgeId : this.getNextId(),
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      judgeType: formValue.judgeType,
      licenseNumber: formValue.licenseNumber,
      status: formValue.status,
      dateCreated: this.isEditMode ? JUDGES.find((j) => j.id === this.judgeId)!.dateCreated : new Date(),
      isActive: formValue.isActive,
      province: formValue.province,
      city: formValue.city,
      specialization: formValue.specialization,
      yearsOfExperience: formValue.yearsOfExperience,
      certificationDate: formValue.certificationDate ? new Date(formValue.certificationDate) : undefined,
      image: formValue.image
    };

    if (this.isEditMode) {
      // Update existing judge
      const index = JUDGES.findIndex((j) => j.id === this.judgeId);
      if (index > -1) {
        JUDGES[index] = judgeData;
      }
    } else {
      // Add new judge
      JUDGES.push(judgeData);
    }

    // Navigate back to detail page or list
    if (this.isEditMode) {
      this.router.navigate(['/admin/judges', this.judgeId]);
    } else {
      this.router.navigate(['/admin/judges']);
    }
  }

  /**
   * Get next available ID
   */
  getNextId(): number {
    return Math.max(...JUDGES.map((j) => j.id), 0) + 1;
  }

  /**
   * Cancel and go back
   */
  cancel() {
    if (this.isEditMode) {
      this.router.navigate(['/admin/judges', this.judgeId]);
    } else {
      this.router.navigate(['/admin/judges']);
    }
  }

  /**
   * Check if field has error
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.judgeForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  /**
   * Get error message for field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.judgeForm.get(fieldName);

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
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      judgeType: 'Judge Type',
      licenseNumber: 'License Number',
      status: 'Status',
      province: 'Province',
      city: 'City',
      specialization: 'Specialization',
      yearsOfExperience: 'Years of Experience',
      certificationDate: 'Certification Date',
      image: 'Image URL'
    };
    return labels[fieldName] || fieldName;
  }
}

