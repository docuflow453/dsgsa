/**
 * VAT Codes List Type Definitions
 * Interfaces and types for the VAT Codes List feature
 */

/**
 * VAT Code Status Types
 */
export type VATCodeStatus = 'Active' | 'Inactive';

/**
 * VAT Code Interface
 * Represents a VAT/tax code in the system
 */
export interface VATCode {
  id: number;
  code: string;
  name: string;
  description: string;
  rate: number;
  status: VATCodeStatus;
  isActive: boolean;
  isDefault: boolean;
  dateCreated: Date;
  effectiveDate?: Date;
  expiryDate?: Date;
  applicableToMemberships?: boolean;
  applicableToCompetitions?: boolean;
  notes?: string;
}

