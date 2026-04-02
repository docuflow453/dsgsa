/**
 * District Form Component
 * Handles creating and editing districts
 */

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { District } from './districts-list-type';
import { DISTRICTS } from './districts-list-data';

@Component({
  selector: 'app-district-form',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './district-form.component.html',
  styleUrl: './district-form.component.scss'
})
export class DistrictFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  districtForm!: FormGroup;
  isEditMode = false;
  districtId: number | null = null;
  loading = false;
  submitted = false;

  // Dropdown options
  provinces = [
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

  statuses = ['Active', 'Inactive'];

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  /**
   * Initialize form
   */
  initForm(): void {
    this.districtForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(5)]],
      province: ['', Validators.required],
      description: [''],
      contactPerson: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]+$/)]],
      status: ['Active', Validators.required],
      address: [''],
      city: [''],
      postalCode: ['', Validators.pattern(/^[0-9]{4}$/)],
      website: ['', Validators.pattern(/^https?:\/\/.+/)],
      clubsCount: [0],
      membersCount: [0]
    });
  }

  /**
   * Check if in edit mode and load data
   */
  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.districtId = Number(id);
      this.loadDistrict(this.districtId);
    }
  }

  /**
   * Load district data for editing
   */
  loadDistrict(id: number): void {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      const district = DISTRICTS.find((d) => d.id === id);
      if (district) {
        this.districtForm.patchValue({
          name: district.name,
          code: district.code,
          province: district.province,
          description: district.description || '',
          contactPerson: district.contactPerson,
          email: district.email,
          phone: district.phone,
          status: district.status,
          address: district.address || '',
          city: district.city || '',
          postalCode: district.postalCode || '',
          website: district.website || '',
          clubsCount: district.clubsCount || 0,
          membersCount: district.membersCount || 0
        });
      }
      this.loading = false;
    }, 300);
  }

  /**
   * Get form control
   */
  get f() {
    return this.districtForm.controls;
  }

  /**
   * Submit form
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.districtForm.invalid) {
      return;
    }

    this.loading = true;

    // Simulate API call
    setTimeout(() => {
      const formValue = this.districtForm.value;

      if (this.isEditMode && this.districtId) {
        // Update existing district
        const index = DISTRICTS.findIndex((d) => d.id === this.districtId);
        if (index > -1) {
          DISTRICTS[index] = {
            ...DISTRICTS[index],
            ...formValue,
            isActive: formValue.status === 'Active'
          };
        }
      } else {
        // Create new district
        const newDistrict: District = {
          id: Math.max(...DISTRICTS.map((d) => d.id)) + 1,
          ...formValue,
          dateCreated: new Date(),
          isActive: formValue.status === 'Active'
        };
        DISTRICTS.push(newDistrict);
      }

      this.loading = false;
      this.router.navigate(['/admin/settings/districts']);
    }, 500);
  }

  /**
   * Cancel and go back
   */
  onCancel(): void {
    this.location.back();
  }
}

