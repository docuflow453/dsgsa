import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/user.model';
import { RiderLayoutComponent } from './rider-layout/rider-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

/**
 * Rider Routes - Lazy loaded rider feature routes
 * All routes require authentication and RIDER role
 */
export const RIDER_ROUTES: Routes = [
  {
    path: '',
    component: RiderLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.RIDER] },
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
        path: 'horses',
        loadComponent: () => import('./pages/horses/horses.component').then(m => m.HorsesComponent),
        title: 'My Horses - DSRiding'
      }
    ]
  }
];

