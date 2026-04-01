import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComNavigationComponent } from './com-navigation.component';

const routes: Routes = [
  {
    path: '',
    component: ComNavigationComponent,
    children: [
      {
        path: '',
        redirectTo: 'components/basic/button',
        pathMatch: 'full'
      },
      {
        path: 'basic',
        loadChildren: () => import('src/app/demo/component/basic-component/basic-component.module').then((m) => m.BasicComponentModule)
      },
      {
        path: 'advance',
        loadChildren: () =>
          import('src/app/demo/component/advance-component/advance-component.module').then((m) => m.AdvanceComponentModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComNavigationRoutingModule {}
