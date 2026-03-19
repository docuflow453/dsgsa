/**
 * Documents List Component
 * Displays and manages the list of Documents in the system
 */

import { Component, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Service and Types
import { DocumentsListService } from './documents-list.service';
import { Document, SortColumn, SortDirection } from './documents-list-type';

@Component({
  selector: 'app-documents-list',
  standalone: true,
  imports: [SharedModule, RouterModule, DatePipe],
  templateUrl: './documents-list.component.html',
  styleUrl: './documents-list.component.scss',
  providers: [DocumentsListService, DecimalPipe]
})
export class DocumentsListComponent implements OnInit {
  documents$: Observable<Document[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  selectedDocument: Document | null = null;

  // Filter options
  statuses: string[] = [];
  types: string[] = [];

  constructor(
    public service: DocumentsListService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.documents$ = service.documents$;
    this.total$ = service.total$;
    this.loading$ = service.loading$;
  }

  ngOnInit() {
    // Load filter options
    this.statuses = this.service.getUniqueStatuses();
    this.types = this.service.getUniqueTypes();
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
   * Reset all filters
   */
  resetFilters() {
    this.service.resetFilters();
  }

  /**
   * Navigate to create page
   */
  createDocument() {
    this.router.navigate(['/admin/documents/create']);
  }

  /**
   * Navigate to detail page
   */
  viewDocument(id: number) {
    this.router.navigate(['/admin/documents', id]);
  }

  /**
   * Navigate to edit page
   */
  editDocument(id: number) {
    this.router.navigate(['/admin/documents', id, 'edit']);
  }

  /**
   * Delete document with confirmation
   */
  deleteDocument(document: Document, content: any) {
    this.selectedDocument = document;
    this.modalService.open(content, { centered: true }).result.then(
      (result) => {
        if (result === 'confirm' && this.selectedDocument) {
          this.service.deleteDocument(this.selectedDocument.id).subscribe(() => {
            this.selectedDocument = null;
          });
        }
      },
      () => {
        this.selectedDocument = null;
      }
    );
  }
}

