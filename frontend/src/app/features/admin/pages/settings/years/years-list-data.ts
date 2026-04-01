/**
 * Years List Mock Data
 * Realistic test data for the Years List feature
 */

import { Year } from './years-list-type';

/**
 * Mock Years Data
 * Competition years/seasons with diverse statuses
 */
export const YEARS: Year[] = [
  {
    id: 1,
    year: 2026,
    name: '2026 Season',
    description: 'Current competition season',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-12-31'),
    status: 'Active',
    isActive: true,
    isCurrent: true,
    dateCreated: new Date('2025-11-01'),
    competitionsCount: 45,
    membershipsCount: 1250,
    registrationOpen: true,
    notes: 'Current active season'
  },
  {
    id: 2,
    year: 2025,
    name: '2025 Season',
    description: 'Previous competition season',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    status: 'Archived',
    isActive: false,
    isCurrent: false,
    dateCreated: new Date('2024-11-01'),
    competitionsCount: 52,
    membershipsCount: 1180,
    registrationOpen: false,
    notes: 'Completed season'
  },
  {
    id: 3,
    year: 2027,
    name: '2027 Season',
    description: 'Upcoming competition season',
    startDate: new Date('2027-01-01'),
    endDate: new Date('2027-12-31'),
    status: 'Inactive',
    isActive: false,
    isCurrent: false,
    dateCreated: new Date('2026-10-01'),
    competitionsCount: 0,
    membershipsCount: 0,
    registrationOpen: false,
    notes: 'Planning phase'
  },
  {
    id: 4,
    year: 2024,
    name: '2024 Season',
    description: '2024 competition season',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    status: 'Archived',
    isActive: false,
    isCurrent: false,
    dateCreated: new Date('2023-11-01'),
    competitionsCount: 48,
    membershipsCount: 1095,
    registrationOpen: false,
    notes: 'Archived season'
  }
];

