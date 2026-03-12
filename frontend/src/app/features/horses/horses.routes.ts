import { Routes } from '@angular/router';
import { LayoutComponent } from '@app/shared/components/layout/layout.component';

export const HORSES_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./horse-list/horse-list.component').then(m => m.HorseListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./horse-form/horse-form.component').then(m => m.HorseFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./horse-detail/horse-detail.component').then(m => m.HorseDetailComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./horse-form/horse-form.component').then(m => m.HorseFormComponent)
      }
    ]
  }
];

