import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Two-Factor Authentication Component - Verify 6-digit code
 */
@Component({
  selector: 'app-two-factor-auth',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './two-factor-auth.component.html',
  styleUrls: ['./two-factor-auth.component.scss']
})
export class TwoFactorAuthComponent implements OnInit {
  twoFactorForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize 2FA form
    this.twoFactorForm = this.fb.group({
      code: ['', [
        Validators.required,
        Validators.pattern(/^\d{6}$/),
        Validators.minLength(6),
        Validators.maxLength(6)
      ]]
    });
  }

  // Convenience getter for form controls
  get f() {
    return this.twoFactorForm.controls;
  }

  onSubmit(): void {
    // Reset error message
    this.errorMessage = '';

    // Validate form
    if (this.twoFactorForm.invalid) {
      Object.keys(this.twoFactorForm.controls).forEach(key => {
        this.twoFactorForm.controls[key].markAsTouched();
      });
      return;
    }

    // Set loading state
    this.loading = true;

    // Call auth service
    const { code } = this.twoFactorForm.value;
    
    this.authService.verifyTwoFactor(code).subscribe({
      next: (response: any) => {
        // Success - redirect to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        // Error - display message
        this.errorMessage = error.message || 'Invalid verification code. Please try again.';
        this.loading = false;
        this.twoFactorForm.patchValue({ code: '' });
      }
    });
  }

  // Helper method to check if field has error
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.twoFactorForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  // Auto-format code input (digits only)
  onCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, 6);
    this.twoFactorForm.patchValue({ code: value });
  }

  // Resend code
  resendCode(): void {
    // TODO: Implement resend code functionality
    console.log('Resend code requested');
  }
}

