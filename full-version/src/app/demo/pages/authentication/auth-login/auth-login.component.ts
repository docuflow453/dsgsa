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

interface Roles {
  name: string;
  email: string;
  password: string;
  role: string;
}

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

  // Roles and selection logic unchanged here...
  roles: Roles[] = [
    { name: 'Admin', email: 'admin@gmail.com', password: 'Admin@123', role: 'Admin' },
    { name: 'SHB', email: 'admin@gmail.com', password: 'Admin@123', role: 'ShowHoldingBody' },
    { name: 'Club', email: 'admin@gmail.com', password: 'Admin@123', role: 'Club' },
    { name: 'Province', email: 'admin@gmail.com', password: 'Admin@123', role: 'Province' },
    { name: 'Rider', email: 'admin@gmail.com', password: 'Admin@123', role: 'Rider' }
  ];

  selectedRole = this.roles[0];

  onSelectRole(role: (typeof this.roles)[0]) {
    this.selectedRole = role;
    // Update loginForm signal values when role changes
    this.loginData.set({ email: role.email, password: role.password });
  }

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
    // Initially set form values to selectedRole
    this.loginData.set({ email: this.selectedRole.email, password: this.selectedRole.password });
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
    // Map role to dashboard path
    console.log(role)
    const _role = this.selectedRole.role;
    switch (_role) {
      case Role.Admin:
        return '/dashboard/default';
      case Role.SAEF:
        return '/saef/dashboard';
      case Role.Provincial:
        return '/provincial/dashboard';
      case Role.Club:
        return '/clubs/dashboard';
      case Role.ShowHoldingBody:
        return '/shb/dashboard';
      case Role.Rider:
        return '/my/dashboard';
      case Role.Official:
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

    // Pass the selected role to the authentication service for test persona
    const selectedRoleEnum = this.selectedRole.role as Role;

    this.authenticationService.login(email, password, selectedRoleEnum).subscribe({
      next: () => {
        // Get the current user and redirect to their role-specific dashboard
        const user = this.authenticationService.currentUserValue;
        console.log('✅ Login successful, user:', user);
        console.log('🎯 Selected role:', this.selectedRole);
        if (user && user.user && user.user.role) {
          console.log('📍 User role:', user.user.role);
          const dashboardPath = this.getRoleDashboardPath(user.user.role);
          console.log('🚀 Navigating to:', dashboardPath);
          this.router.navigate([dashboardPath]);
        } else {
          // Fallback to default dashboard if user or role not available
          const dashboardPath = this.getRoleDashboardPath({} as Role);
          // this.router.navigate([DASHBOARD_PATH]);
          this.router.navigate([dashboardPath]);
        }
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  socialMedia = [
    { name: 'Google', logo: 'google.svg' },
    { name: 'Twitter', logo: 'twitter.svg' },
    { name: 'Facebook', logo: 'facebook.svg' }
  ];
}
