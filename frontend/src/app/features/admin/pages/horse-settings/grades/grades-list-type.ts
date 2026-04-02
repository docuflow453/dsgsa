/**
 * Grades List Type Definitions
 * Comprehensive type definitions for the Grades List feature
 */

/**
 * Grade Status Types
 */
export type GradeStatus = 'Active' | 'Inactive';

/**
 * Sort Column Type
 */
export type SortColumn = keyof Grade | '';

/**
 * Sort Direction Type
 */
export type SortDirection = 'asc' | 'desc' | '';

/**
 * Grade Interface
 * Represents a horse grade/level in the dressage system
 */
export interface Grade {
  id: number;
  name: string;
  code: string;
  description: string;
  level: number;
  minScore?: number;
  maxScore?: number;
  status: GradeStatus;
  isActive: boolean;
  displayOrder: number;
  dateCreated: Date;
  dateUpdated?: Date;
  notes?: string;
}

