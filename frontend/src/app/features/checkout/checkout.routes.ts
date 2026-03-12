import { Routes } from '@angular/router';
import { LayoutComponent } from '@app/shared/components/layout/layout.component';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent)
      }
    ]
  }
];

