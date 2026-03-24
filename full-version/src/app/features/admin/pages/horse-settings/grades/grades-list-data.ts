/**
 * Grades Mock Data
 * Realistic sample data for horse grades/levels in dressage
 */

import { Grade } from './grades-list-type';

export const GRADES: Grade[] = [
  {
    id: 1,
    name: 'Preliminary',
    code: 'PRELIM',
    description: 'Entry level dressage for horses beginning their training',
    level: 1,
    minScore: 0,
    maxScore: 59,
    status: 'Active',
    isActive: true,
    displayOrder: 1,
    dateCreated: new Date('2023-01-15'),
    dateUpdated: new Date('2024-02-10'),
    notes: 'Suitable for horses in early training stages'
  },
  {
    id: 2,
    name: 'Novice',
    code: 'NOVICE',
    description: 'For horses showing basic training and understanding',
    level: 2,
    minScore: 60,
    maxScore: 64,
    status: 'Active',
    isActive: true,
    displayOrder: 2,
    dateCreated: new Date('2023-01-15'),
    dateUpdated: new Date('2024-01-20')
  },
  {
    id: 3,
    name: 'Elementary',
    code: 'ELEM',
    description: 'Intermediate level showing developing collection and balance',
    level: 3,
    minScore: 65,
    maxScore: 69,
    status: 'Active',
    isActive: true,
    displayOrder: 3,
    dateCreated: new Date('2023-01-15'),
    dateUpdated: new Date('2024-03-05')
  },
  {
    id: 4,
    name: 'Medium',
    code: 'MEDIUM',
    description: 'Advanced level with increased collection and lateral work',
    level: 4,
    minScore: 70,
    maxScore: 74,
    status: 'Active',
    isActive: true,
    displayOrder: 4,
    dateCreated: new Date('2023-01-15'),
    dateUpdated: new Date('2024-02-28')
  },
  {
    id: 5,
    name: 'Advanced Medium',
    code: 'ADV_MED',
    description: 'High level training with complex movements and collection',
    level: 5,
    minScore: 75,
    maxScore: 79,
    status: 'Active',
    isActive: true,
    displayOrder: 5,
    dateCreated: new Date('2023-01-15'),
    dateUpdated: new Date('2024-03-12')
  },
  {
    id: 6,
    name: 'Advanced',
    code: 'ADVANCED',
    description: 'Elite level dressage with advanced movements',
    level: 6,
    minScore: 80,
    maxScore: 84,
    status: 'Active',
    isActive: true,
    displayOrder: 6,
    dateCreated: new Date('2023-01-15'),
    dateUpdated: new Date('2024-01-30')
  },
  {
    id: 7,
    name: 'Prix St Georges',
    code: 'PSG',
    description: 'FEI level - First international level competition',
    level: 7,
    minScore: 85,
    maxScore: 89,
    status: 'Active',
    isActive: true,
    displayOrder: 7,
    dateCreated: new Date('2023-01-15'),
    dateUpdated: new Date('2024-02-15')
  },
  {
    id: 8,
    name: 'Intermediate I',
    code: 'INT_I',
    description: 'FEI level - Intermediate international competition',
    level: 8,
    minScore: 90,
    maxScore: 94,
    status: 'Active',
    isActive: true,
    displayOrder: 8,
    dateCreated: new Date('2023-01-15'),
    dateUpdated: new Date('2024-03-01')
  },
  {
    id: 9,
    name: 'Intermediate II',
    code: 'INT_II',
    description: 'FEI level - Advanced international competition',
    level: 9,
    minScore: 95,
    maxScore: 99,
    status: 'Active',
    isActive: true,
    displayOrder: 9,
    dateCreated: new Date('2023-01-15'),
    dateUpdated: new Date('2024-02-20')
  },
  {
    id: 10,
    name: 'Grand Prix',
    code: 'GP',
    description: 'FEI level - Highest level of dressage competition',
    level: 10,
    minScore: 100,
    status: 'Active',
    isActive: true,
    displayOrder: 10,
    dateCreated: new Date('2023-01-15'),
    dateUpdated: new Date('2024-03-10'),
    notes: 'Olympic and World Championship level'
  },
  {
    id: 11,
    name: 'Intro Level',
    code: 'INTRO',
    description: 'Beginner level for horses just starting dressage training',
    level: 0,
    status: 'Active',
    isActive: true,
    displayOrder: 0,
    dateCreated: new Date('2023-06-01'),
    dateUpdated: new Date('2024-01-15'),
    notes: 'Walk and trot only, no canter required'
  },
  {
    id: 12,
    name: 'Training Level (Deprecated)',
    code: 'TRAINING_OLD',
    description: 'Old training level classification - replaced by Preliminary',
    level: 1,
    status: 'Inactive',
    isActive: false,
    displayOrder: 99,
    dateCreated: new Date('2022-01-01'),
    dateUpdated: new Date('2023-12-31'),
    notes: 'Deprecated - use Preliminary instead'
  }
];

