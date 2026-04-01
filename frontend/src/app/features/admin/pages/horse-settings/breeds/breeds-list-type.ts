/**
 * Breeds List Type Definitions
 * Comprehensive type definitions for the Breeds List feature
 */

/**
 * Breed Status Types
 */
export type BreedStatus = 'Active' | 'Inactive';

/**
 * Sort Column Type
 */
export type SortColumn = keyof Breed | '';

/**
 * Sort Direction Type
 */
export type SortDirection = 'asc' | 'desc' | '';

/**
 * Breed Interface
 * Represents a horse breed in the dressage system
 */
export interface Breed {
  id: number;
  name: string;
  code: string;
  description: string;
  origin?: string;
  characteristics?: string;
  averageHeight?: string;
  temperament?: string;
  status: BreedStatus;
  isActive: boolean;
  displayOrder: number;
  dateCreated: Date;
  dateUpdated?: Date;
  notes?: string;
}

