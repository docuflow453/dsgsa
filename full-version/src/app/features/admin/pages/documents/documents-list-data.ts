/**
 * Documents List Mock Data
 * Realistic mock data for testing the Documents List feature
 */

import { Document } from './documents-list-type';

export const DOCUMENTS: Document[] = [
  {
    id: 1,
    name: 'Preliminary Test 1A',
    description: 'Official dressage test for Preliminary level 1A',
    type: 'Dressage Test',
    status: 'Active',
    fileType: 'PDF',
    fileSize: 245760, // 240 KB
    fileName: 'preliminary_test_1a.pdf',
    fileUrl: '/documents/tests/preliminary_test_1a.pdf',
    version: '2024.1',
    category: 'Dressage Tests',
    tags: ['Preliminary', 'Test 1A', 'Official'],
    isPublic: true,
    downloadCount: 1247,
    uploadedBy: 'Sarah Mitchell',
    uploadedById: 1,
    dateCreated: new Date('2024-01-15'),
    dateModified: new Date('2024-02-10'),
    metadata: {
      author: 'South African Dressage Federation',
      pages: 2,
      language: 'English',
      keywords: ['dressage', 'preliminary', 'test']
    }
  },
  {
    id: 2,
    name: 'SAEF Dressage Rule Book 2024',
    description: 'Complete rule book for dressage competitions in South Africa',
    type: 'Rule Book',
    status: 'Active',
    fileType: 'PDF',
    fileSize: 5242880, // 5 MB
    fileName: 'saef_dressage_rules_2024.pdf',
    fileUrl: '/documents/rules/saef_dressage_rules_2024.pdf',
    version: '2024.0',
    category: 'Rules & Regulations',
    tags: ['Rules', 'SAEF', '2024', 'Official'],
    isPublic: true,
    downloadCount: 3456,
    uploadedBy: 'Jennifer Adams',
    uploadedById: 2,
    dateCreated: new Date('2023-12-01'),
    dateModified: new Date('2024-01-05'),
    expiryDate: new Date('2024-12-31'),
    metadata: {
      author: 'South African Equestrian Federation',
      pages: 156,
      language: 'English',
      keywords: ['rules', 'regulations', 'dressage', 'SAEF']
    }
  },
  {
    id: 3,
    name: 'Competition Entry Form',
    description: 'Standard entry form for dressage competitions',
    type: 'Form',
    status: 'Active',
    fileType: 'PDF',
    fileSize: 102400, // 100 KB
    fileName: 'competition_entry_form.pdf',
    fileUrl: '/documents/forms/competition_entry_form.pdf',
    version: '3.2',
    category: 'Forms',
    tags: ['Entry Form', 'Competition', 'Required'],
    isPublic: true,
    downloadCount: 8923,
    uploadedBy: 'Michael Brown',
    uploadedById: 3,
    dateCreated: new Date('2023-06-20'),
    dateModified: new Date('2024-03-15'),
    metadata: {
      author: 'SAEF Administration',
      pages: 3,
      language: 'English',
      keywords: ['entry', 'form', 'competition']
    }
  },
  {
    id: 4,
    name: 'Novice Test 2B',
    description: 'Official dressage test for Novice level 2B',
    type: 'Dressage Test',
    status: 'Active',
    fileType: 'PDF',
    fileSize: 256000, // 250 KB
    fileName: 'novice_test_2b.pdf',
    fileUrl: '/documents/tests/novice_test_2b.pdf',
    version: '2024.1',
    category: 'Dressage Tests',
    tags: ['Novice', 'Test 2B', 'Official'],
    isPublic: true,
    downloadCount: 2134,
    uploadedBy: 'Sarah Mitchell',
    uploadedById: 1,
    dateCreated: new Date('2024-01-15'),
    dateModified: new Date('2024-02-10'),
    metadata: {
      author: 'South African Dressage Federation',
      pages: 2,
      language: 'English',
      keywords: ['dressage', 'novice', 'test']
    }
  },
  {
    id: 5,
    name: 'Judge Certification Guidelines',
    description: 'Guidelines and requirements for judge certification',
    type: 'Guide',
    status: 'Active',
    fileType: 'PDF',
    fileSize: 1048576, // 1 MB
    fileName: 'judge_certification_guide.pdf',
    fileUrl: '/documents/guides/judge_certification_guide.pdf',
    version: '2.0',
    category: 'Guides',
    tags: ['Judge', 'Certification', 'Guidelines'],
    isPublic: false,
    downloadCount: 456,
    uploadedBy: 'Patricia Nkosi',
    uploadedById: 4,
    dateCreated: new Date('2023-09-10'),
    dateModified: new Date('2024-01-20'),
    metadata: {
      author: 'SAEF Judge Committee',
      pages: 24,
      language: 'English',
      keywords: ['judge', 'certification', 'guidelines']
    }
  },
  {
    id: 6,
    name: 'Horse Registration Form',
    description: 'Form for registering horses with SAEF',
    type: 'Form',
    status: 'Active',
    fileType: 'PDF',
    fileSize: 153600, // 150 KB
    fileName: 'horse_registration_form.pdf',
    fileUrl: '/documents/forms/horse_registration_form.pdf',
    version: '4.1',
    category: 'Forms',
    tags: ['Horse', 'Registration', 'Required'],
    isPublic: true,
    downloadCount: 5678,
    uploadedBy: 'Robert Johnson',
    uploadedById: 5,
    dateCreated: new Date('2023-03-12'),
    dateModified: new Date('2024-02-28'),
    metadata: {
      author: 'SAEF Administration',
      pages: 4,
      language: 'English',
      keywords: ['horse', 'registration', 'form']
    }
  },
  {
    id: 7,
    name: 'Elementary Test 3A',
    description: 'Official dressage test for Elementary level 3A',
    type: 'Dressage Test',
    status: 'Active',
    fileType: 'PDF',
    fileSize: 268000, // 262 KB
    fileName: 'elementary_test_3a.pdf',
    fileUrl: '/documents/tests/elementary_test_3a.pdf',
    version: '2024.1',
    category: 'Dressage Tests',
    tags: ['Elementary', 'Test 3A', 'Official'],
    isPublic: true,
    downloadCount: 1876,
    uploadedBy: 'Sarah Mitchell',
    uploadedById: 1,
    dateCreated: new Date('2024-01-15'),
    dateModified: new Date('2024-02-10'),
    metadata: {
      author: 'South African Dressage Federation',
      pages: 3,
      language: 'English',
      keywords: ['dressage', 'elementary', 'test']
    }
  },
  {
    id: 8,
    name: 'COVID-19 Safety Protocol',
    description: 'Safety guidelines for competitions during COVID-19',
    type: 'Policy',
    status: 'Archived',
    fileType: 'PDF',
    fileSize: 512000, // 500 KB
    fileName: 'covid_safety_protocol.pdf',
    fileUrl: '/documents/policies/covid_safety_protocol.pdf',
    version: '1.3',
    category: 'Policies',
    tags: ['COVID-19', 'Safety', 'Protocol', 'Archived'],
    isPublic: true,
    downloadCount: 2345,
    uploadedBy: 'Jennifer Adams',
    uploadedById: 2,
    dateCreated: new Date('2020-06-15'),
    dateModified: new Date('2022-03-20'),
    expiryDate: new Date('2023-12-31'),
    metadata: {
      author: 'SAEF Health & Safety Committee',
      pages: 12,
      language: 'English',
      keywords: ['covid', 'safety', 'protocol', 'health']
    }
  },
  {
    id: 9,
    name: 'Medium Test 4B',
    description: 'Official dressage test for Medium level 4B',
    type: 'Dressage Test',
    status: 'Active',
    fileType: 'PDF',
    fileSize: 278000, // 271 KB
    fileName: 'medium_test_4b.pdf',
    fileUrl: '/documents/tests/medium_test_4b.pdf',
    version: '2024.1',
    category: 'Dressage Tests',
    tags: ['Medium', 'Test 4B', 'Official'],
    isPublic: true,
    downloadCount: 1543,
    uploadedBy: 'Sarah Mitchell',
    uploadedById: 1,
    dateCreated: new Date('2024-01-15'),
    dateModified: new Date('2024-02-10'),
    metadata: {
      author: 'South African Dressage Federation',
      pages: 3,
      language: 'English',
      keywords: ['dressage', 'medium', 'test']
    }
  },
  {
    id: 10,
    name: 'Membership Application Form',
    description: 'Application form for SAEF membership',
    type: 'Form',
    status: 'Active',
    fileType: 'PDF',
    fileSize: 204800, // 200 KB
    fileName: 'membership_application.pdf',
    fileUrl: '/documents/forms/membership_application.pdf',
    version: '5.0',
    category: 'Forms',
    tags: ['Membership', 'Application', 'Required'],
    isPublic: true,
    downloadCount: 7234,
    uploadedBy: 'Michael Brown',
    uploadedById: 3,
    dateCreated: new Date('2023-01-10'),
    dateModified: new Date('2024-01-15'),
    metadata: {
      author: 'SAEF Administration',
      pages: 5,
      language: 'English',
      keywords: ['membership', 'application', 'form']
    }
  },
  {
    id: 11,
    name: 'Advanced Test 5A',
    description: 'Official dressage test for Advanced level 5A',
    type: 'Dressage Test',
    status: 'Active',
    fileType: 'PDF',
    fileSize: 289000, // 282 KB
    fileName: 'advanced_test_5a.pdf',
    fileUrl: '/documents/tests/advanced_test_5a.pdf',
    version: '2024.1',
    category: 'Dressage Tests',
    tags: ['Advanced', 'Test 5A', 'Official'],
    isPublic: true,
    downloadCount: 987,
    uploadedBy: 'Sarah Mitchell',
    uploadedById: 1,
    dateCreated: new Date('2024-01-15'),
    dateModified: new Date('2024-02-10'),
    metadata: {
      author: 'South African Dressage Federation',
      pages: 4,
      language: 'English',
      keywords: ['dressage', 'advanced', 'test']
    }
  },
  {
    id: 12,
    name: 'Competition Results Template',
    description: 'Excel template for recording competition results',
    type: 'Template',
    status: 'Active',
    fileType: 'XLSX',
    fileSize: 51200, // 50 KB
    fileName: 'results_template.xlsx',
    fileUrl: '/documents/templates/results_template.xlsx',
    version: '2.1',
    category: 'Templates',
    tags: ['Results', 'Template', 'Excel'],
    isPublic: false,
    downloadCount: 1234,
    uploadedBy: 'Robert Johnson',
    uploadedById: 5,
    dateCreated: new Date('2023-08-05'),
    dateModified: new Date('2024-02-01'),
    metadata: {
      author: 'SAEF IT Department',
      language: 'English',
      keywords: ['results', 'template', 'excel', 'competition']
    }
  },
  {
    id: 13,
    name: 'Grand Prix Test',
    description: 'Official dressage test for Grand Prix level',
    type: 'Dressage Test',
    status: 'Active',
    fileType: 'PDF',
    fileSize: 312000, // 305 KB
    fileName: 'grand_prix_test.pdf',
    fileUrl: '/documents/tests/grand_prix_test.pdf',
    version: '2024.1',
    category: 'Dressage Tests',
    tags: ['Grand Prix', 'Official', 'FEI'],
    isPublic: true,
    downloadCount: 654,
    uploadedBy: 'Sarah Mitchell',
    uploadedById: 1,
    dateCreated: new Date('2024-01-15'),
    dateModified: new Date('2024-02-10'),
    metadata: {
      author: 'FEI / South African Dressage Federation',
      pages: 5,
      language: 'English',
      keywords: ['dressage', 'grand prix', 'test', 'FEI']
    }
  },
  {
    id: 14,
    name: 'Grading Certificate Template',
    description: 'Template for horse grading certificates',
    type: 'Certificate',
    status: 'Draft',
    fileType: 'DOCX',
    fileSize: 76800, // 75 KB
    fileName: 'grading_certificate_template.docx',
    fileUrl: '/documents/templates/grading_certificate_template.docx',
    version: '1.0-draft',
    category: 'Templates',
    tags: ['Certificate', 'Grading', 'Draft'],
    isPublic: false,
    downloadCount: 23,
    uploadedBy: 'Patricia Nkosi',
    uploadedById: 4,
    dateCreated: new Date('2024-03-01'),
    metadata: {
      author: 'SAEF Design Team',
      language: 'English',
      keywords: ['certificate', 'grading', 'template']
    }
  },
  {
    id: 15,
    name: 'Annual Report 2023',
    description: 'SAEF Dressage Division Annual Report for 2023',
    type: 'Report',
    status: 'Active',
    fileType: 'PDF',
    fileSize: 3145728, // 3 MB
    fileName: 'annual_report_2023.pdf',
    fileUrl: '/documents/reports/annual_report_2023.pdf',
    version: '1.0',
    category: 'Reports',
    tags: ['Annual Report', '2023', 'Statistics'],
    isPublic: true,
    downloadCount: 876,
    uploadedBy: 'Jennifer Adams',
    uploadedById: 2,
    dateCreated: new Date('2024-02-01'),
    metadata: {
      author: 'SAEF Dressage Committee',
      pages: 48,
      language: 'English',
      keywords: ['annual', 'report', '2023', 'statistics']
    }
  }
];

