/**
 * Admin Routes
 * Routes for Admin role functionality
 */

import { Routes } from '@angular/router';
import { Role } from '../../theme/shared/components/_helpers/role';

export const ADMIN_ROUTES: Routes = [
  // Admin Dashboard
  {
    path: 'dashboard',
    loadComponent: () => import('../../demo/dashboard/default/default.component').then((c) => c.DefaultComponent),
    data: {
      title: 'Dashboard',
      roles: [Role.Admin]
    }
  },
  {
    path: 'members',
    loadComponent: () => import('./pages/members/member-list.component').then((c) => c.MemberListComponent),
    data: {
      title: 'Members List',
      roles: [Role.Admin]
    }
  },
  {
    path: 'administrators',
    loadComponent: () => import('./pages/administrators/administrator-list.component').then((c) => c.AdministratorListComponent),
    data: {
      title: 'Administrators List',
      roles: [Role.Admin]
    }
  },
  {
    path: 'show-holding-bodies',
    loadComponent: () => import('./pages/show-holding-bodies/show-holding-body-list.component').then((c) => c.ShowHoldingBodyListComponent),
    data: {
      title: 'Show Holding Bodies',
      roles: [Role.Admin]
    }
  },
  {
    path: 'clubs',
    loadComponent: () => import('./pages/clubs/clubs-list.component').then((c) => c.ClubsListComponent),
    data: {
      title: 'Clubs',
      roles: [Role.Admin]
    }
  },
  {
    path: 'horses',
    loadComponent: () => import('./pages/horses/horses-list.component').then((c) => c.HorsesListComponent),
    data: {
      title: 'Horses',
      roles: [Role.Admin]
    }
  },
  {
    path: 'judges',
    loadComponent: () => import('./pages/judges/judges-list.component').then((c) => c.JudgesListComponent),
    data: {
      title: 'Judges',
      roles: [Role.Admin]
    }
  },
  {
    path: 'judges/create',
    loadComponent: () => import('./pages/judges/judge-form.component').then((c) => c.JudgeFormComponent),
    data: {
      title: 'Create Judge',
      roles: [Role.Admin]
    }
  },
  {
    path: 'judges/:id',
    loadComponent: () => import('./pages/judges/judge-detail.component').then((c) => c.JudgeDetailComponent),
    data: {
      title: 'Judge Details',
      roles: [Role.Admin]
    }
  },
  {
    path: 'judges/:id/edit',
    loadComponent: () => import('./pages/judges/judge-form.component').then((c) => c.JudgeFormComponent),
    data: {
      title: 'Edit Judge',
      roles: [Role.Admin]
    }
  },
  {
    path: 'email',
    loadComponent: () => import('./pages/email/email-list.component').then((c) => c.EmailListComponent),
    data: {
      title: 'Bulk Email Management',
      roles: [Role.Admin]
    }
  },
  {
    path: 'email/create',
    loadComponent: () => import('./pages/email/email-form.component').then((c) => c.EmailFormComponent),
    data: {
      title: 'Send Bulk Email',
      roles: [Role.Admin]
    }
  },
  {
    path: 'email/:id',
    loadComponent: () => import('./pages/email/email-detail.component').then((c) => c.EmailDetailComponent),
    data: {
      title: 'Email Details',
      roles: [Role.Admin]
    }
  },
  {
    path: 'membership-settings/types',
    loadComponent: () => import('./pages/membership-settings/types/membership-types-list.component').then((c) => c.MembershipTypesListComponent),
    data: {
      title: 'Membership Types',
      roles: [Role.Admin]
    }
  },
  {
    path: 'membership-settings/types/create',
    loadComponent: () => import('./pages/membership-settings/types/membership-type-form.component').then((c) => c.MembershipTypeFormComponent),
    data: {
      title: 'Add Membership Type',
      roles: [Role.Admin]
    }
  },
  {
    path: 'membership-settings/types/:id',
    loadComponent: () => import('./pages/membership-settings/types/membership-type-detail.component').then((c) => c.MembershipTypeDetailComponent),
    data: {
      title: 'Membership Type Details',
      roles: [Role.Admin]
    }
  },
  {
    path: 'membership-settings/types/:id/edit',
    loadComponent: () => import('./pages/membership-settings/types/membership-type-form.component').then((c) => c.MembershipTypeFormComponent),
    data: {
      title: 'Edit Membership Type',
      roles: [Role.Admin]
    }
  },
  {
    path: 'shows',
    loadComponent: () => import('./pages/shows/shows-list.component').then((c) => c.ShowsListComponent),
    data: {
      title: 'Shows / Competitions',
      roles: [Role.Admin]
    }
  },
  {
    path: 'shows/create',
    loadComponent: () => import('./pages/shows/show-form.component').then((c) => c.ShowFormComponent),
    data: {
      title: 'Create Show',
      roles: [Role.Admin]
    }
  },
  {
    path: 'shows/:id',
    loadComponent: () => import('./pages/shows/show-detail.component').then((c) => c.ShowDetailComponent),
    data: {
      title: 'Show Details',
      roles: [Role.Admin]
    }
  },
  {
    path: 'shows/:id/edit',
    loadComponent: () => import('./pages/shows/show-form.component').then((c) => c.ShowFormComponent),
    data: {
      title: 'Edit Show',
      roles: [Role.Admin]
    }
  },
  // Competitions route (alias for shows)
  {
    path: 'competitions',
    loadComponent: () => import('./pages/shows/shows-list.component').then((c) => c.ShowsListComponent),
    data: {
      title: 'Competitions',
      roles: [Role.Admin]
    }
  },
  // Documents routes
  {
    path: 'documents',
    loadComponent: () => import('./pages/documents/documents-list.component').then((c) => c.DocumentsListComponent),
    data: {
      title: 'Dressage Documents',
      roles: [Role.Admin]
    }
  },
  {
    path: 'documents/create',
    loadComponent: () => import('./pages/documents/document-form.component').then((c) => c.DocumentFormComponent),
    data: {
      title: 'Add Document',
      roles: [Role.Admin]
    }
  },
  {
    path: 'documents/:id',
    loadComponent: () => import('./pages/documents/document-detail.component').then((c) => c.DocumentDetailComponent),
    data: {
      title: 'Document Details',
      roles: [Role.Admin]
    }
  },
  {
    path: 'documents/:id/edit',
    loadComponent: () => import('./pages/documents/document-form.component').then((c) => c.DocumentFormComponent),
    data: {
      title: 'Edit Document',
      roles: [Role.Admin]
    }
  },
  // Reports routes
  {
    path: 'reports/membership-by-type',
    loadComponent: () => import('./pages/reports/membership-by-type-report.component').then((c) => c.MembershipByTypeReportComponent),
    data: {
      title: 'Membership By Type Report',
      roles: [Role.Admin]
    }
  },
  {
    path: 'reports/members',
    loadComponent: () => import('./pages/reports/members-report.component').then((c) => c.MembersReportComponent),
    data: {
      title: 'Members Report',
      roles: [Role.Admin]
    }
  },
  {
    path: 'reports/horse-ages',
    loadComponent: () => import('./pages/reports/horse-ages-report.component').then((c) => c.HorseAgesReportComponent),
    data: {
      title: 'Horse Ages Report',
      roles: [Role.Admin]
    }
  },
  {
    path: 'reports/recreational-members',
    loadComponent: () => import('./pages/reports/recreational-members-report.component').then((c) => c.RecreationalMembersReportComponent),
    data: {
      title: 'Recreational Members Report',
      roles: [Role.Admin]
    }
  },
  {
    path: 'reports/judges',
    loadComponent: () => import('./pages/reports/judges-report.component').then((c) => c.JudgesReportComponent),
    data: {
      title: 'Judges Report',
      roles: [Role.Admin]
    }
  },
  {
    path: 'reports/temporary-memberships',
    loadComponent: () => import('./pages/reports/temporary-memberships-report.component').then((c) => c.TemporaryMembershipsReportComponent),
    data: {
      title: 'Temporary Memberships Report',
      roles: [Role.Admin]
    }
  },
  // Settings routes
  // Years routes
  {
    path: 'settings/years',
    loadComponent: () => import('./pages/settings/years/years-list.component').then((c) => c.YearsListComponent),
    data: {
      title: 'Competition Years',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/years/create',
    loadComponent: () => import('./pages/settings/years/year-form.component').then((c) => c.YearFormComponent),
    data: {
      title: 'Add Year',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/years/:id',
    loadComponent: () => import('./pages/settings/years/year-detail.component').then((c) => c.YearDetailComponent),
    data: {
      title: 'Year Details',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/years/:id/edit',
    loadComponent: () => import('./pages/settings/years/year-form.component').then((c) => c.YearFormComponent),
    data: {
      title: 'Edit Year',
      roles: [Role.Admin]
    }
  },
  // Schools routes
  {
    path: 'settings/schools',
    loadComponent: () => import('./pages/settings/schools/schools-list.component').then((c) => c.SchoolsListComponent),
    data: {
      title: 'Schools',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/schools/create',
    loadComponent: () => import('./pages/settings/schools/school-form.component').then((c) => c.SchoolFormComponent),
    data: {
      title: 'Add School',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/schools/:id',
    loadComponent: () => import('./pages/settings/schools/school-detail.component').then((c) => c.SchoolDetailComponent),
    data: {
      title: 'School Details',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/schools/:id/edit',
    loadComponent: () => import('./pages/settings/schools/school-form.component').then((c) => c.SchoolFormComponent),
    data: {
      title: 'Edit School',
      roles: [Role.Admin]
    }
  },
  // Districts routes
  {
    path: 'settings/districts',
    loadComponent: () => import('./pages/settings/districts/districts-list.component').then((c) => c.DistrictsListComponent),
    data: {
      title: 'Districts',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/districts/create',
    loadComponent: () => import('./pages/settings/districts/district-form.component').then((c) => c.DistrictFormComponent),
    data: {
      title: 'Add District',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/districts/:id',
    loadComponent: () => import('./pages/settings/districts/district-detail.component').then((c) => c.DistrictDetailComponent),
    data: {
      title: 'District Details',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/districts/:id/edit',
    loadComponent: () => import('./pages/settings/districts/district-form.component').then((c) => c.DistrictFormComponent),
    data: {
      title: 'Edit District',
      roles: [Role.Admin]
    }
  },
  // Accounting Periods routes
  {
    path: 'settings/accounting-periods',
    loadComponent: () =>
      import('./pages/settings/accounting-periods/accounting-periods-list.component').then((c) => c.AccountingPeriodsListComponent),
    data: {
      title: 'Accounting Periods',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/accounting-periods/create',
    loadComponent: () =>
      import('./pages/settings/accounting-periods/accounting-period-form.component').then((c) => c.AccountingPeriodFormComponent),
    data: {
      title: 'Add Accounting Period',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/accounting-periods/:id',
    loadComponent: () =>
      import('./pages/settings/accounting-periods/accounting-period-detail.component').then((c) => c.AccountingPeriodDetailComponent),
    data: {
      title: 'Accounting Period Details',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/accounting-periods/:id/edit',
    loadComponent: () =>
      import('./pages/settings/accounting-periods/accounting-period-form.component').then((c) => c.AccountingPeriodFormComponent),
    data: {
      title: 'Edit Accounting Period',
      roles: [Role.Admin]
    }
  },
  // Grading and Tests - Grades routes
  {
    path: 'grading/grades',
    loadComponent: () => import('./pages/grading/grades/grades-list.component').then((c) => c.GradesListComponent),
    data: {
      title: 'Grades',
      roles: [Role.Admin]
    }
  },
  {
    path: 'grading/grades/create',
    loadComponent: () => import('./pages/grading/grades/grade-form.component').then((c) => c.GradeFormComponent),
    data: {
      title: 'Add Grade',
      roles: [Role.Admin]
    }
  },
  {
    path: 'grading/grades/:id',
    loadComponent: () => import('./pages/grading/grades/grade-detail.component').then((c) => c.GradeDetailComponent),
    data: {
      title: 'Grade Details',
      roles: [Role.Admin]
    }
  },
  {
    path: 'grading/grades/:id/edit',
    loadComponent: () => import('./pages/grading/grades/grade-form.component').then((c) => c.GradeFormComponent),
    data: {
      title: 'Edit Grade',
      roles: [Role.Admin]
    }
  },
  // Grading and Tests - Class Types routes
  {
    path: 'grading/class-types',
    loadComponent: () => import('./pages/grading/class-types/class-types-list.component').then((c) => c.ClassTypesListComponent),
    data: {
      title: 'Class Types',
      roles: [Role.Admin]
    }
  },
  {
    path: 'grading/class-types/create',
    loadComponent: () => import('./pages/grading/class-types/class-type-form.component').then((c) => c.ClassTypeFormComponent),
    data: {
      title: 'Add Class Type',
      roles: [Role.Admin]
    }
  },
  {
    path: 'grading/class-types/:id',
    loadComponent: () => import('./pages/grading/class-types/class-type-detail.component').then((c) => c.ClassTypeDetailComponent),
    data: {
      title: 'Class Type Details',
      roles: [Role.Admin]
    }
  },
  {
    path: 'grading/class-types/:id/edit',
    loadComponent: () => import('./pages/grading/class-types/class-type-form.component').then((c) => c.ClassTypeFormComponent),
    data: {
      title: 'Edit Class Type',
      roles: [Role.Admin]
    }
  },
  // Membership Types routes (new location under settings)
  {
    path: 'settings/membership-types',
    loadComponent: () => import('./pages/membership-settings/types/membership-types-list.component').then((c) => c.MembershipTypesListComponent),
    data: {
      title: 'Membership Types',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/membership-types/create',
    loadComponent: () => import('./pages/membership-settings/types/membership-type-form.component').then((c) => c.MembershipTypeFormComponent),
    data: {
      title: 'Add Membership Type',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/membership-types/:id',
    loadComponent: () => import('./pages/membership-settings/types/membership-type-detail.component').then((c) => c.MembershipTypeDetailComponent),
    data: {
      title: 'Membership Type Details',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/membership-types/:id/edit',
    loadComponent: () => import('./pages/membership-settings/types/membership-type-form.component').then((c) => c.MembershipTypeFormComponent),
    data: {
      title: 'Edit Membership Type',
      roles: [Role.Admin]
    }
  },
  // VAT Codes routes
  {
    path: 'settings/vat-codes',
    loadComponent: () => import('./pages/settings/vat-codes/vat-codes-list.component').then((c) => c.VATCodesListComponent),
    data: {
      title: 'VAT Codes',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/vat-codes/create',
    loadComponent: () => import('./pages/settings/vat-codes/vat-code-form.component').then((c) => c.VATCodeFormComponent),
    data: {
      title: 'Add VAT Code',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/vat-codes/:id',
    loadComponent: () => import('./pages/settings/vat-codes/vat-code-detail.component').then((c) => c.VATCodeDetailComponent),
    data: {
      title: 'VAT Code Details',
      roles: [Role.Admin]
    }
  },
  {
    path: 'settings/vat-codes/:id/edit',
    loadComponent: () => import('./pages/settings/vat-codes/vat-code-form.component').then((c) => c.VATCodeFormComponent),
    data: {
      title: 'Edit VAT Code',
      roles: [Role.Admin]
    }
  }
];

