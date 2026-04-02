import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sweet-alert',
        loadComponent: () => import('./sweet-alert/sweet-alert.component').then((c) => c.SweetAlertComponent)
      },
      {
        path: 'date-picker',
        loadChildren: () => import('./datepicker/datepicker.module').then((m) => m.DatepickerModule)
      },
      {
        path: 'light-box',
        loadComponent: () => import('./adv-lightbox/adv-lightbox.component')
      },
      {
        path: 'modal',
        loadComponent: () => import('./adv-modal/adv-modal.component')
      },
      {
        path: 'notification',
        loadChildren: () => import('./adv-notification//adv-notification.module').then((m) => m.AdvNotificationModule)
      },
      {
        path: 'range-slider',
        loadComponent: () => import('./range-slider/range-slider.component')
      },
      {
        path: 'tree-view',
        loadComponent: () => import('./tree-view/tree-view.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvanceComponentRoutingModule {}
