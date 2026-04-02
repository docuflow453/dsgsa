/**
 * Membership Types List Type Definitions
 * Interfaces and types for the Membership Types List feature
 */

/**
 * Membership Type Status Types
 */
export type MembershipTypeStatus = 'Active' | 'Inactive';

/**
 * Rule Group Types
 */
export type RuleGroup = 'Individual' | 'Organization' | 'Junior' | 'Senior' | 'Professional' | 'Amateur';

/**
 * Membership Type Interface
 * Represents a Membership Type in the system
 */
export interface MembershipType {
  id: number;
  name: string;
  description: string;
  ruleGroup: RuleGroup;
  fee: number;
  status: MembershipTypeStatus;
  dateCreated: Date;
  isActive: boolean;
  duration?: number; // Duration in months
  benefits?: string[];
  maxMembers?: number;
  renewalRequired?: boolean;
  discountEligible?: boolean;
}

/**
 * Sort Column Type
 */
export type SortColumn = keyof MembershipType | '';

/**
 * Sort Direction Type
 */
export type SortDirection = 'asc' | 'desc' | '';

