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
        path: 'user-profile',
        loadComponent: () => import('./user-profile/user-profile.component').then((c) => c.UserProfileComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'account-profile',
        loadComponent: () => import('./account-profile/account-profile.component').then((c) => c.AccountProfileComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'user-list',
        loadComponent: () => import('./user-list/user-list.component').then((c) => c.UserListComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'user-card',
        loadComponent: () => import('./user-card/user-card.component').then((c) => c.UserCardComponent),
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
export class UserRoutingModule {}
