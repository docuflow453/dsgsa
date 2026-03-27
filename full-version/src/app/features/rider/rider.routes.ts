import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/user.model';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

/**
 * Rider Routes - Lazy loaded rider feature routes
 * All routes require authentication and RIDER role
 * Uses AdminLayout (parent route in app-routing.module.ts)
 */
export const RIDER_ROUTES: Routes = [
  {
    path: '',
    // Temporarily disabled role guard - using AuthenticationService instead of AuthService
    // canActivate: [authGuard, roleGuard],
    // data: { roles: [UserRole.RIDER] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Dashboard - DSRiding'
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        title: 'My Profile - DSRiding'
      },
      {
        path: 'transactions',
        loadComponent: () => import('./pages/transactions/transactions.component').then(m => m.TransactionsComponent),
        title: 'Transactions - DSRiding'
      },
      {
        path: 'entries',
        loadComponent: () => import('./pages/entries/entries.component').then(m => m.EntriesComponent),
        title: 'My Entries - DSRiding'
      },
      {
        path: 'entries/competitions',
        loadComponent: () => import('./pages/entries/competition-selection/competition-selection.component').then(m => m.CompetitionSelectionComponent),
        title: 'Select Competition - DSRiding'
      },
      {
        path: 'entries/entry-details/:slug',
        loadComponent: () => import('./pages/entries/entry-details/entry-details.component').then(m => m.EntryDetailsComponent),
        title: 'Entry Details - DSRiding'
      },
      {
        path: 'entries/entry-extras',
        loadComponent: () => import('./pages/entries/entry-extras/entry-extras.component').then(m => m.EntryExtrasComponent),
        title: 'Competition Extras - DSRiding'
      },
      {
        path: 'entries/entry-checkout',
        loadComponent: () => import('./pages/entries/entry-checkout/entry-checkout.component').then(m => m.EntryCheckoutComponent),
        title: 'Checkout - DSRiding'
      },
      {
        path: 'horses',
        loadComponent: () => import('./pages/horses/horses.component').then(m => m.HorsesComponent),
        title: 'My Horses - DSRiding'
      },
      {
        path: 'horses/new',
        loadComponent: () => import('./pages/horses/horse-form/horse-form.component').then(m => m.HorseFormComponent),
        title: 'Add Horse - DSRiding'
      },
      {
        path: 'horses/:id',
        loadComponent: () => import('./pages/horses/horse-detail/horse-detail.component').then(m => m.HorseDetailComponent),
        title: 'Horse Details - DSRiding'
      },
      {
        path: 'horses/:id/edit',
        loadComponent: () => import('./pages/horses/horse-form/horse-form.component').then(m => m.HorseFormComponent),
        title: 'Edit Horse - DSRiding'
      },
      {
        path: 'clubs',
        loadComponent: () => import('./pages/clubs/clubs.component').then(m => m.ClubsComponent),
        title: 'My Clubs - DSRiding'
      },
      {
        path: 'security',
        loadComponent: () => import('./pages/security/security.component').then(m => m.SecurityComponent),
        title: 'Security Settings - DSRiding'
      },
      {
        path: 'two-factor',
        loadComponent: () => import('./pages/two-factor/two-factor.component').then(m => m.TwoFactorComponent),
        title: 'Two-Factor Authentication - DSRiding'
      },
      {
        path: 'memberships',
        loadComponent: () => import('./pages/memberships/memberships.component').then(m => m.MembershipsComponent),
        title: 'SAEF Memberships - DSRiding'
      },
      {
        path: 'invoices',
        loadComponent: () => import('./pages/invoices/invoices.component').then(m => m.InvoicesComponent),
        title: 'Invoices - DSRiding'
      },
      {
        path: 'calendar',
        loadComponent: () => import('./pages/calendar/calendar.component').then(m => m.CalendarComponent),
        title: 'Competition Calendar - DSRiding'
      },
      {
        path: 'calendar/:id',
        loadComponent: () => import('./pages/calendar/competition-detail/competition-detail.component').then(m => m.CompetitionDetailComponent),
        title: 'Competition Details - DSRiding'
      }
    ]
  }
];

