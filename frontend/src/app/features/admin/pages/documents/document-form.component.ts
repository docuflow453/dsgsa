/**
 * Document Form Component
 * Handles both creating new documents and editing existing documents
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Types and Service
import { Document, DocumentStatus, DocumentType, FileType } from './documents-list-type';
import { DocumentsListService } from './documents-list.service';

@Component({
  selector: 'app-document-form',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule],
  templateUrl: './document-form.component.html',
  styleUrl: './document-form.component.scss',
  providers: [DocumentsListService]
})
export class DocumentFormComponent implements OnInit {
  documentForm!: FormGroup;
  isEditMode = false;
  documentId: number = 0;
  pageTitle = 'Add Document';

  // Dropdown options
  statuses: DocumentStatus[] = ['Active', 'Inactive', 'Draft', 'Archived'];
  types: DocumentType[] = [
    'Dressage Test',
    'Rule Book',
    'Form',
    'Template',
    'Guide',
    'Policy',
    'Certificate',
    'Report'
  ];
  fileTypes: FileType[] = ['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'JPG', 'PNG', 'ZIP'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: DocumentsListService
  ) {}

  ngOnInit() {
    // Initialize form
    this.initForm();

    // Check if edit mode
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.documentId = +params['id'];
        this.pageTitle = 'Edit Document';
        this.loadDocument();
      }
    });
  }

  /**
   * Initialize form with validation
   */
  initForm() {
    this.documentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      type: ['Form', Validators.required],
      status: ['Active', Validators.required],
      fileType: ['PDF', Validators.required],
      fileName: ['', Validators.required],
      fileSize: [0, [Validators.required, Validators.min(1)]],
      fileUrl: [''],
      version: [''],
      category: [''],
      tags: [''],
      isPublic: [true],
      expiryDate: [''],
      metadataAuthor: [''],
      metadataPages: [null],
      metadataLanguage: ['English'],
      metadataKeywords: ['']
    });
  }

  /**
   * Load document data for editing
   */
  loadDocument() {
    const document = this.service.getDocumentById(this.documentId);
    
    if (document) {
      this.documentForm.patchValue({
        name: document.name,
        description: document.description || '',
        type: document.type,
        status: document.status,
        fileType: document.fileType,
        fileName: document.fileName,
        fileSize: document.fileSize,
        fileUrl: document.fileUrl || '',
        version: document.version || '',
        category: document.category || '',
        tags: document.tags?.join(', ') || '',
        isPublic: document.isPublic,
        expiryDate: document.expiryDate ? this.formatDateForInput(document.expiryDate) : '',
        metadataAuthor: document.metadata?.author || '',
        metadataPages: document.metadata?.pages || null,
        metadataLanguage: document.metadata?.language || 'English',
        metadataKeywords: document.metadata?.keywords?.join(', ') || ''
      });
    } else {
      console.error('Document not found');
      this.router.navigate(['/admin/documents']);
    }
  }

  /**
   * Format date for input field
   */
  formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Submit form
   */
  onSubmit() {
    if (this.documentForm.valid) {
      const formValue = this.documentForm.value;
      
      // Process tags and keywords
      const tags = formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [];
      const keywords = formValue.metadataKeywords ? formValue.metadataKeywords.split(',').map((k: string) => k.trim()).filter((k: string) => k) : [];

      const documentData: Partial<Document> = {
        name: formValue.name,
        description: formValue.description,
        type: formValue.type,
        status: formValue.status,
        fileType: formValue.fileType,
        fileName: formValue.fileName,
        fileSize: formValue.fileSize,
        fileUrl: formValue.fileUrl,
        version: formValue.version,
        category: formValue.category,
        tags: tags,
        isPublic: formValue.isPublic,
        expiryDate: formValue.expiryDate ? new Date(formValue.expiryDate) : undefined,
        metadata: {
          author: formValue.metadataAuthor,
          pages: formValue.metadataPages,
          language: formValue.metadataLanguage,
          keywords: keywords
        }
      };

      if (this.isEditMode) {
        // Update existing document
        console.log('Updating document:', documentData);
        // In a real app, call API to update
        this.router.navigate(['/admin/documents', this.documentId]);
      } else {
        // Create new document
        console.log('Creating document:', documentData);
        // In a real app, call API to create
        this.router.navigate(['/admin/documents']);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.documentForm.controls).forEach((key) => {
        this.documentForm.get(key)?.markAsTouched();
      });
    }
  }

  /**
   * Cancel and go back
   */
  onCancel() {
    if (this.isEditMode) {
      this.router.navigate(['/admin/documents', this.documentId]);
    } else {
      this.router.navigate(['/admin/documents']);
    }
  }

  /**
   * Check if field has error
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.documentForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  /**
   * Get error message for field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.documentForm.get(fieldName);

    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Minimum length is ${minLength} characters`;
    }
    if (field?.hasError('min')) {
      return 'Value must be greater than 0';
    }

    return '';
  }

  /**
   * Handle file selection
   */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.documentForm.patchValue({
        fileName: file.name,
        fileSize: file.size,
        fileType: this.getFileExtension(file.name).toUpperCase()
      });
    }
  }

  /**
   * Get file extension
   */
  getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }
}

