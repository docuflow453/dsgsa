/**
 * Documents List Type Definitions
 * Interfaces and types for the Documents List feature
 */

/**
 * Document Status Types
 */
export type DocumentStatus = 'Active' | 'Inactive' | 'Draft' | 'Archived';

/**
 * Document Type Categories
 */
export type DocumentType = 
  | 'Dressage Test' 
  | 'Rule Book' 
  | 'Form' 
  | 'Template' 
  | 'Guide' 
  | 'Policy' 
  | 'Certificate' 
  | 'Report';

/**
 * File Type
 */
export type FileType = 'PDF' | 'DOC' | 'DOCX' | 'XLS' | 'XLSX' | 'JPG' | 'PNG' | 'ZIP';

/**
 * Document Interface
 * Represents a document in the system
 */
export interface Document {
  id: number;
  name: string;
  description?: string;
  type: DocumentType;
  status: DocumentStatus;
  fileType: FileType;
  fileSize: number; // in bytes
  fileName: string;
  fileUrl?: string;
  version?: string;
  category?: string;
  tags?: string[];
  isPublic: boolean;
  downloadCount?: number;
  uploadedBy?: string;
  uploadedById?: number;
  dateCreated: Date;
  dateModified?: Date;
  expiryDate?: Date;
  metadata?: {
    author?: string;
    pages?: number;
    language?: string;
    keywords?: string[];
  };
}

/**
 * Sort Column Type
 */
export type SortColumn = keyof Document | '';

/**
 * Sort Direction Type
 */
export type SortDirection = 'asc' | 'desc' | '';

