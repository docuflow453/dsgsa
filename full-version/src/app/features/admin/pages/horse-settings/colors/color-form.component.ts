/**
 * Color Form Component
 * Handles creation and editing of horse colors
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Data
import { ColorStatus } from './colors-list-type';
import { COLORS } from './colors-list-data';

@Component({
  selector: 'app-color-form',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './color-form.component.html',
  styleUrl: './color-form.component.scss'
})
export class ColorFormComponent implements OnInit {
  colorForm!: FormGroup;
  submitted = false;
  isEditMode = false;
  colorId: number | null = null;
  pageTitle = 'Add Color';
  statuses: ColorStatus[] = ['Active', 'Inactive'];
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
    this.colorForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      code: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.required],
      hexCode: ['', [Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
      category: [''],
      isCommon: [false],
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
      this.colorId = parseInt(id, 10);
      this.pageTitle = 'Edit Color';
      this.loadColor(this.colorId);
    }
  }

  /**
   * Load color data for editing
   */
  loadColor(id: number) {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      const color = COLORS.find(c => c.id === id);
      if (color) {
        this.colorForm.patchValue({
          name: color.name,
          code: color.code,
          description: color.description,
          hexCode: color.hexCode,
          category: color.category,
          isCommon: color.isCommon,
          status: color.status,
          isActive: color.isActive,
          displayOrder: color.displayOrder,
          notes: color.notes
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

    if (this.colorForm.invalid) {
      return;
    }

    this.saving = true;
    const formValue = this.colorForm.value;

    // Simulate API call
    setTimeout(() => {
      console.log('Saving color:', formValue);
      this.saving = false;
      this.router.navigate(['/admin/horse-settings/colors']);
    }, 500);
  }

  /**
   * Cancel and go back
   */
  cancel() {
    this.router.navigate(['/admin/horse-settings/colors']);
  }

  /**
   * Sync status with isActive checkbox
   */
  onActiveChange() {
    const isActive = this.colorForm.get('isActive')?.value;
    this.colorForm.patchValue({
      status: isActive ? 'Active' : 'Inactive'
    });
  }
}

