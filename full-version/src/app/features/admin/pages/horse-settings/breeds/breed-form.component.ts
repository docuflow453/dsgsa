/**
 * Breed Form Component
 * Handles creation and editing of horse breeds
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Data
import { BreedStatus } from './breeds-list-type';
import { BREEDS } from './breeds-list-data';

@Component({
  selector: 'app-breed-form',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './breed-form.component.html',
  styleUrl: './breed-form.component.scss'
})
export class BreedFormComponent implements OnInit {
  breedForm!: FormGroup;
  submitted = false;
  isEditMode = false;
  breedId: number | null = null;
  pageTitle = 'Add Breed';
  statuses: BreedStatus[] = ['Active', 'Inactive'];
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
    this.breedForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      code: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.required],
      origin: [''],
      characteristics: [''],
      averageHeight: [''],
      temperament: [''],
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
      this.breedId = parseInt(id, 10);
      this.pageTitle = 'Edit Breed';
      this.loadBreed(this.breedId);
    }
  }

  /**
   * Load breed data for editing
   */
  loadBreed(id: number) {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      const breed = BREEDS.find(b => b.id === id);
      if (breed) {
        this.breedForm.patchValue({
          name: breed.name,
          code: breed.code,
          description: breed.description,
          origin: breed.origin,
          characteristics: breed.characteristics,
          averageHeight: breed.averageHeight,
          temperament: breed.temperament,
          status: breed.status,
          isActive: breed.isActive,
          displayOrder: breed.displayOrder,
          notes: breed.notes
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

    if (this.breedForm.invalid) {
      return;
    }

    this.saving = true;
    const formValue = this.breedForm.value;

    // Simulate API call
    setTimeout(() => {
      console.log('Saving breed:', formValue);
      this.saving = false;
      this.router.navigate(['/admin/horse-settings/breeds']);
    }, 500);
  }

  /**
   * Cancel and go back
   */
  cancel() {
    this.router.navigate(['/admin/horse-settings/breeds']);
  }

  /**
   * Sync status with isActive checkbox
   */
  onActiveChange() {
    const isActive = this.breedForm.get('isActive')?.value;
    this.breedForm.patchValue({
      status: isActive ? 'Active' : 'Inactive'
    });
  }
}

