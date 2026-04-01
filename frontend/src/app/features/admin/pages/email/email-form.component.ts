/**
 * Email Form Component
 * Handles creating and sending bulk emails
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Types and Data
import { BulkEmail, EmailType, RecipientGroup, EmailAttachment } from './email-list-type';
import { BULK_EMAILS } from './email-list-data';

@Component({
  selector: 'app-email-form',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule],
  templateUrl: './email-form.component.html',
  styleUrl: './email-form.component.scss'
})
export class EmailFormComponent implements OnInit {
  emailForm!: FormGroup;
  pageTitle = 'Send Bulk Email';
  attachments: EmailAttachment[] = [];

  // Dropdown options
  emailTypes: EmailType[] = ['General', 'Important', 'Marketing'];
  recipientGroups: RecipientGroup[] = [
    'All Members',
    'Riders',
    'Judges',
    'Clubs',
    'Show Holding Bodies',
    'Officials',
    'SAEF Admins'
  ];

  // Mock current user
  currentUser = {
    name: 'Admin User',
    email: 'admin@shyft.com'
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.initForm();
  }

  /**
   * Initialize form with validation
   */
  initForm() {
    this.emailForm = this.fb.group({
      subject: ['', [Validators.required, Validators.maxLength(200)]],
      content: ['', Validators.required],
      sentTo: ['', Validators.required],
      emailType: ['General', Validators.required]
    });
  }

  /**
   * Get recipient count based on selected group
   */
  getRecipientCount(): number {
    const sentTo = this.emailForm.get('sentTo')?.value;
    const recipientCounts: { [key in RecipientGroup]: number } = {
      'All Members': 1245,
      Riders: 856,
      Judges: 87,
      Clubs: 45,
      'Show Holding Bodies': 23,
      Officials: 34,
      'SAEF Admins': 5
    };
    return recipientCounts[sentTo as RecipientGroup] || 0;
  }

  /**
   * Open recipients modal
   */
  openRecipientsModal(content: any) {
    this.modalService.open(content, { size: 'lg', scrollable: true });
  }

  /**
   * Get mock recipient emails
   */
  getRecipientEmails(): string[] {
    const count = this.getRecipientCount();
    const emails: string[] = [];
    for (let i = 1; i <= Math.min(count, 20); i++) {
      emails.push(`user${i}@example.com`);
    }
    if (count > 20) {
      emails.push(`... and ${count - 20} more`);
    }
    return emails;
  }

  /**
   * Handle file upload
   */
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const attachment: EmailAttachment = {
        id: `att-${Date.now()}-${i}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        url: URL.createObjectURL(file)
      };
      this.attachments.push(attachment);
    }
  }

  /**
   * Remove attachment
   */
  removeAttachment(index: number) {
    this.attachments.splice(index, 1);
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
   * Send email
   */
  sendEmail() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    const formValue = this.emailForm.value;
    const recipientCount = this.getRecipientCount();

    if (
      confirm(
        `Are you sure you want to send this email to ${recipientCount} recipients?\n\nSubject: ${formValue.subject}\nRecipient Group: ${formValue.sentTo}`
      )
    ) {
      const newEmail: BulkEmail = {
        id: Math.max(...BULK_EMAILS.map((e) => e.id), 0) + 1,
        subject: formValue.subject,
        content: formValue.content,
        sentTo: formValue.sentTo,
        sentBy: this.currentUser.name,
        sentByEmail: this.currentUser.email,
        recipientCount: recipientCount,
        recipientEmails: this.getRecipientEmails(),
        dateSent: new Date(),
        dateCreated: new Date(),
        emailType: formValue.emailType,
        status: 'Sent',
        hasAttachments: this.attachments.length > 0,
        attachments: this.attachments,
        deliveryStats: {
          sent: recipientCount,
          delivered: recipientCount - Math.floor(Math.random() * 5),
          failed: Math.floor(Math.random() * 5),
          opened: Math.floor(recipientCount * 0.7),
          clicked: Math.floor(recipientCount * 0.4)
        }
      };

      BULK_EMAILS.unshift(newEmail);
      alert('Email sent successfully!');
      this.router.navigate(['/admin/email']);
    }
  }

  /**
   * Save as draft
   */
  saveAsDraft() {
    if (this.emailForm.get('subject')?.invalid || this.emailForm.get('content')?.invalid) {
      alert('Please provide at least a subject and content to save as draft.');
      return;
    }

    const formValue = this.emailForm.value;

    const draftEmail: BulkEmail = {
      id: Math.max(...BULK_EMAILS.map((e) => e.id), 0) + 1,
      subject: formValue.subject || 'Untitled Draft',
      content: formValue.content,
      sentTo: formValue.sentTo || 'All Members',
      sentBy: this.currentUser.name,
      sentByEmail: this.currentUser.email,
      recipientCount: 0,
      recipientEmails: [],
      dateCreated: new Date(),
      emailType: formValue.emailType,
      status: 'Draft',
      hasAttachments: this.attachments.length > 0,
      attachments: this.attachments
    };

    BULK_EMAILS.unshift(draftEmail);
    alert('Email saved as draft!');
    this.router.navigate(['/admin/email']);
  }

  /**
   * Cancel and go back
   */
  cancel() {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      this.router.navigate(['/admin/email']);
    }
  }

  /**
   * Check if field has error
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.emailForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  /**
   * Get error message for field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.emailForm.get(fieldName);

    if (!field || !field.errors) {
      return '';
    }

    if (field.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (field.hasError('maxlength')) {
      const maxLength = field.errors['maxlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must not exceed ${maxLength} characters`;
    }

    return '';
  }

  /**
   * Get field label
   */
  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      subject: 'Subject',
      content: 'Content',
      sentTo: 'Recipient Group',
      emailType: 'Email Type'
    };
    return labels[fieldName] || fieldName;
  }
}

