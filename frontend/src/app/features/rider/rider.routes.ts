import { Routes } from '@angular/router';
import { LayoutComponent } from '@app/shared/components/layout/layout.component';

export const RIDER_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'horses',
        loadComponent: () => import('./horses/horses.component').then(m => m.HorsesComponent)
      },
      {
        path: 'entries',
        loadComponent: () => import('./entries/entries.component').then(m => m.EntriesComponent)
      },
      {
        path: 'documents',
        loadComponent: () => import('./documents/documents.component').then(m => m.DocumentsComponent)
      },
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      }
    ]
  }
];

