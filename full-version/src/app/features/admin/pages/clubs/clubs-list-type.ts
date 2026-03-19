/**
 * Clubs List Type Definitions
 * Interfaces and types for the Clubs List feature
 */

/**
 * Club Status Types
 */
export type ClubStatus = 'Active' | 'Inactive';

/**
 * Club Interface
 * Represents a Club organization in the system
 */
export interface Club {
  id: number;
  name: string;
  registrationNumber: string; // SAEF Number in format: CLB-YYYY-XXX
  logo?: string;
  province: string;
  city: string;
  address?: string;
  postalCode?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  status: ClubStatus;
  dateCreated: Date;
  isActive: boolean;
  memberCount?: number;
}

/**
 * Sort Column Type
 */
export type SortColumn = keyof Club | '';

/**
 * Sort Direction Type
 */
export type SortDirection = 'asc' | 'desc' | '';

