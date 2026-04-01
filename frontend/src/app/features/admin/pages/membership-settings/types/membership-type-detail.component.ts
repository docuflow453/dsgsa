/**
 * Membership Type Detail Component
 * Displays detailed information about a specific membership type
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Data
import { MembershipType } from './membership-types-list-type';
import { MEMBERSHIP_TYPES } from './membership-types-list-data';

@Component({
  selector: 'app-membership-type-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, DatePipe, CurrencyPipe],
  templateUrl: './membership-type-detail.component.html',
  styleUrl: './membership-type-detail.component.scss'
})
export class MembershipTypeDetailComponent implements OnInit {
  membershipType: MembershipType | null = null;
  membershipTypeId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    // Get membership type ID from route
    this.route.params.subscribe((params) => {
      this.membershipTypeId = +params['id'];
      this.loadMembershipType();
    });
  }

  /**
   * Load membership type data
   */
  loadMembershipType() {
    this.membershipType = MEMBERSHIP_TYPES.find((mt) => mt.id === this.membershipTypeId) || null;

    if (!this.membershipType) {
      console.error('Membership Type not found');
      this.router.navigate(['/admin/settings/membership-types']);
    }
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      Active: 'badge bg-light-success',
      Inactive: 'badge bg-light-secondary'
    };
    return statusClasses[status] || 'badge bg-light-secondary';
  }

  /**
   * Get rule group badge class
   */
  getRuleGroupClass(ruleGroup: string): string {
    const ruleGroupClasses: { [key: string]: string } = {
      Individual: 'badge bg-light-primary',
      Organization: 'badge bg-light-info',
      Junior: 'badge bg-light-warning',
      Senior: 'badge bg-light-success',
      Professional: 'badge bg-light-danger',
      Amateur: 'badge bg-light-secondary'
    };
    return ruleGroupClasses[ruleGroup] || 'badge bg-light-secondary';
  }

  /**
   * Navigate to edit page
   */
  editMembershipType() {
    this.router.navigate(['/admin/settings/membership-types', this.membershipTypeId, 'edit']);
  }

  /**
   * Navigate back to list
   */
  goBack() {
    this.router.navigate(['/admin/settings/membership-types']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete membership type
   */
  deleteMembershipType() {
    const index = MEMBERSHIP_TYPES.findIndex((mt) => mt.id === this.membershipTypeId);
    if (index > -1) {
      MEMBERSHIP_TYPES.splice(index, 1);
      this.modalService.dismissAll();
      this.router.navigate(['/admin/settings/membership-types']);
    }
  }
}

