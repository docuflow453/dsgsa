import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Reset Password Component - Set new password with token
 */
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  token = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get token from query params
    this.token = this.route.snapshot.queryParams['token'] || '';

    if (!this.token) {
      this.errorMessage = 'Invalid or missing reset token. Please request a new password reset.';
    }

    // Initialize reset password form
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  // Convenience getter for form controls
  get f() {
    return this.resetPasswordForm.controls;
  }

  onSubmit(): void {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';

    // Check token
    if (!this.token) {
      this.errorMessage = 'Invalid or missing reset token.';
      return;
    }

    // Validate form
    if (this.resetPasswordForm.invalid) {
      Object.keys(this.resetPasswordForm.controls).forEach(key => {
        this.resetPasswordForm.controls[key].markAsTouched();
      });
      return;
    }

    // Set loading state
    this.loading = true;

    // Call auth service
    const { password, confirmPassword } = this.resetPasswordForm.value;

    this.authService.resetPassword({ token: this.token, password, confirmPassword }).subscribe({
      next: (response) => {
        // Success - show message and redirect
        this.successMessage = 'Password reset successful! Redirecting to login...';
        this.resetPasswordForm.reset();
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        // Error - display message
        this.errorMessage = error.message || 'Failed to reset password. Please try again.';
        this.loading = false;
      }
    });
  }

  // Helper method to check if field has error
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.resetPasswordForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  // Check if passwords match error
  hasPasswordMismatch(): boolean {
    return !!(
      this.resetPasswordForm.hasError('passwordMismatch') &&
      this.resetPasswordForm.get('confirmPassword')?.touched
    );
  }
}

