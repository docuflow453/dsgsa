/**
 * VAT Codes List Mock Data
 * Realistic test data for the VAT Codes List feature
 */

import { VATCode } from './vat-codes-list-type';

/**
 * Mock VAT Codes Data
 * South African VAT codes with diverse rates and statuses
 */
export const VAT_CODES: VATCode[] = [
  {
    id: 1,
    code: 'VAT15',
    name: 'Standard VAT',
    description: 'Standard VAT rate for South Africa',
    rate: 15.0,
    status: 'Active',
    isActive: true,
    isDefault: true,
    dateCreated: new Date('2020-01-01'),
    effectiveDate: new Date('2018-04-01'),
    applicableToMemberships: true,
    applicableToCompetitions: true,
    notes: 'Current standard VAT rate'
  },
  {
    id: 2,
    code: 'VAT0',
    name: 'Zero Rated',
    description: 'Zero-rated VAT for exempt items',
    rate: 0.0,
    status: 'Active',
    isActive: true,
    isDefault: false,
    dateCreated: new Date('2020-01-01'),
    effectiveDate: new Date('2018-04-01'),
    applicableToMemberships: false,
    applicableToCompetitions: false,
    notes: 'For zero-rated supplies'
  },
  {
    id: 3,
    code: 'EXEMPT',
    name: 'VAT Exempt',
    description: 'VAT exempt transactions',
    rate: 0.0,
    status: 'Active',
    isActive: true,
    isDefault: false,
    dateCreated: new Date('2020-01-01'),
    effectiveDate: new Date('2018-04-01'),
    applicableToMemberships: true,
    applicableToCompetitions: false,
    notes: 'For exempt supplies'
  },
  {
    id: 4,
    code: 'VAT14',
    name: 'Previous Standard VAT',
    description: 'Previous standard VAT rate (historical)',
    rate: 14.0,
    status: 'Inactive',
    isActive: false,
    isDefault: false,
    dateCreated: new Date('2015-01-01'),
    effectiveDate: new Date('2014-01-01'),
    expiryDate: new Date('2018-03-31'),
    applicableToMemberships: true,
    applicableToCompetitions: true,
    notes: 'Historical rate - no longer in use'
  }
];

