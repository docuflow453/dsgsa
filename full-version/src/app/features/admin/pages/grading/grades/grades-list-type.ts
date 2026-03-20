/**
 * Grades List Type Definitions
 * Interfaces and types for the Grades List feature
 */

/**
 * Grade Status Types
 */
export type GradeStatus = 'Active' | 'Inactive';

/**
 * Grade Level Types
 */
export type GradeLevel = 'Preliminary' | 'Novice' | 'Elementary' | 'Medium' | 'Advanced Medium' | 'Advanced' | 'Prix St Georges' | 'Intermediate I' | 'Intermediate II' | 'Grand Prix';

/**
 * Grade Interface
 * Represents a dressage grade/level in the system
 */
export interface Grade {
  id: number;
  name: string;
  code: string;
  level: GradeLevel;
  description?: string;
  status: GradeStatus;
  dateCreated: Date;
  isActive: boolean;
  minScore: number;
  maxScore: number;
  passingScore: number;
  color?: string;
  order: number;
  testsCount?: number;
  ridersCount?: number;
  requirements?: string[];
  notes?: string;
}

/**
 * Sort Direction Type
 */
export type SortColumn = keyof Grade | '';
export type SortDirection = 'asc' | 'desc' | '';

