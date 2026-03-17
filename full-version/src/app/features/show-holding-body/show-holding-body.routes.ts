import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/user.model';

export const SHOW_HOLDING_BODY_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    // canActivate: [authGuard, roleGuard],
    // data: { roles: [UserRole.SHOW_HOLDING_BODY] }
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    // canActivate: [authGuard, roleGuard],
    // data: { roles: [UserRole.SHOW_HOLDING_BODY] }
  },
  {
    path: 'members',
    loadComponent: () => import('./pages/members/members.component').then(m => m.MembersComponent),
    // canActivate: [authGuard, roleGuard],
    // data: { roles: [UserRole.SHOW_HOLDING_BODY] }
  },
  // Competitions Management
  {
    path: 'competitions',
    loadComponent: () => import('./pages/competitions/competition-list/competition-list.component').then(m => m.CompetitionListComponent),
    // canActivate: [authGuard, roleGuard],
    // data: { roles: [UserRole.SHOW_HOLDING_BODY] }
  },
  {
    path: 'competitions/:id',
    loadComponent: () => import('./pages/competitions/competition-detail/competition-detail.component').then(m => m.CompetitionDetailComponent),
    // canActivate: [authGuard, roleGuard],
    // data: { roles: [UserRole.SHOW_HOLDING_BODY] }
  },
  // Global Management
  {
    path: 'extras',
    loadComponent: () => import('./pages/extras/extras.component').then(m => m.ExtrasComponent),
    // canActivate: [authGuard, roleGuard],
    // data: { roles: [UserRole.SHOW_HOLDING_BODY] }
  },
  {
    path: 'levies',
    loadComponent: () => import('./pages/levies/levies.component').then(m => m.LeviesComponent),
    // canActivate: [authGuard, roleGuard],
    // data: { roles: [UserRole.SHOW_HOLDING_BODY] }
  },
  {
    path: 'arenas',
    loadComponent: () => import('./pages/arenas/arenas.component').then(m => m.ArenasComponent),
    // canActivate: [authGuard, roleGuard],
    // data: { roles: [UserRole.SHOW_HOLDING_BODY] }
  },
  {
    path: 'payment-methods',
    loadComponent: () => import('./pages/payment-methods/payment-methods.component').then(m => m.PaymentMethodsComponent),
    // canActivate: [authGuard, roleGuard],
    // data: { roles: [UserRole.SHOW_HOLDING_BODY] }
  }
];

