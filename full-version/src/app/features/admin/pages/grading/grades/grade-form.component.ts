/**
 * Grade Form Component
 * Handles creation and editing of grades
 */

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Grade, GradeStatus, GradeLevel } from './grades-list-type';
import { GRADES } from './grades-list-data';

@Component({
  selector: 'app-grade-form',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule],
  templateUrl: './grade-form.component.html',
  styleUrl: './grade-form.component.scss'
})
export class GradeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  gradeForm!: FormGroup;
  isEditMode = false;
  gradeId: number | null = null;
  loading = false;
  submitted = false;

  // Dropdown options
  statuses: GradeStatus[] = ['Active', 'Inactive'];
  levels: GradeLevel[] = [
    'Preliminary',
    'Novice',
    'Elementary',
    'Medium',
    'Advanced Medium',
    'Advanced',
    'Prix St Georges',
    'Intermediate I',
    'Intermediate II',
    'Grand Prix'
  ];

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  /**
   * Initialize form
   */
  initForm(): void {
    this.gradeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      level: ['', Validators.required],
      description: [''],
      status: ['Active', Validators.required],
      minScore: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      maxScore: [100, [Validators.required, Validators.min(0), Validators.max(100)]],
      passingScore: [60, [Validators.required, Validators.min(0), Validators.max(100)]],
      color: ['#6c757d'],
      order: [1, [Validators.required, Validators.min(1)]],
      testsCount: [0, [Validators.min(0)]],
      ridersCount: [0, [Validators.min(0)]],
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
      this.gradeId = Number(id);
      this.loadGrade();
    }
  }

  /**
   * Load grade data for editing
   */
  loadGrade(): void {
    if (this.gradeId) {
      const grade = GRADES.find((g) => g.id === this.gradeId);
      if (grade) {
        this.gradeForm.patchValue({
          name: grade.name,
          code: grade.code,
          level: grade.level,
          description: grade.description || '',
          status: grade.status,
          minScore: grade.minScore,
          maxScore: grade.maxScore,
          passingScore: grade.passingScore,
          color: grade.color || '#6c757d',
          order: grade.order,
          testsCount: grade.testsCount || 0,
          ridersCount: grade.ridersCount || 0,
          notes: grade.notes || ''
        });
      }
    }
  }

  /**
   * Form control getter
   */
  get f() {
    return this.gradeForm.controls;
  }

  /**
   * Submit form
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.gradeForm.invalid) {
      return;
    }

    this.loading = true;

    // Simulate API call
    setTimeout(() => {
      const formValue = this.gradeForm.value;

      if (this.isEditMode && this.gradeId) {
        // Update existing grade
        const index = GRADES.findIndex((g) => g.id === this.gradeId);
        if (index > -1) {
          GRADES[index] = {
            ...GRADES[index],
            ...formValue,
            isActive: formValue.status === 'Active'
          };
        }
      } else {
        // Create new grade
        const newGrade: Grade = {
          id: Math.max(...GRADES.map((g) => g.id)) + 1,
          ...formValue,
          dateCreated: new Date(),
          isActive: formValue.status === 'Active'
        };
        GRADES.push(newGrade);
      }

      this.loading = false;
      this.router.navigate(['/admin/grading/grades']);
    }, 1000);
  }

  /**
   * Cancel and go back
   */
  onCancel(): void {
    this.router.navigate(['/admin/grading/grades']);
  }
}

