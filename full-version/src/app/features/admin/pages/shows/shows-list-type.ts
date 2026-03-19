/**
 * Shows List Type Definitions
 * Interfaces and types for the Shows (Competitions) List feature
 */

/**
 * Show Status Types
 */
export type ShowStatus = 'Upcoming' | 'Open' | 'Closed' | 'Completed' | 'Cancelled';

/**
 * Show Level Types
 */
export type ShowLevel = 'Preliminary' | 'Novice' | 'Elementary' | 'Medium' | 'Advanced' | 'Grand Prix' | 'All Levels';

/**
 * Show Interface
 * Represents a Dressage Show/Competition in the system
 */
export interface Show {
  id: number;
  name: string;
  showHoldingBody: string;
  showHoldingBodyId?: number;
  venue: string;
  startDate: Date;
  endDate: Date;
  entryClosingDate: Date;
  status: ShowStatus;
  level: ShowLevel;
  dateCreated: Date;
  isActive: boolean;
  description?: string;
  maxEntries?: number;
  currentEntries?: number;
  entryFee?: number;
  contactEmail?: string;
  contactPhone?: string;
  province?: string;
  city?: string;
  judges?: string[];
  classes?: string[];
}

/**
 * Sort Column Type
 */
export type SortColumn = keyof Show | '';

/**
 * Sort Direction Type
 */
export type SortDirection = 'asc' | 'desc' | '';

