/**
 * Horses List Type Definitions
 * Interfaces and types for the Horses List feature
 */

/**
 * Horse Status Types
 */
export type HorseStatus = 'Active' | 'Inactive';

/**
 * Horse Gender Types
 */
export type HorseGender = 'Mare' | 'Stallion' | 'Gelding';

/**
 * Horse Interface
 * Represents a Horse in the system
 */
export interface Horse {
  id: number;
  name: string;
  microchipNumber: string;
  passportNumber: string;
  dateOfBirth: Date;
  breed: string;
  color: string;
  gender: HorseGender;
  image?: string;
  status: HorseStatus;
  dateCreated: Date;
  isActive: boolean;
  ownerName?: string;
  ownerEmail?: string;
  height?: number; // in hands
  sire?: string;
  dam?: string;
}

/**
 * Sort Column Type
 */
export type SortColumn = keyof Horse | '';

/**
 * Sort Direction Type
 */
export type SortDirection = 'asc' | 'desc' | '';

