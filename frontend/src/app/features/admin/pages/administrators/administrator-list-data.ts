/**
 * Administrator List Mock Data
 * Realistic test data for the Administrators List feature
 */

import { AdministratorUser } from './administrator-list-type';

/**
 * Mock Administrators Data
 * 15 realistic administrator users with diverse roles and statuses
 */
export const ADMINISTRATORS: AdministratorUser[] = [
  {
    id: 1,
    firstName: 'Michael',
    lastName: 'Thompson',
    email: 'michael.thompson@shyft.com',
    profileImage: 'assets/images/user/avatar-1.jpg',
    role: 'Super Admin',
    status: 'Active',
    country: 'South Africa',
    countryCode: 'ZA',
    dateJoined: new Date('2022-01-15'),
    isActive: true,
    isBanned: false,
    department: 'IT Administration',
    permissions: ['all']
  },
  {
    id: 2,
    firstName: 'Jennifer',
    lastName: 'Martinez',
    email: 'jennifer.martinez@byteorbit.com',
    profileImage: 'assets/images/user/avatar-2.jpg',
    role: 'SAEF Admin',
    status: 'Active',
    country: 'South Africa',
    countryCode: 'ZA',
    dateJoined: new Date('2022-03-20'),
    isActive: true,
    isBanned: false,
    department: 'SAEF Operations',
    permissions: ['manage_shows', 'manage_members', 'manage_judges']
  },
  {
    id: 3,
    firstName: 'David',
    lastName: 'Anderson',
    email: 'david.anderson@shyft.com',
    profileImage: 'assets/images/user/avatar-3.jpg',
    role: 'System Administrator',
    status: 'Active',
    country: 'South Africa',
    countryCode: 'ZA',
    dateJoined: new Date('2022-05-10'),
    isActive: true,
    isBanned: false,
    department: 'Technical Support',
    permissions: ['system_config', 'user_management']
  },
  {
    id: 4,
    firstName: 'Emily',
    lastName: 'Roberts',
    email: 'emily.roberts@byteorbit.com',
    profileImage: 'assets/images/user/avatar-4.jpg',
    role: 'Admin',
    status: 'Active',
    country: 'South Africa',
    countryCode: 'ZA',
    dateJoined: new Date('2022-07-18'),
    isActive: true,
    isBanned: false,
    department: 'Member Services',
    permissions: ['manage_members', 'view_reports']
  },
  {
    id: 5,
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@shyft.com',
    profileImage: 'assets/images/user/avatar-5.jpg',
    role: 'SAEF Official',
    status: 'Active',
    country: 'South Africa',
    countryCode: 'ZA',
    dateJoined: new Date('2022-09-05'),
    isActive: true,
    isBanned: false,
    department: 'Competition Management',
    permissions: ['manage_shows', 'manage_results']
  },
  {
    id: 6,
    firstName: 'Sophia',
    lastName: 'Taylor',
    email: 'sophia.taylor@byteorbit.com',
    profileImage: 'assets/images/user/avatar-1.jpg',
    role: 'Admin',
    status: 'Inactive',
    country: 'South Africa',
    countryCode: 'ZA',
    dateJoined: new Date('2023-01-12'),
    isActive: false,
    isBanned: false,
    department: 'Finance',
    permissions: ['manage_payments', 'view_reports']
  },
  {
    id: 7,
    firstName: 'Daniel',
    lastName: 'Brown',
    email: 'daniel.brown@shyft.com',
    profileImage: 'assets/images/user/avatar-2.jpg',
    role: 'System Administrator',
    status: 'Active',
    country: 'South Africa',
    countryCode: 'ZA',
    dateJoined: new Date('2023-02-28'),
    isActive: true,
    isBanned: false,
    department: 'IT Security',
    permissions: ['system_config', 'security_management']
  },
  {
    id: 8,
    firstName: 'Olivia',
    lastName: 'Davis',
    email: 'olivia.davis@byteorbit.com',
    profileImage: 'assets/images/user/avatar-3.jpg',
    role: 'SAEF Admin',
    status: 'Active',
    country: 'South Africa',
    countryCode: 'ZA',
    dateJoined: new Date('2023-04-15'),
    isActive: true,
    isBanned: false,
    department: 'Grading & Testing',
    permissions: ['manage_tests', 'manage_grades']
  },
  {
    id: 9,
    firstName: 'Matthew',
    lastName: 'Miller',
    email: 'matthew.miller@shyft.com',
    profileImage: 'assets/images/user/avatar-4.jpg',
    role: 'Admin',
    status: 'Banned',
    country: 'South Africa',
    countryCode: 'ZA',
    dateJoined: new Date('2023-06-20'),
    isActive: false,
    isBanned: true,
    department: 'Member Services',
    permissions: []
  },
  {
    id: 10,
    firstName: 'Isabella',
    lastName: 'Garcia',
    email: 'isabella.garcia@byteorbit.com',
    profileImage: 'assets/images/user/avatar-5.jpg',
    role: 'SAEF Official',
    status: 'Active',
    country: 'South Africa',
    countryCode: 'ZA',
    dateJoined: new Date('2023-08-10'),
    isActive: true,
    isBanned: false,
    department: 'Judge Management',
    permissions: ['manage_judges', 'assign_judges']
  }
];

