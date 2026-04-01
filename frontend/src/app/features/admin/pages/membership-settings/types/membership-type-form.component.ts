/**
 * Membership Type Form Component
 * Handles both creating and editing membership types
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Data
import { MembershipType, RuleGroup, MembershipTypeStatus } from './membership-types-list-type';
import { MEMBERSHIP_TYPES } from './membership-types-list-data';

@Component({
  selector: 'app-membership-type-form',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule],
  templateUrl: './membership-type-form.component.html',
  styleUrl: './membership-type-form.component.scss'
})
export class MembershipTypeFormComponent implements OnInit {
  membershipTypeForm!: FormGroup;
  isEditMode = false;
  membershipTypeId: number = 0;
  pageTitle = 'Add Membership Type';
  submitted = false;

  // Dropdown options
  ruleGroups: RuleGroup[] = ['Individual', 'Organization', 'Junior', 'Senior', 'Professional', 'Amateur'];
  statuses: MembershipTypeStatus[] = ['Active', 'Inactive'];

  // Benefits management
  benefits: string[] = [];
  newBenefit = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();

    // Check if we're in edit mode
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.membershipTypeId = +params['id'];
        this.pageTitle = 'Edit Membership Type';
        this.loadMembershipType();
      }
    });
  }

  /**
   * Initialize the form
   */
  initializeForm() {
    this.membershipTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      ruleGroup: ['Individual', Validators.required],
      fee: [0, [Validators.required, Validators.min(0)]],
      status: ['Active', Validators.required],
      duration: [12, [Validators.required, Validators.min(0)]],
      maxMembers: [null],
      renewalRequired: [true],
      discountEligible: [false]
    });
  }

  /**
   * Load membership type data for editing
   */
  loadMembershipType() {
    const membershipType = MEMBERSHIP_TYPES.find((mt) => mt.id === this.membershipTypeId);
    
    if (membershipType) {
      this.membershipTypeForm.patchValue({
        name: membershipType.name,
        description: membershipType.description,
        ruleGroup: membershipType.ruleGroup,
        fee: membershipType.fee,
        status: membershipType.status,
        duration: membershipType.duration || 0,
        maxMembers: membershipType.maxMembers,
        renewalRequired: membershipType.renewalRequired,
        discountEligible: membershipType.discountEligible
      });

      // Load benefits
      if (membershipType.benefits) {
        this.benefits = [...membershipType.benefits];
      }
    } else {
      console.error('Membership Type not found');
      this.router.navigate(['/admin/settings/membership-types']);
    }
  }

  /**
   * Add benefit to the list
   */
  addBenefit() {
    if (this.newBenefit.trim()) {
      this.benefits.push(this.newBenefit.trim());
      this.newBenefit = '';
    }
  }

  /**
   * Remove benefit from the list
   */
  removeBenefit(index: number) {
    this.benefits.splice(index, 1);
  }

  /**
   * Form field getter for validation
   */
  get f() {
    return this.membershipTypeForm.controls;
  }

  /**
   * Submit the form
   */
  onSubmit() {
    this.submitted = true;

    if (this.membershipTypeForm.invalid) {
      return;
    }

    const formValue = this.membershipTypeForm.value;

    if (this.isEditMode) {
      // Update existing membership type
      const index = MEMBERSHIP_TYPES.findIndex((mt) => mt.id === this.membershipTypeId);
      if (index > -1) {
        MEMBERSHIP_TYPES[index] = {
          ...MEMBERSHIP_TYPES[index],
          ...formValue,
          benefits: this.benefits.length > 0 ? this.benefits : undefined,
          isActive: formValue.status === 'Active'
        };
      }
    } else {
      // Create new membership type
      const newMembershipType: MembershipType = {
        id: Math.max(...MEMBERSHIP_TYPES.map((mt) => mt.id)) + 1,
        ...formValue,
        dateCreated: new Date(),
        isActive: formValue.status === 'Active',
        benefits: this.benefits.length > 0 ? this.benefits : undefined
      };
      MEMBERSHIP_TYPES.push(newMembershipType);
    }

    // Navigate back to list
    this.router.navigate(['/admin/settings/membership-types']);
  }

  /**
   * Cancel and go back
   */
  onCancel() {
    this.router.navigate(['/admin/settings/membership-types']);
  }
}

