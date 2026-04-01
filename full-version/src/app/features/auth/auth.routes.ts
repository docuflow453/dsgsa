import { Routes } from '@angular/router';
import { publicGuard } from '../../core/guards/public.guard';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TwoFactorAuthComponent } from './two-factor-auth/two-factor-auth.component';

/**
 * Auth Routes - Lazy loaded authentication routes
 * All routes use publicGuard to redirect authenticated users
 */
export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [publicGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent,
        title: 'Login - DSRiding'
      },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Register - DSRiding'
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        title: 'Forgot Password - DSRiding'
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        title: 'Reset Password - DSRiding'
      },
      {
        path: 'two-factor',
        component: TwoFactorAuthComponent,
        title: 'Two-Factor Authentication - DSRiding'
      }
    ]
  }
];

