import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

/**
 * Login Component - User authentication
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  returnUrl = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get return URL from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // Initialize login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  // Convenience getter for form controls
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Get role-specific dashboard path
   * Redirects users to their appropriate dashboard based on their role
   */
  private getRoleDashboardPath(roles: UserRole[]): string {
    // Check roles in priority order (highest priority first)
    if (roles.includes(UserRole.ADMIN)) {
      return '/admin/dashboard';
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
      return '/admin/dashboard';
    }
  }

  onSubmit(): void {
    // Reset error message
    this.errorMessage = '';

    // Validate form
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.controls[key].markAsTouched();
      });
      return;
    }

    // Set loading state
    this.loading = true;

    // Call auth service
    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login({ email, password, rememberMe }).subscribe({
      next: (response) => {
        // Get the current user and redirect to their role-specific dashboard
        const user = this.authService.currentUserValue;
        if (user && user.roles && user.roles.length > 0) {
          const dashboardPath = this.getRoleDashboardPath(user.roles);
          this.router.navigate([dashboardPath]);
        } else {
          // Fallback to return URL or default dashboard
          this.router.navigate([this.returnUrl]);
        }
      },
      error: (error) => {
        // Error - display message
        this.errorMessage = error.message || 'Login failed. Please check your credentials.';
        this.loading = false;
      }
    });
  }

  // Helper method to check if field has error
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }
}

