/**
 * Membership Types List Component
 * Displays and manages the list of Membership Types in the system
 */

import { Component, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Service and Types
import { MembershipTypesListService } from './membership-types-list.service';
import { MembershipType } from './membership-types-list-type';

@Component({
  selector: 'app-membership-types-list',
  standalone: true,
  imports: [SharedModule, RouterModule, DatePipe, CurrencyPipe],
  templateUrl: './membership-types-list.component.html',
  styleUrl: './membership-types-list.component.scss',
  providers: [MembershipTypesListService, DecimalPipe]
})
export class MembershipTypesListComponent implements OnInit {
  membershipTypes$: Observable<MembershipType[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  selectedMembershipType: MembershipType | null = null;

  // Filter options
  statuses: string[] = [];
  ruleGroups: string[] = [];

  constructor(
    public service: MembershipTypesListService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.membershipTypes$ = service.membershipTypes$;
    this.total$ = service.total$;
    this.loading$ = service.loading$;
  }

  ngOnInit() {
    // Load filter options
    this.statuses = this.service.getUniqueStatuses();
    this.ruleGroups = this.service.getUniqueRuleGroups();
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
   * Reset all filters
   */
  resetFilters() {
    this.service.resetFilters();
  }

  /**
   * Navigate to create page
   */
  createMembershipType() {
    this.router.navigate(['/admin/settings/membership-types/create']);
  }

  /**
   * View membership type details
   */
  viewMembershipType(membershipType: MembershipType) {
    this.router.navigate(['/admin/settings/membership-types', membershipType.id]);
  }

  /**
   * Edit membership type
   */
  editMembershipType(membershipType: MembershipType) {
    this.router.navigate(['/admin/settings/membership-types', membershipType.id, 'edit']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any, membershipType: MembershipType) {
    this.selectedMembershipType = membershipType;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete membership type
   */
  deleteMembershipType() {
    if (this.selectedMembershipType) {
      this.service.deleteMembershipType(this.selectedMembershipType.id).subscribe(() => {
        console.log('Membership Type deleted successfully');
        this.modalService.dismissAll();
        this.selectedMembershipType = null;
      });
    }
  }
}

