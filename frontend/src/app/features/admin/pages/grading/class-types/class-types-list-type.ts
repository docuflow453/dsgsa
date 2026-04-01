/**
 * Class Types List Type Definitions
 * Interfaces and types for the Class Types List feature
 */

/**
 * Class Type Status Types
 */
export type ClassTypeStatus = 'Active' | 'Inactive';

/**
 * Class Category Types
 */
export type ClassCategory = 'Dressage' | 'Show Jumping' | 'Eventing' | 'Combined Training' | 'Working Equitation';

/**
 * Class Type Interface
 * Represents a competition class type in the system
 */
export interface ClassType {
  id: number;
  name: string;
  code: string;
  category: ClassCategory;
  description?: string;
  status: ClassTypeStatus;
  dateCreated: Date;
  isActive: boolean;
  minAge?: number;
  maxAge?: number;
  minHeight?: number;
  maxHeight?: number;
  duration?: number; // in minutes
  judgesRequired?: number;
  entryFee?: number;
  maxEntries?: number;
  color?: string;
  order: number;
  entriesCount?: number;
  requirements?: string[];
  notes?: string;
}

/**
 * Sort Direction Type
 */
export type SortColumn = keyof ClassType | '';
export type SortDirection = 'asc' | 'desc' | '';

