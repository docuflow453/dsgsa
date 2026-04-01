// Angular imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// project import
import { Role } from 'src/app/theme/shared/components/_helpers/role';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'basic-table',
        loadComponent: () => import('./basic-table/basic-table.component').then((c) => c.BasicTableComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'sizing-table',
        loadComponent: () => import('./sizing-table/sizing-table.component').then((c) => c.SizingTableComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'border-table',
        loadComponent: () => import('./border-table/border-table.component').then((c) => c.BorderTableComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'styling-table',
        loadComponent: () => import('./styling-table/styling-table.component').then((c) => c.StylingTableComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BootstrapTableRoutingModule {}
