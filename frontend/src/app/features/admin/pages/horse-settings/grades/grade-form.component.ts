/**
 * Grade Form Component
 * Handles creation and editing of horse grades
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Data
import { GradeStatus } from './grades-list-type';
import { GRADES } from './grades-list-data';

@Component({
  selector: 'app-grade-form',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './grade-form.component.html',
  styleUrl: './grade-form.component.scss'
})
export class GradeFormComponent implements OnInit {
  gradeForm!: FormGroup;
  submitted = false;
  isEditMode = false;
  gradeId: number | null = null;
  pageTitle = 'Add Grade';
  statuses: GradeStatus[] = ['Active', 'Inactive'];
  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.checkEditMode();
  }

  /**
   * Initialize the form
   */
  initializeForm() {
    this.gradeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      code: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.required],
      level: [0, [Validators.required, Validators.min(0)]],
      minScore: [null, [Validators.min(0), Validators.max(100)]],
      maxScore: [null, [Validators.min(0), Validators.max(100)]],
      status: ['Active', Validators.required],
      isActive: [true],
      displayOrder: [0, [Validators.required, Validators.min(0)]],
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
      this.gradeId = parseInt(id, 10);
      this.pageTitle = 'Edit Grade';
      this.loadGrade(this.gradeId);
    }
  }

  /**
   * Load grade data for editing
   */
  loadGrade(id: number) {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      const grade = GRADES.find(g => g.id === id);
      if (grade) {
        this.gradeForm.patchValue({
          name: grade.name,
          code: grade.code,
          description: grade.description,
          level: grade.level,
          minScore: grade.minScore,
          maxScore: grade.maxScore,
          status: grade.status,
          isActive: grade.isActive,
          displayOrder: grade.displayOrder,
          notes: grade.notes
        });
      }
      this.loading = false;
    }, 300);
  }

  /**
   * Handle form submission
   */
  onSubmit() {
    this.submitted = true;

    if (this.gradeForm.invalid) {
      return;
    }

    this.saving = true;
    const formValue = this.gradeForm.value;

    // Simulate API call
    setTimeout(() => {
      console.log('Saving grade:', formValue);
      this.saving = false;
      this.router.navigate(['/admin/horse-settings/grades']);
    }, 500);
  }

  /**
   * Cancel and go back
   */
  cancel() {
    this.router.navigate(['/admin/horse-settings/grades']);
  }

  /**
   * Sync status with isActive checkbox
   */
  onActiveChange() {
    const isActive = this.gradeForm.get('isActive')?.value;
    this.gradeForm.patchValue({
      status: isActive ? 'Active' : 'Inactive'
    });
  }
}

