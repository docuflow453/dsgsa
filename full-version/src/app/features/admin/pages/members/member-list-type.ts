/**
 * Member List Type Definitions
 * Comprehensive user interface for the Members List page
 */

export interface MemberUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  role: UserRole;
  status: UserStatus;
  country: string;
  countryCode: string;
  membershipType: string;
  membershipNumber: string;
  dateJoined: Date;
  isActive: boolean;
  isBanned: boolean;
}

export type UserRole = 
  | 'Admin' 
  | 'Rider' 
  | 'Show Holding Body' 
  | 'Judge' 
  | 'Club' 
  | 'SAEF Admin' 
  | 'Official';

export type UserStatus = 'Active' | 'Inactive' | 'Banned';

export interface MembershipType {
  id: string;
  name: string;
  code: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}

