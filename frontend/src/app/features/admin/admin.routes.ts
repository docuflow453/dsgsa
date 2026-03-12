import { Routes } from '@angular/router';
import { LayoutComponent } from '@app/shared/components/layout/layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'competitions',
        loadComponent: () => import('./competitions/competitions.component').then(m => m.AdminCompetitionsComponent)
      }
    ]
  }
];

