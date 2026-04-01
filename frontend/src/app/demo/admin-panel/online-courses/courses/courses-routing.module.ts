// angular imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// project import
import { Role } from 'src/app/theme/shared/components/_helpers/role';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'view',
        loadComponent: () => import('./courses-view/courses-view.component').then((c) => c.CoursesViewComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'add',
        loadComponent: () => import('./courses-add/courses-add.component').then((c) => c.CoursesAddComponent),
        data: {
          roles: [Role.Admin]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule {}
