import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public routes (no authentication required)
  {
    path: '',
    loadChildren: () => import('./features/public/public.routes').then(m => m.PUBLIC_ROUTES)
  },
  // Authentication routes
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  // Protected routes (authentication required)
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [authGuard]
  },
  // Rider-specific dashboard (new layout)
  {
    path: 'my',
    loadChildren: () => import('./features/rider/rider-module.routes').then(m => m.RIDER_MODULE_ROUTES),
    canActivate: [authGuard]
  },
  // Legacy rider routes (using general layout)
  {
    path: 'riders',
    loadChildren: () => import('./features/rider/rider.routes').then(m => m.RIDER_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'horses',
    loadChildren: () => import('./features/horses/horses.routes').then(m => m.HORSES_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'competitions',
    loadChildren: () => import('./features/competitions/competitions.routes').then(m => m.COMPETITIONS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'clubs',
    loadChildren: () => import('./features/clubs/clubs.routes').then(m => m.CLUBS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'checkout',
    loadChildren: () => import('./features/checkout/checkout.routes').then(m => m.CHECKOUT_ROUTES),
    canActivate: [authGuard]
  },
  // Fallback route
  {
    path: '**',
    redirectTo: '/'
  }
];

