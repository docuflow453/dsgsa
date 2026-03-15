import { Routes } from '@angular/router';
import { RiderLayoutComponent } from '@shared/components/rider-layout/rider-layout.component';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    component: RiderLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent)
      }
    ]
  }
];

