import { Component, signal, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { form, Field } from '@angular/forms/signals';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { DASHBOARD_PATH } from 'src/app/app-config';
import { Role } from 'src/app/theme/shared/components/_helpers/role';

import { IconService } from '@ant-design/icons-angular';
import { EyeInvisibleOutline, EyeOutline } from '@ant-design/icons-angular/icons';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-auth-login',
  imports: [CommonModule, RouterModule, SharedModule, Field],
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  authenticationService = inject(AuthenticationService);
  private iconService = inject(IconService);
  private cd = inject(ChangeDetectorRef);

  showPassword = false;
  submitted = false;
  error = '';
  loading = false;
  returnUrl!: string;

  // Signal holding the form data
  private readonly loginData = signal<LoginData>({
    email: '',
    password: ''
  });

  // Create the signal form based on loginData signal
  loginForm = form(this.loginData);

  constructor() {
    this.iconService.addIcon(...[EyeOutline, EyeInvisibleOutline]);

    // Redirect if already logged in
    if (window.location.pathname !== '/auth/login') {
      const user = this.authenticationService.currentUserValue;
      if (user && user.user && user.user.role) {
        const dashboardPath = this.getRoleDashboardPath(user.user.role);
        this.router.navigate([dashboardPath]);
      }
    }
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
  private getRoleDashboardPath(role: Role): string {
    // Map role to dashboard path based on actual user role from API
    console.log('Getting dashboard path for role:', role);
    console.log('Rider role', Role.Rider);
    const roleToLower = role.toLowerCase();
    switch (roleToLower) {
      case Role.Admin.toLowerCase():
        return '/admin/dashboard';
      case Role.SAEF.toLowerCase():
        return '/saef/dashboard';
      case Role.Provincial.toLowerCase():
        return '/provincial/dashboard';
      case Role.Club.toLowerCase():
        return '/clubs/dashboard';
      case Role.ShowHoldingBody.toLowerCase():
        return '/shb/dashboard';
      case Role.Rider.toLowerCase():
        return '/my/dashboard';
      case Role.Official.toLowerCase():
        return '/official/dashboard';
      default:
        // Default fallback
        return DASHBOARD_PATH;
    }
  }

  onSubmit() {
    this.submitted = true;

    if (!this.isFormValid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const { email, password } = this.loginForm().value();

    // Login with real API - no role selection needed
    this.authenticationService.login(email, password).subscribe({
      next: () => {
        // Get the current user and redirect to their role-specific dashboard
        const user = this.authenticationService.currentUserValue;
        console.log('✅ Login successful, user:', user);
        if (user && user.user && user.user.role) {
          console.log('📍 User role:', user.user.role);
          const dashboardPath = this.getRoleDashboardPath(user.user.role);
          console.log('🚀 Navigating to:', dashboardPath);
          this.router.navigate([dashboardPath]);
        } else {
          // Fallback to default dashboard if user or role not available
          console.warn('⚠️ User role not available, redirecting to default dashboard');
          this.router.navigate([DASHBOARD_PATH]);
        }
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }
}
