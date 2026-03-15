import { Component, signal, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { form, Field } from '@angular/forms/signals';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { DASHBOARD_PATH } from 'src/app/app-config';

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
    { name: 'User', email: 'user@gmail.com', password: 'User@123', role: 'User' }
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
      if (this.authenticationService.currentUserValue) {
        this.router.navigate([DASHBOARD_PATH]);
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

  onSubmit() {
    this.submitted = true;

    if (!this.isFormValid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const { email, password } = this.loginForm().value();

    this.authenticationService.login(email, password).subscribe({
      next: () => {
        this.router.navigate([DASHBOARD_PATH]);
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
