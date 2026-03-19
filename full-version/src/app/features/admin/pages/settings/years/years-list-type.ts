/**
 * Years List Type Definitions
 * Interfaces and types for the Years List feature
 */

/**
 * Year Status Types
 */
export type YearStatus = 'Active' | 'Inactive' | 'Archived';

/**
 * Year Interface
 * Represents a competition year/season in the system
 */
export interface Year {
  id: number;
  year: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: YearStatus;
  isActive: boolean;
  isCurrent: boolean;
  dateCreated: Date;
  competitionsCount?: number;
  membershipsCount?: number;
  registrationOpen?: boolean;
  notes?: string;
}

