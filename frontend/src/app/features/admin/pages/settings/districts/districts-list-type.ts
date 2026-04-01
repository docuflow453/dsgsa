/**
 * Districts List Type Definitions
 * Interfaces and types for the Districts List feature
 */

/**
 * District Status Types
 */
export type DistrictStatus = 'Active' | 'Inactive';

/**
 * District Interface
 * Represents a District/Region in the dressage system
 */
export interface District {
  id: number;
  name: string;
  code: string;
  province: string;
  description?: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: DistrictStatus;
  dateCreated: Date;
  isActive: boolean;
  clubsCount?: number;
  membersCount?: number;
  address?: string;
  city?: string;
  postalCode?: string;
  website?: string;
}

/**
 * Sort Direction Type
 */
export type SortColumn = keyof District | '';
export type SortDirection = 'asc' | 'desc' | '';

