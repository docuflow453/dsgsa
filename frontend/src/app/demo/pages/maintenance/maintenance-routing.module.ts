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
        path: 'error-404',
        loadComponent: () => import('./error/error.component').then((c) => c.ErrorComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'error-500',
        loadComponent: () => import('./error-two/error-two.component').then((c) => c.ErrorTwoComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'error-401',
        loadComponent: () => import('./unauthorize-error/unauthorize-error.component').then((c) => c.UnauthorizeErrorComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'coming-soon',
        loadComponent: () => import('./coming-soon/coming-soon.component').then((c) => c.ComingSoonComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'under-construct',
        loadComponent: () => import('./under-construct/under-construct.component').then((c) => c.UnderConstructComponent),
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
export class MaintenanceRoutingModule {}
