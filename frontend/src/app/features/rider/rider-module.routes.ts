import { Routes } from '@angular/router';
import { RiderLayoutComponent } from '@shared/components/rider-layout/rider-layout.component';

export const RIDER_MODULE_ROUTES: Routes = [
  {
    path: '',
    component: RiderLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./rider-dashboard/rider-dashboard.component').then(m => m.RiderDashboardComponent)
      },
      {
        path: 'entries',
        loadComponent: () => import('./rider-entries/rider-entries.component').then(m => m.RiderEntriesComponent)
      },
      {
        path: 'horses',
        loadComponent: () => import('./rider-horses/rider-horses.component').then(m => m.RiderHorsesComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./rider-results/rider-results.component').then(m => m.RiderResultsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./rider-profile/rider-profile.component').then(m => m.RiderProfileComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./rider-settings/rider-settings.component').then(m => m.RiderSettingsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

