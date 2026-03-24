/**
 * Payment Methods Mock Data
 * Sample data for development and testing
 */

import { PaymentMethod } from './payment-methods-list-type';

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 1,
    name: 'Credit Card',
    code: 'CREDIT_CARD',
    description: 'Payment via credit card (Visa, Mastercard, American Express)',
    processingFee: 2.5,
    status: 'Active',
    isActive: true,
    allowForEntries: true,
    allowForRenewals: true,
    dateCreated: new Date('2024-01-15'),
    dateUpdated: new Date('2024-03-10')
  },
  {
    id: 2,
    name: 'EFT (Electronic Funds Transfer)',
    code: 'EFT',
    description: 'Direct bank transfer',
    processingFee: 0,
    status: 'Active',
    isActive: true,
    allowForEntries: true,
    allowForRenewals: true,
    dateCreated: new Date('2024-01-15'),
    dateUpdated: new Date('2024-02-20')
  },
  {
    id: 3,
    name: 'PayFast',
    code: 'PAYFAST',
    description: 'PayFast online payment gateway',
    processingFee: 3.0,
    status: 'Active',
    isActive: true,
    allowForEntries: true,
    allowForRenewals: true,
    dateCreated: new Date('2024-01-20'),
    dateUpdated: new Date('2024-03-15')
  },
  {
    id: 4,
    name: 'Cash',
    code: 'CASH',
    description: 'Cash payment at events',
    processingFee: 0,
    status: 'Active',
    isActive: true,
    allowForEntries: true,
    allowForRenewals: false,
    dateCreated: new Date('2024-01-15'),
    notes: 'Only available for on-site event entries'
  },
  {
    id: 5,
    name: 'Cheque',
    code: 'CHEQUE',
    description: 'Payment by cheque',
    processingFee: 0,
    status: 'Inactive',
    isActive: false,
    allowForEntries: false,
    allowForRenewals: true,
    dateCreated: new Date('2023-12-01'),
    dateUpdated: new Date('2024-01-10'),
    notes: 'Deprecated - being phased out'
  },
  {
    id: 6,
    name: 'SnapScan',
    code: 'SNAPSCAN',
    description: 'SnapScan mobile payment',
    processingFee: 1.5,
    status: 'Active',
    isActive: true,
    allowForEntries: true,
    allowForRenewals: false,
    dateCreated: new Date('2024-02-01'),
    dateUpdated: new Date('2024-03-01')
  }
];

