import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'vertical',
        loadComponent: () => import('./theme-vertical/theme-vertical.component').then((c) => c.ThemeVerticalComponent)
      },
      {
        path: 'horizontal',
        loadComponent: () => import('./theme-horizontal/theme-horizontal.component').then((c) => c.ThemeHorizontalComponent)
      },
      {
        path: 'compact',
        loadComponent: () => import('./theme-compact/theme-compact.component').then((c) => c.ThemeCompactComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutsRoutingModule {}
