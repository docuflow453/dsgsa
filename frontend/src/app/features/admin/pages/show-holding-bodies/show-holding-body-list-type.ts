/**
 * Show Holding Body List Type Definitions
 * Interfaces and types for the Show Holding Bodies List feature
 */

/**
 * Show Holding Body Status Types
 */
export type ShowHoldingBodyStatus = 'Active' | 'Inactive';

/**
 * Show Holding Body Interface
 * Represents a Show Holding Body organization in the system
 */
export interface ShowHoldingBody {
  id: number;
  name: string;
  registrationNumber: string; // SAEF Number in format: SHB-YYYY-XXX
  logo?: string;
  province: string;
  city: string;
  address?: string;
  postalCode?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  status: ShowHoldingBodyStatus;
  dateCreated: Date;
  isActive: boolean;
}

/**
 * Sort Column Type
 */
export type SortColumn = keyof ShowHoldingBody | '';

/**
 * Sort Direction Type
 */
export type SortDirection = 'asc' | 'desc' | '';

