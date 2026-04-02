/**
 * Schools List Type Definitions
 * Interfaces and types for the Schools List feature
 */

/**
 * School Status Types
 */
export type SchoolStatus = 'Active' | 'Inactive';

/**
 * School Type
 */
export type SchoolType = 'Riding School' | 'Training Center' | 'Equestrian Club' | 'Private Facility' | 'Competition Venue';

/**
 * School Interface
 * Represents a School/Training facility in the system
 */
export interface School {
  id: number;
  name: string;
  type: SchoolType;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  status: SchoolStatus;
  dateCreated: Date;
  isActive: boolean;
  website?: string;
  description?: string;
  facilities?: string[];
  instructorCount?: number;
  studentCapacity?: number;
  logo?: string;
}

/**
 * Sort Direction Type
 */
export type SortColumn = keyof School | '';
export type SortDirection = 'asc' | 'desc' | '';

