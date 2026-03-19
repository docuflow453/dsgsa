/**
 * School Form Component
 * Handles both creating and editing schools
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Data
import { School, SchoolStatus, SchoolType } from './schools-list-type';
import { SCHOOLS } from './schools-list-data';

@Component({
  selector: 'app-school-form',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './school-form.component.html',
  styleUrl: './school-form.component.scss'
})
export class SchoolFormComponent implements OnInit {
  schoolForm!: FormGroup;
  isEditMode = false;
  schoolId: number = 0;
  pageTitle = 'Add School';
  submitted = false;

  // Dropdown options
  statuses: SchoolStatus[] = ['Active', 'Inactive'];
  types: SchoolType[] = ['Riding School', 'Training Center', 'Equestrian Club', 'Private Facility', 'Competition Venue'];
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

  // Facilities management
  facilities: string[] = [];
  newFacility = '';
  availableFacilities: string[] = [
    'Indoor Arena',
    'Outdoor Arena',
    'Stabling',
    'Clubhouse',
    'Parking',
    'Restaurant',
    'Tack Shop',
    'Cross Country Course',
    'Polo Fields',
    'Beach Access',
    'VIP Lounge',
    'Viewing Gallery',
    'Lecture Hall',
    'Library',
    'Spa',
    'Paddocks'
  ];

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
    this.schoolForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['Riding School', Validators.required],
      contactPerson: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      province: ['Gauteng', Validators.required],
      postalCode: ['', Validators.required],
      status: ['Active', Validators.required],
      website: [''],
      description: [''],
      instructorCount: [null, [Validators.min(0)]],
      studentCapacity: [null, [Validators.min(0)]]
    });
  }

  /**
   * Check if in edit mode and load data
   */
  checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.schoolId = +id;
      this.pageTitle = 'Edit School';
      this.loadSchoolData();
    }
  }

  /**
   * Load school data for editing
   */
  loadSchoolData() {
    const school = SCHOOLS.find((s) => s.id === this.schoolId);
    if (school) {
      this.schoolForm.patchValue({
        name: school.name,
        type: school.type,
        contactPerson: school.contactPerson,
        email: school.email,
        phone: school.phone,
        address: school.address,
        city: school.city,
        province: school.province,
        postalCode: school.postalCode,
        status: school.status,
        website: school.website,
        description: school.description,
        instructorCount: school.instructorCount,
        studentCapacity: school.studentCapacity
      });

      // Load facilities
      if (school.facilities) {
        this.facilities = [...school.facilities];
      }
    } else {
      this.router.navigate(['/admin/settings/schools']);
    }
  }

  /**
   * Add facility to the list
   */
  addFacility() {
    if (this.newFacility.trim() && !this.facilities.includes(this.newFacility.trim())) {
      this.facilities.push(this.newFacility.trim());
      this.newFacility = '';
    }
  }

  /**
   * Remove facility from the list
   */
  removeFacility(index: number) {
    this.facilities.splice(index, 1);
  }

  /**
   * Form field getter for validation
   */
  get f() {
    return this.schoolForm.controls;
  }

  /**
   * Submit form
   */
  onSubmit() {
    this.submitted = true;

    if (this.schoolForm.invalid) {
      return;
    }

    const formValue = this.schoolForm.value;

    if (this.isEditMode) {
      // Update existing school
      const index = SCHOOLS.findIndex((s) => s.id === this.schoolId);
      if (index > -1) {
        SCHOOLS[index] = {
          ...SCHOOLS[index],
          ...formValue,
          facilities: this.facilities.length > 0 ? this.facilities : undefined,
          isActive: formValue.status === 'Active'
        };
      }
    } else {
      // Create new school
      const newSchool: School = {
        id: Math.max(...SCHOOLS.map((s) => s.id)) + 1,
        ...formValue,
        dateCreated: new Date(),
        isActive: formValue.status === 'Active',
        facilities: this.facilities.length > 0 ? this.facilities : undefined
      };
      SCHOOLS.push(newSchool);
    }

    // Navigate back to list
    this.router.navigate(['/admin/settings/schools']);
  }

  /**
   * Cancel and go back
   */
  onCancel() {
    this.router.navigate(['/admin/settings/schools']);
  }
}

