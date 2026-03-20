/**
 * Class Type Form Component
 * Handles creation and editing of class types
 */

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ClassType, ClassTypeStatus, ClassCategory } from './class-types-list-type';
import { CLASS_TYPES } from './class-types-list-data';

@Component({
  selector: 'app-class-type-form',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule],
  templateUrl: './class-type-form.component.html',
  styleUrl: './class-type-form.component.scss'
})
export class ClassTypeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  classTypeForm!: FormGroup;
  isEditMode = false;
  classTypeId: number | null = null;
  loading = false;
  submitted = false;

  // Dropdown options
  statuses: ClassTypeStatus[] = ['Active', 'Inactive'];
  categories: ClassCategory[] = ['Dressage', 'Show Jumping', 'Eventing', 'Combined Training', 'Working Equitation'];

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  /**
   * Initialize form
   */
  initForm(): void {
    this.classTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      category: ['', Validators.required],
      description: [''],
      status: ['Active', Validators.required],
      minAge: [0, [Validators.min(0)]],
      maxAge: [100, [Validators.min(0)]],
      minHeight: [null, [Validators.min(0)]],
      maxHeight: [null, [Validators.min(0)]],
      duration: [5, [Validators.required, Validators.min(1)]],
      judgesRequired: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      entryFee: [150, [Validators.required, Validators.min(0)]],
      maxEntries: [30, [Validators.required, Validators.min(1)]],
      color: ['#6c757d'],
      order: [1, [Validators.required, Validators.min(1)]],
      entriesCount: [0, [Validators.min(0)]],
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
      this.classTypeId = Number(id);
      this.loadClassType();
    }
  }

  /**
   * Load class type data for editing
   */
  loadClassType(): void {
    if (this.classTypeId) {
      const classType = CLASS_TYPES.find((ct) => ct.id === this.classTypeId);
      if (classType) {
        this.classTypeForm.patchValue({
          name: classType.name,
          code: classType.code,
          category: classType.category,
          description: classType.description || '',
          status: classType.status,
          minAge: classType.minAge || 0,
          maxAge: classType.maxAge || 100,
          minHeight: classType.minHeight || null,
          maxHeight: classType.maxHeight || null,
          duration: classType.duration || 5,
          judgesRequired: classType.judgesRequired || 1,
          entryFee: classType.entryFee || 150,
          maxEntries: classType.maxEntries || 30,
          color: classType.color || '#6c757d',
          order: classType.order,
          entriesCount: classType.entriesCount || 0,
          notes: classType.notes || ''
        });
      }
    }
  }

  /**
   * Form control getter
   */
  get f() {
    return this.classTypeForm.controls;
  }

  /**
   * Submit form
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.classTypeForm.invalid) {
      return;
    }

    this.loading = true;

    // Simulate API call
    setTimeout(() => {
      const formValue = this.classTypeForm.value;

      if (this.isEditMode && this.classTypeId) {
        // Update existing class type
        const index = CLASS_TYPES.findIndex((ct) => ct.id === this.classTypeId);
        if (index > -1) {
          CLASS_TYPES[index] = {
            ...CLASS_TYPES[index],
            ...formValue,
            isActive: formValue.status === 'Active'
          };
        }
      } else {
        // Create new class type
        const newClassType: ClassType = {
          id: Math.max(...CLASS_TYPES.map((ct) => ct.id)) + 1,
          ...formValue,
          dateCreated: new Date(),
          isActive: formValue.status === 'Active'
        };
        CLASS_TYPES.push(newClassType);
      }

      this.loading = false;
      this.router.navigate(['/admin/grading/class-types']);
    }, 1000);
  }

  /**
   * Cancel and go back
   */
  onCancel(): void {
    this.router.navigate(['/admin/grading/class-types']);
  }
}

