import { Component, OnInit, signal, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { form, Field } from '@angular/forms/signals';
import { required, email } from '@angular/forms/signals';
import { AuthService } from '../../../core/services/auth.service';
import { AuthenticationService } from '../../../theme/shared/service/authentication.service';
import { UserRole } from '../../../core/models/user.model';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { SharedModule } from '../../../theme/shared/shared.module';
import { IconService } from '@ant-design/icons-angular';
import { EyeInvisibleOutline, EyeOutline } from '@ant-design/icons-angular/icons';

interface LoginData {
  email: string;
  password: string;
}

/**
 * Login Component - User authentication
 * Uses Angular Signals-based forms with dual auth service synchronization
 * Ensures proper state synchronization across the application
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, Field, SharedModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  authenticationService = inject(AuthenticationService);
  private iconService = inject(IconService);
  private cd = inject(ChangeDetectorRef);

  showPassword = false;
  submitted = false;
  error = '';
  loading = false;
  returnUrl = '/dashboard';

  // Signal holding the form data
  private readonly loginData = signal<LoginData>({
    email: '',
    password: ''
  });

  // Create the signal form with validators
  loginForm = form(this.loginData, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Please enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
  });

  constructor() {
    this.iconService.addIcon(...[EyeOutline, EyeInvisibleOutline]);
  }

  ngOnInit(): void {
    // Get return URL from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Helper to check form validity (both fields required)
  get isFormValid() {
    const val = this.loginForm().value();
    return val.email.trim() !== '' && val.password.trim() !== '';
  }

  /**
   * Get role-specific dashboard path
   * Redirects users to their appropriate dashboard based on their role
   */
  private getRoleDashboardPath(roles: UserRole[]): string {
    // Check roles in priority order (highest priority first)
    console.log('Getting dashboard path for roles:', roles);
    console.log('Admin role:', UserRole.ADMIN, '  is admin -> ', roles.includes(UserRole.ADMIN));
    if (roles.includes(UserRole.ADMIN)) {
      return '/dashboard/default';
    } else if (roles.includes(UserRole.SAEF)) {
      return '/saef/dashboard';
    } else if (roles.includes(UserRole.PROVINCIAL)) {
      return '/provincial/dashboard';
    } else if (roles.includes(UserRole.CLUB)) {
      return '/clubs/dashboard';
    } else if (roles.includes(UserRole.SHOW_HOLDING_BODY)) {
      return '/shb/dashboard';
    } else if (roles.includes(UserRole.RIDER)) {
      return '/my/dashboard';
    } else {
      // Default fallback
      return '/dashboard/default';
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (!this.isFormValid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const { email, password } = this.loginForm().value();

    // Use AuthenticationService (theme service) for login
    // This ensures the sidebar navigation and theme components update correctly
    this.authenticationService.login(email, password).pipe(
      switchMap(() => {
        // After theme service login, also sync with core AuthService
        // This ensures both services are in sync
        return this.authService.login({ email, password, rememberMe: false }).pipe(
          catchError(error => {
            // If core service fails, still proceed (theme service already succeeded)
            console.warn('Core AuthService sync failed, but theme service succeeded:', error);
            return of(null);
          })
        );
      })
    ).subscribe({
      next: () => {
        // Get the current user and redirect to their role-specific dashboard
        // Try to get user from theme service (which is the primary one)
        const themeUser = this.authenticationService.currentUserValue;
        const coreUser = this.authService.currentUserValue;

        console.log('✅ Login successful');
        console.log('Theme user:', themeUser);
        console.log('Core user:', coreUser);
        if (themeUser && themeUser.user && themeUser.user.role) {
          // Map theme user role to core UserRole for consistency
          const roles = this.mapThemeRoleToUserRoles(themeUser.user.role);
          const dashboardPath = this.getRoleDashboardPath(roles);
          console.log('🚀 Navigating to:', dashboardPath);
          this.router.navigate([dashboardPath]);
        } else if (coreUser && coreUser.roles && coreUser.roles.length > 0) {
          const dashboardPath = this.getRoleDashboardPath(coreUser.roles);
          console.log('🚀 Navigating to:', dashboardPath);
          this.router.navigate([dashboardPath]);
        } else {
          // Fallback to return URL or default dashboard
          console.log('🚀 Navigating to returnUrl:', this.returnUrl);
          this.router.navigate([this.returnUrl]);
        }
      },
      error: (error) => {
        // Error - display message
        this.error = error.message || error || 'Login failed. Please check your credentials.';
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  /**
   * Map theme Role to core UserRole array
   * This ensures compatibility between the two auth services
   */
  private mapThemeRoleToUserRoles(role: any): UserRole[] {
    // Theme Role enum values: Admin, Rider, Club, SAEF, Provincial, ShowHoldingBody, Official
    const roleMap: { [key: string]: UserRole } = {
      'ADMIN': UserRole.ADMIN,
      'RIDER': UserRole.RIDER,
      'CLUB': UserRole.CLUB,
      'SAEF': UserRole.SAEF,
      'PROVINCIAL': UserRole.PROVINCIAL,
      'SHOW_HOLDING_BODY': UserRole.SHOW_HOLDING_BODY,
      'OFFICIAL': UserRole.OFFICIAL
    };

    const roleName = typeof role === 'string' ? role : role.toString();
    return [roleMap[roleName] || UserRole.RIDER];
  }
}

