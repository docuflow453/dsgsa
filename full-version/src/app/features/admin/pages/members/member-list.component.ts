/**
 * Member List Component
 * Displays all users in the system with search, filter, sort, and action capabilities
 */

import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MemberUser } from './member-list-type';
import { MemberListService } from './member-list.service';

// Icon service
import {
  DeleteOutline,
  EditOutline,
  EyeOutline,
  KeyOutline,
  LockOutline,
  UnlockOutline
} from '@ant-design/icons-angular/icons';
import { IconService } from '@ant-design/icons-angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-member-list',
  imports: [SharedModule, RouterModule, DatePipe],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss',
  providers: [MemberListService, DecimalPipe]
})
export class MemberListComponent implements OnInit {
  service = inject(MemberListService);
  private iconService = inject(IconService);
  private modalService = inject(NgbModal);

  // Public props
  members$: Observable<MemberUser[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  // Filter options
  roles: string[] = [];
  membershipTypes: string[] = [];
  countries: string[] = [];
  statuses: string[] = ['Active', 'Inactive', 'Banned'];

  // Selected member for actions
  selectedMember: MemberUser | null = null;

  // Constructor
  constructor() {
    this.members$ = this.service.members$;
    this.total$ = this.service.total$;
    this.loading$ = this.service.loading$;

    // Register icons
    this.iconService.addIcon(...[EyeOutline, DeleteOutline, EditOutline, KeyOutline, LockOutline, UnlockOutline]);
  }

  ngOnInit(): void {
    // Load filter options
    this.roles = this.service.getUniqueRoles();
    this.membershipTypes = this.service.getUniqueMembershipTypes();
    this.countries = this.service.getUniqueCountries();
  }

  // Get status badge class
  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'badge bg-light-success';
      case 'Inactive':
        return 'badge bg-light-secondary';
      case 'Banned':
        return 'badge bg-light-danger';
      default:
        return 'badge bg-light-secondary';
    }
  }

  // Get role badge class
  getRoleClass(role: string): string {
    switch (role) {
      case 'Admin':
        return 'badge bg-light-danger';
      case 'SAEF Admin':
        return 'badge bg-light-warning';
      case 'Judge':
        return 'badge bg-light-info';
      case 'Show Holding Body':
        return 'badge bg-light-primary';
      case 'Rider':
        return 'badge bg-light-success';
      case 'Club':
        return 'badge bg-light-secondary';
      case 'Official':
        return 'badge bg-light-dark';
      default:
        return 'badge bg-light-secondary';
    }
  }

  // Get country flag emoji
  getCountryFlag(countryCode: string): string {
    // Convert country code to flag emoji
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  // Action methods
  viewMember(member: MemberUser): void {
    console.log('View member:', member);
    // TODO: Navigate to member details or open modal
  }

  editMember(member: MemberUser): void {
    console.log('Edit member:', member);
    // TODO: Navigate to edit page or open modal
  }

  openChangePasswordModal(content: any, member: MemberUser): void {
    this.selectedMember = member;
    this.modalService.open(content, { centered: true });
  }

  changePassword(): void {
    if (this.selectedMember) {
      console.log('Change password for:', this.selectedMember);
      // TODO: Implement password change logic
      this.modalService.dismissAll();
      this.selectedMember = null;
    }
  }

  openBanModal(content: any, member: MemberUser): void {
    this.selectedMember = member;
    this.modalService.open(content, { centered: true });
  }

  toggleBanStatus(): void {
    if (this.selectedMember) {
      if (this.selectedMember.isBanned) {
        this.service.unbanMember(this.selectedMember.id);
      } else {
        this.service.banMember(this.selectedMember.id);
      }
      this.modalService.dismissAll();
      this.selectedMember = null;
    }
  }

  openDeleteModal(content: any, member: MemberUser): void {
    this.selectedMember = member;
    this.modalService.open(content, { centered: true });
  }

  deleteMember(): void {
    if (this.selectedMember) {
      this.service.deleteMember(this.selectedMember.id);
      this.modalService.dismissAll();
      this.selectedMember = null;
    }
  }

  // Get full name
  getFullName(member: MemberUser): string {
    return `${member.firstName} ${member.lastName}`;
  }

  // Reset filters
  resetFilters(): void {
    this.service.searchTerm = '';
    this.service.roleFilter = '';
    this.service.statusFilter = '';
    this.service.membershipTypeFilter = '';
    this.service.countryFilter = '';
  }
}

