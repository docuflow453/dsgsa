import { Routes } from '@angular/router';
import { LayoutComponent } from '@app/shared/components/layout/layout.component';

export const COMPETITIONS_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./competition-list/competition-list.component').then(m => m.CompetitionListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./competition-detail/competition-detail.component').then(m => m.CompetitionDetailComponent)
      },
      {
        path: ':id/entry',
        loadComponent: () => import('./competition-entry/competition-entry.component').then(m => m.CompetitionEntryComponent)
      }
    ]
  }
];

