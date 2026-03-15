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
        path: 'login',
        loadComponent: () => import('./auth-login/auth-login.component').then((c) => c.AuthLoginComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'register',
        loadComponent: () => import('./auth-register/auth-register.component').then((c) => c.AuthRegisterComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./forgot-password/forgot-password.component').then((c) => c.ForgotPasswordComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./reset-password/reset-password.component').then((c) => c.ResetPasswordComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'check-mail',
        loadComponent: () => import('./check-mail/check-mail.component').then((c) => c.CheckMailComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'code-verify',
        loadComponent: () => import('./code-verify/code-verify.component').then((c) => c.CodeVerifyComponent),
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
export class AuthenticationRoutingModule {}
