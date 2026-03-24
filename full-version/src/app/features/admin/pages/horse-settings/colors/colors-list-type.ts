/**
 * Colors List Type Definitions
 * Comprehensive type definitions for the Colors List feature
 */

/**
 * Color Status Types
 */
export type ColorStatus = 'Active' | 'Inactive';

/**
 * Sort Column Type
 */
export type SortColumn = keyof Color | '';

/**
 * Sort Direction Type
 */
export type SortDirection = 'asc' | 'desc' | '';

/**
 * Color Interface
 * Represents a horse color/coat color in the dressage system
 */
export interface Color {
  id: number;
  name: string;
  code: string;
  description: string;
  hexCode?: string;
  category?: string;
  isCommon: boolean;
  status: ColorStatus;
  isActive: boolean;
  displayOrder: number;
  dateCreated: Date;
  dateUpdated?: Date;
  notes?: string;
}

