/**
 * Accounting Periods List Type Definitions
 * Interfaces and types for the Accounting Periods List feature
 */

/**
 * Accounting Period Status Types
 */
export type AccountingPeriodStatus = 'Active' | 'Inactive' | 'Closed';

/**
 * Accounting Period Interface
 * Represents a financial/accounting period in the dressage system
 */
export interface AccountingPeriod {
  id: number;
  name: string;
  code: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  status: AccountingPeriodStatus;
  dateCreated: Date;
  isActive: boolean;
  isClosed: boolean;
  fiscalYear: string;
  quarter?: string;
  transactionsCount?: number;
  totalRevenue?: number;
  totalExpenses?: number;
  closedBy?: string;
  closedDate?: Date;
  notes?: string;
}

/**
 * Sort Direction Type
 */
export type SortColumn = keyof AccountingPeriod | '';
export type SortDirection = 'asc' | 'desc' | '';

