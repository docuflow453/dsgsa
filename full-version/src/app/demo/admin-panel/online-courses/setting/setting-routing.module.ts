import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'payment',
        loadComponent: () => import('./setting-payment/setting-payment.component').then((c) => c.SettingPaymentComponent)
      },
      {
        path: 'price',
        loadComponent: () => import('./setting-pricing/setting-pricing.component').then((c) => c.SettingPricingComponent)
      },
      {
        path: 'notification',
        loadComponent: () => import('./setting-notification/setting-notification.component').then((c) => c.SettingNotificationComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule {}
