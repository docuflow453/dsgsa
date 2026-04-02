/**
 * Document Detail Component
 * Displays detailed information about a specific document
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Types and Service
import { Document } from './documents-list-type';
import { DocumentsListService } from './documents-list.service';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, DatePipe],
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.scss',
  providers: [DocumentsListService]
})
export class DocumentDetailComponent implements OnInit {
  document: Document | null = null;
  documentId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private service: DocumentsListService
  ) {}

  ngOnInit() {
    // Get document ID from route
    this.route.params.subscribe((params) => {
      this.documentId = +params['id'];
      this.loadDocument();
    });
  }

  /**
   * Load document data
   */
  loadDocument() {
    this.document = this.service.getDocumentById(this.documentId) || null;
    
    if (!this.document) {
      console.error('Document not found');
      // Optionally redirect to list page
      // this.router.navigate(['/admin/documents']);
    }
  }

  /**
   * Navigate to edit page
   */
  editDocument() {
    if (this.document) {
      this.router.navigate(['/admin/documents', this.document.id, 'edit']);
    }
  }

  /**
   * Delete document with confirmation
   */
  deleteDocument(content: any) {
    this.modalService.open(content, { centered: true }).result.then(
      (result) => {
        if (result === 'confirm' && this.document) {
          this.service.deleteDocument(this.document.id).subscribe(() => {
            this.router.navigate(['/admin/documents']);
          });
        }
      },
      () => {
        // Modal dismissed
      }
    );
  }

  /**
   * Navigate back to list
   */
  goBack() {
    this.router.navigate(['/admin/documents']);
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      Active: 'badge bg-light-success',
      Inactive: 'badge bg-light-secondary',
      Draft: 'badge bg-light-warning',
      Archived: 'badge bg-light-danger'
    };
    return statusClasses[status] || 'badge bg-light-secondary';
  }

  /**
   * Get file type icon class
   */
  getFileTypeIcon(fileType: string): string {
    const iconClasses: { [key: string]: string } = {
      PDF: 'ti ti-file-type-pdf text-danger',
      DOC: 'ti ti-file-type-doc text-primary',
      DOCX: 'ti ti-file-type-docx text-primary',
      XLS: 'ti ti-file-type-xls text-success',
      XLSX: 'ti ti-file-type-xlsx text-success',
      JPG: 'ti ti-file-type-jpg text-info',
      PNG: 'ti ti-file-type-png text-info',
      ZIP: 'ti ti-file-type-zip text-warning'
    };
    return iconClasses[fileType] || 'ti ti-file text-secondary';
  }

  /**
   * Get document type badge class
   */
  getTypeClass(type: string): string {
    const typeClasses: { [key: string]: string } = {
      'Dressage Test': 'badge bg-light-primary',
      'Rule Book': 'badge bg-light-danger',
      'Form': 'badge bg-light-success',
      'Template': 'badge bg-light-info',
      'Guide': 'badge bg-light-warning',
      'Policy': 'badge bg-light-secondary',
      'Certificate': 'badge bg-light-success',
      'Report': 'badge bg-light-info'
    };
    return typeClasses[type] || 'badge bg-light-secondary';
  }

  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    return this.service.formatFileSize(bytes);
  }

  /**
   * Download document
   */
  downloadDocument() {
    if (this.document && this.document.fileUrl) {
      // In a real app, this would trigger a file download
      window.open(this.document.fileUrl, '_blank');
    }
  }
}

