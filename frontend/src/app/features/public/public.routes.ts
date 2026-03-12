import { Routes } from '@angular/router';
import { PublicLayoutComponent } from '@app/shared/components/public-layout/public-layout.component';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'provinces',
        loadComponent: () => import('./provinces/provinces.component').then(m => m.ProvincesComponent)
      },
      {
        path: 'calendar',
        loadComponent: () => import('./calendar/calendar.component').then(m => m.CalendarComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./results/results.component').then(m => m.ResultsComponent)
      },
      {
        path: 'officials',
        loadComponent: () => import('./officials/officials.component').then(m => m.OfficialsComponent)
      },
      {
        path: 'news',
        loadComponent: () => import('./news/news.component').then(m => m.NewsComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent)
      }
    ]
  }
];

