/**
 * Email Detail Component
 * Displays detailed information about a specific bulk email
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Types and Data
import { BulkEmail, EmailType, EmailStatus } from './email-list-type';
import { BULK_EMAILS } from './email-list-data';
import { EmailListService } from './email-list.service';

@Component({
  selector: 'app-email-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, DatePipe],
  templateUrl: './email-detail.component.html',
  styleUrl: './email-detail.component.scss'
})
export class EmailDetailComponent implements OnInit {
  email: BulkEmail | null = null;
  emailId: number = 0;
  showRecipients = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private emailService: EmailListService
  ) {}

  ngOnInit() {
    // Get email ID from route
    this.route.params.subscribe((params) => {
      this.emailId = +params['id'];
      this.loadEmail();
    });
  }

  /**
   * Load email data
   */
  loadEmail() {
    this.email = BULK_EMAILS.find((e) => e.id === this.emailId) || null;
    
    if (!this.email) {
      console.error('Email not found');
      this.router.navigate(['/admin/email']);
    }
  }

  /**
   * Get sanitized HTML content
   */
  getSanitizedContent(): SafeHtml {
    if (!this.email) return '';
    return this.sanitizer.sanitize(1, this.email.content) || '';
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
   * Toggle recipients list
   */
  toggleRecipients() {
    this.showRecipients = !this.showRecipients;
  }

  /**
   * Navigate back to list
   */
  goBack() {
    this.router.navigate(['/admin/email']);
  }

  /**
   * Resend email
   */
  resendEmail() {
    if (!this.email) return;
    
    if (confirm(`Are you sure you want to resend "${this.email.subject}" to ${this.email.recipientCount} recipients?`)) {
      this.emailService.resendEmail(this.emailId).subscribe({
        next: (success) => {
          if (success) {
            alert('Email has been resent successfully!');
            this.router.navigate(['/admin/email']);
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
  archiveEmail() {
    if (!this.email) return;
    
    if (confirm(`Are you sure you want to archive "${this.email.subject}"?`)) {
      this.emailService.archiveEmail(this.emailId).subscribe({
        next: (success) => {
          if (success) {
            alert('Email has been archived successfully!');
            this.loadEmail(); // Reload to show updated status
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
   * Calculate delivery rate percentage
   */
  getDeliveryRate(): number {
    if (!this.email?.deliveryStats) return 0;
    const { sent, delivered } = this.email.deliveryStats;
    return sent > 0 ? Math.round((delivered / sent) * 100) : 0;
  }

  /**
   * Calculate open rate percentage
   */
  getOpenRate(): number {
    if (!this.email?.deliveryStats) return 0;
    const { delivered, opened } = this.email.deliveryStats;
    return delivered > 0 ? Math.round((opened / delivered) * 100) : 0;
  }
}

