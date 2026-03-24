/**
 * Payment Methods List Type Definitions
 * Interfaces and types for the Payment Methods List feature
 */

/**
 * Payment Method Status Types
 */
export type PaymentMethodStatus = 'Active' | 'Inactive';

/**
 * Payment Method Interface
 * Represents a payment method in the system
 */
export interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  description: string;
  processingFee: number;
  status: PaymentMethodStatus;
  isActive: boolean;
  allowForEntries: boolean;
  allowForRenewals: boolean;
  dateCreated: Date;
  dateUpdated?: Date;
  notes?: string;
}

