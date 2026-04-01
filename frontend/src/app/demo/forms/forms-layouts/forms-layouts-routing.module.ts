import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'layouts',
        loadComponent: () => import('./forms-layouts/forms-layouts.component').then((c) => c.FormsLayoutsComponent)
      },
      {
        path: 'actionBars',
        loadComponent: () => import('./form-actionbars/form-actionbars.component').then((c) => c.FormActionbarsComponent)
      },
      {
        path: 'multiColumn',
        loadComponent: () => import('./form-multicolumn/form-multicolumn.component').then((c) => c.FormMulticolumnComponent)
      },
      {
        path: 'stickyBar',
        loadComponent: () => import('./sticky-actionbarn/sticky-actionbarn.component').then((c) => c.StickyActionbarnComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsLayoutsRoutingModule {}
