/**
 * Judges List Type Definitions
 * Interfaces and types for the Judges List feature
 */

/**
 * Judge Status Types
 */
export type JudgeStatus = 'Active' | 'Inactive';

/**
 * Judge Type/Level
 */
export type JudgeType = 'National' | 'International' | 'Candidate' | 'Apprentice';

/**
 * Judge Interface
 * Represents a Judge in the system
 */
export interface Judge {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  judgeType: JudgeType;
  licenseNumber: string;
  image?: string;
  status: JudgeStatus;
  dateCreated: Date;
  isActive: boolean;
  province?: string;
  city?: string;
  specialization?: string;
  yearsOfExperience?: number;
  certificationDate?: Date;
}

/**
 * Sort Column Type
 */
export type SortColumn = keyof Judge | '';

/**
 * Sort Direction Type
 */
export type SortDirection = 'asc' | 'desc' | '';

