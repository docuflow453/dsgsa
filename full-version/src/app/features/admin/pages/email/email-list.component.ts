/**
 * Email List Component
 * Displays and manages bulk email logs with search, filter, and pagination
 */

import { Component, QueryList, ViewChildren } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { NgbdSortableHeaderDirective, SortEvent } from '../../../../theme/shared/directive/sortable.directive';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Service and Types
import { EmailListService } from './email-list.service';
import { BulkEmail, EmailType, RecipientGroup, EmailStatus } from './email-list-type';

@Component({
  selector: 'app-email-list',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, NgbPaginationModule, FormsModule, NgbHighlight, DatePipe],
  templateUrl: './email-list.component.html',
  styleUrl: './email-list.component.scss',
  providers: [EmailListService]
})
export class EmailListComponent  {
  emails$: Observable<BulkEmail[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  @ViewChildren(NgbdSortableHeaderDirective) headers!: QueryList<NgbdSortableHeaderDirective>;

  // Filter options
  emailTypes: EmailType[];
  recipientGroups: RecipientGroup[];
  statuses: EmailStatus[];

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(public service: EmailListService) {
    this.emails$ = service.emails$;
    this.total$ = service.total$;
    this.loading$ = service.loading$;
    this.emailTypes = service.getUniqueEmailTypes();
    this.recipientGroups = service.getUniqueRecipientGroups();
    this.statuses = service.getUniqueStatuses();
  }



  /**
   * Handle sort event
   */
  onSort({ column, direction }: SortEvent) {
    // Reset other headers
    // this.headers.forEach((header) => {
    //   if (header.sortable !== column) {
    //     header.direction = '';
    //   }
    // });
    //
    // this.service.sortColumn = column;
    // this.service.sortDirection = direction;
  }

  /**
   * Get email type badge class
   */
  getEmailTypeBadgeClass(emailType: EmailType): string {
    const badgeClasses: { [key in EmailType]: string } = {
      General: 'badge bg-light-primary',
      Important: 'badge bg-light-danger',
      Marketing: 'badge bg-light-success'
    };
    return badgeClasses[emailType];
  }

  /**
   * Get status badge class
   */
  getStatusBadgeClass(status: EmailStatus): string {
    const badgeClasses: { [key in EmailStatus]: string } = {
      Sent: 'badge bg-light-success',
      Draft: 'badge bg-light-warning',
      Archived: 'badge bg-light-secondary',
      Failed: 'badge bg-light-danger'
    };
    return badgeClasses[status];
  }

  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Resend email
   */
  resendEmail(email: BulkEmail, event: Event) {
    event.stopPropagation();
    if (confirm(`Are you sure you want to resend "${email.subject}" to ${email.recipientCount} recipients?`)) {
      this.service.resendEmail(email.id).subscribe({
        next: (success) => {
          if (success) {
            alert('Email has been resent successfully!');
          }
        },
        error: (error) => {
          console.error('Error resending email:', error);
          alert('Failed to resend email. Please try again.');
        }
      });
    }
  }

  /**
   * Archive email
   */
  archiveEmail(email: BulkEmail, event: Event) {
    event.stopPropagation();
    if (confirm(`Are you sure you want to archive "${email.subject}"?`)) {
      this.service.archiveEmail(email.id).subscribe({
        next: (success) => {
          if (success) {
            alert('Email has been archived successfully!');
          }
        },
        error: (error) => {
          console.error('Error archiving email:', error);
          alert('Failed to archive email. Please try again.');
        }
      });
    }
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this.service.resetFilters();
  }
}

