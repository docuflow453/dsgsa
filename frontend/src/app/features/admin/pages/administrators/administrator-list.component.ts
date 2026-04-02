/**
 * Administrator List Component
 * Displays and manages the list of administrators in the system
 */

import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Service and Types
import { AdministratorListService } from './administrator-list.service';
import { AdministratorUser } from './administrator-list-type';

@Component({
  selector: 'app-administrator-list',
  standalone: true,
  imports: [SharedModule, RouterModule, DatePipe],
  templateUrl: './administrator-list.component.html',
  styleUrl: './administrator-list.component.scss',
  providers: [AdministratorListService, DecimalPipe]
})
export class AdministratorListComponent implements OnInit {
  administrators$: Observable<AdministratorUser[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  selectedAdministrator: AdministratorUser | null = null;

  // Filter options
  uniqueRoles: string[] = [];
  uniqueStatuses: string[] = [];

  constructor(
    public service: AdministratorListService,
    private modalService: NgbModal
  ) {
    this.administrators$ = service.administrators$;
    this.total$ = service.total$;
    this.loading$ = service.loading$;
  }

  ngOnInit() {
    // Load filter options
    this.uniqueRoles = this.service.getUniqueRoles();
    this.uniqueStatuses = this.service.getUniqueStatuses();
  }

  /**
   * Get full name of administrator
   */
  getFullName(administrator: AdministratorUser): string {
    return `${administrator.firstName} ${administrator.lastName}`;
  }

  /**
   * Get country flag emoji
   */
  getCountryFlag(countryCode: string): string {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  /**
   * Get role badge class
   */
  getRoleClass(role: string): string {
    const roleClasses: { [key: string]: string } = {
      'Super Admin': 'badge bg-light-danger',
      'SAEF Admin': 'badge bg-light-primary',
      'SAEF Official': 'badge bg-light-info',
      'System Administrator': 'badge bg-light-warning',
      'Admin': 'badge bg-light-secondary'
    };
    return roleClasses[role] || 'badge bg-light-secondary';
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      Active: 'badge bg-light-success',
      Inactive: 'badge bg-light-secondary',
      Banned: 'badge bg-light-danger'
    };
    return statusClasses[status] || 'badge bg-light-secondary';
  }

  /**
   * Sort table by column
   */
  onSort(column: string) {
    // Implement sorting logic through service
    console.log('Sorting by:', column);
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this.service.resetFilters();
  }

  /**
   * View administrator details
   */
  viewAdministrator(administrator: AdministratorUser) {
    console.log('View administrator:', administrator);
    // Navigate to administrator details page or open modal
  }

  /**
   * Edit administrator
   */
  editAdministrator(administrator: AdministratorUser) {
    console.log('Edit administrator:', administrator);
    // Navigate to administrator edit page or open modal
  }

  /**
   * Open change password modal
   */
  openChangePasswordModal(content: any, administrator: AdministratorUser) {
    this.selectedAdministrator = administrator;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Change password
   */
  changePassword() {
    if (this.selectedAdministrator) {
      this.service.changePassword(this.selectedAdministrator.id, 'newPassword').subscribe(() => {
        console.log('Password changed successfully');
        this.modalService.dismissAll();
        this.selectedAdministrator = null;
      });
    }
  }

  /**
   * Open ban/unban modal
   */
  openBanModal(content: any, administrator: AdministratorUser) {
    this.selectedAdministrator = administrator;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Toggle ban status
   */
  toggleBanStatus() {
    if (this.selectedAdministrator) {
      this.service.toggleBanStatus(this.selectedAdministrator.id).subscribe(() => {
        console.log('Ban status toggled successfully');
        this.modalService.dismissAll();
        this.selectedAdministrator = null;
      });
    }
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any, administrator: AdministratorUser) {
    this.selectedAdministrator = administrator;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete administrator
   */
  deleteAdministrator() {
    if (this.selectedAdministrator) {
      this.service.deleteAdministrator(this.selectedAdministrator.id).subscribe(() => {
        console.log('Administrator deleted successfully');
        this.modalService.dismissAll();
        this.selectedAdministrator = null;
      });
    }
  }
}

