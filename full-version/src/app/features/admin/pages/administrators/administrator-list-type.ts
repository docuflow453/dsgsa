/**
 * Administrator List Type Definitions
 * Interfaces and types for the Administrators List feature
 */

/**
 * User Role Types
 */
export type UserRole = 'Admin' | 'SAEF Admin' | 'SAEF Official' | 'System Administrator' | 'Super Admin';

/**
 * User Status Types
 */
export type UserStatus = 'Active' | 'Inactive' | 'Banned';

/**
 * Administrator User Interface
 * Represents an administrator in the system
 */
export interface AdministratorUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  role: UserRole;
  status: UserStatus;
  country: string;
  countryCode: string;
  dateJoined: Date;
  isActive: boolean;
  isBanned: boolean;
  department?: string;
  permissions?: string[];
}

/**
 * Sort Column Type
 */
export type SortColumn = keyof AdministratorUser | '';

/**
 * Sort Direction Type
 */
export type SortDirection = 'asc' | 'desc' | '';

