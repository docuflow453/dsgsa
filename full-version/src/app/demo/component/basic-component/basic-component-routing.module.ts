import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'alert',
        loadComponent: () => import('./alert/alert.component').then((c) => c.AlertComponent)
      },
      {
        path: 'button',
        loadComponent: () => import('./button/button.component').then((c) => c.ButtonComponent)
      },
      {
        path: 'badges',
        loadComponent: () => import('./badges/badges.component').then((c) => c.BadgesComponent)
      },
      {
        path: 'breadcrumb',
        loadComponent: () => import('./breadcrumb/breadcrumb.component').then((c) => c.BreadcrumbComponent)
      },
      {
        path: 'cards',
        loadComponent: () => import('./cards/cards.component').then((c) => c.CardsComponent)
      },
      {
        path: 'placeholder',
        loadComponent: () => import('./placeholder/placeholder.component').then((c) => c.PlaceholderComponent)
      },
      {
        path: 'collapse',
        loadComponent: () => import('./collapse/collapse.component').then((c) => c.CollapseComponent)
      },
      {
        path: 'color',
        loadComponent: () => import('./colors/colors.component').then((c) => c.ColorsComponent)
      },
      {
        path: 'carousel',
        loadComponent: () => import('./carousel/carousel.component').then((c) => c.CarouselComponent)
      },
      {
        path: 'dropdowns',
        loadComponent: () => import('./dropdowns/dropdowns.component').then((c) => c.DropdownsComponent)
      },
      {
        path: 'offcanvas',
        loadComponent: () => import('./offcanvas/offcanvas.component').then((c) => c.OffcanvasComponent)
      },
      {
        path: 'progress',
        loadComponent: () => import('./progress/progress.component').then((c) => c.ProgressComponent)
      },
      {
        path: 'list-group',
        loadComponent: () => import('./list-group/list-group.component').then((c) => c.ListGroupComponent)
      },
      {
        path: 'modal',
        loadComponent: () => import('./modal/modal.component').then((c) => c.ModalComponent)
      },
      {
        path: 'spinner',
        loadComponent: () => import('./spinner/spinner.component').then((c) => c.SpinnerComponent)
      },
      {
        path: 'tabs-pills',
        loadComponent: () => import('./tabs-pills/tabs-pills.component').then((c) => c.TabsPillsComponent)
      },
      {
        path: 'tooltip',
        loadComponent: () => import('./tooltip/tooltip.component').then((c) => c.TooltipComponent)
      },
      {
        path: 'toasts',
        loadComponent: () => import('./toasts/toasts.component').then((c) => c.ToastsComponent)
      },
      {
        path: 'other',
        loadComponent: () => import('./basic-other/basic-other.component').then((c) => c.BasicOtherComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicComponentRoutingModule {}
