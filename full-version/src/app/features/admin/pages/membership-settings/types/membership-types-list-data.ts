/**
 * Membership Types List Mock Data
 * Realistic test data for the Membership Types List feature
 */

import { MembershipType } from './membership-types-list-type';

/**
 * Mock Membership Types Data
 * 15 realistic Membership Types with diverse rule groups and statuses
 */
export const MEMBERSHIP_TYPES: MembershipType[] = [
  {
    id: 1,
    name: 'Individual Annual Membership',
    description: 'Standard annual membership for individual riders',
    ruleGroup: 'Individual',
    fee: 850.00,
    status: 'Active',
    dateCreated: new Date('2020-01-15'),
    isActive: true,
    duration: 12,
    benefits: ['Competition entry', 'Training access', 'Newsletter subscription'],
    renewalRequired: true,
    discountEligible: false
  },
  {
    id: 2,
    name: 'Junior Rider Membership',
    description: 'Discounted membership for riders under 18 years',
    ruleGroup: 'Junior',
    fee: 450.00,
    status: 'Active',
    dateCreated: new Date('2020-01-15'),
    isActive: true,
    duration: 12,
    benefits: ['Competition entry', 'Training access', 'Youth programs'],
    renewalRequired: true,
    discountEligible: true
  },
  {
    id: 3,
    name: 'Senior Rider Membership',
    description: 'Membership for riders 60 years and older',
    ruleGroup: 'Senior',
    fee: 650.00,
    status: 'Active',
    dateCreated: new Date('2020-01-15'),
    isActive: true,
    duration: 12,
    benefits: ['Competition entry', 'Training access', 'Senior programs'],
    renewalRequired: true,
    discountEligible: true
  },
  {
    id: 4,
    name: 'Professional Rider Membership',
    description: 'Membership for professional dressage riders and trainers',
    ruleGroup: 'Professional',
    fee: 1500.00,
    status: 'Active',
    dateCreated: new Date('2020-02-10'),
    isActive: true,
    duration: 12,
    benefits: ['Competition entry', 'Training access', 'Professional development', 'Coaching certification'],
    renewalRequired: true,
    discountEligible: false
  },
  {
    id: 5,
    name: 'Amateur Rider Membership',
    description: 'Membership for amateur riders competing at lower levels',
    ruleGroup: 'Amateur',
    fee: 750.00,
    status: 'Active',
    dateCreated: new Date('2020-02-10'),
    isActive: true,
    duration: 12,
    benefits: ['Competition entry', 'Training access', 'Amateur programs'],
    renewalRequired: true,
    discountEligible: false
  },
  {
    id: 6,
    name: 'Club Membership',
    description: 'Annual membership for equestrian clubs and organizations',
    ruleGroup: 'Organization',
    fee: 2500.00,
    status: 'Active',
    dateCreated: new Date('2020-03-05'),
    isActive: true,
    duration: 12,
    maxMembers: 50,
    benefits: ['Bulk competition entries', 'Club events', 'Training programs', 'Marketing support'],
    renewalRequired: true,
    discountEligible: false
  },
  {
    id: 7,
    name: 'Individual Monthly Membership',
    description: 'Month-to-month membership for individual riders',
    ruleGroup: 'Individual',
    fee: 95.00,
    status: 'Active',
    dateCreated: new Date('2021-06-20'),
    isActive: true,
    duration: 1,
    benefits: ['Competition entry', 'Training access'],
    renewalRequired: true,
    discountEligible: false
  },
  {
    id: 8,
    name: 'Junior Development Program',
    description: 'Comprehensive development program for junior riders',
    ruleGroup: 'Junior',
    fee: 650.00,
    status: 'Active',
    dateCreated: new Date('2021-08-12'),
    isActive: true,
    duration: 12,
    benefits: ['Competition entry', 'Training access', 'Coaching sessions', 'Development workshops'],
    renewalRequired: true,
    discountEligible: true
  },
  {
    id: 9,
    name: 'Professional Trainer Certification',
    description: 'Annual certification for professional dressage trainers',
    ruleGroup: 'Professional',
    fee: 2000.00,
    status: 'Active',
    dateCreated: new Date('2021-09-18'),
    isActive: true,
    duration: 12,
    benefits: ['Trainer certification', 'Professional development', 'Coaching resources', 'Insurance coverage'],
    renewalRequired: true,
    discountEligible: false
  },
  {
    id: 10,
    name: 'Legacy Individual Membership',
    description: 'Discontinued individual membership type (legacy members only)',
    ruleGroup: 'Individual',
    fee: 600.00,
    status: 'Inactive',
    dateCreated: new Date('2018-01-10'),
    isActive: false,
    duration: 12,
    benefits: ['Competition entry', 'Training access'],
    renewalRequired: true,
    discountEligible: false
  },
  {
    id: 11,
    name: 'Organization Premium Membership',
    description: 'Premium membership for large equestrian organizations',
    ruleGroup: 'Organization',
    fee: 5000.00,
    status: 'Active',
    dateCreated: new Date('2022-01-15'),
    isActive: true,
    duration: 12,
    maxMembers: 150,
    benefits: ['Unlimited competition entries', 'Premium events', 'Training programs', 'Marketing support', 'Dedicated account manager'],
    renewalRequired: true,
    discountEligible: false
  },
  {
    id: 12,
    name: 'Senior Lifetime Membership',
    description: 'One-time lifetime membership for senior riders',
    ruleGroup: 'Senior',
    fee: 5000.00,
    status: 'Inactive',
    dateCreated: new Date('2019-05-20'),
    isActive: false,
    duration: 0,
    benefits: ['Lifetime competition entry', 'Training access', 'Senior programs'],
    renewalRequired: false,
    discountEligible: false
  }
];

