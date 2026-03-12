import { Routes } from '@angular/router';
import { LayoutComponent } from '@app/shared/components/layout/layout.component';

export const CLUBS_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./club-dashboard/club-dashboard.component').then(m => m.ClubDashboardComponent)
      }
    ]
  }
];

