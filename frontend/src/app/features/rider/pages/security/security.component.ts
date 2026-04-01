import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Security Component - Password change and security settings
 */
@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent {
  passwordForm: FormGroup;
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  submitting = false;
  successMessage = '';
  errorMessage = '';

  // Password requirements
  passwordRequirements = [
    { text: 'At least 8 characters', met: false },
    { text: 'At least 1 lowercase letter (a-z)', met: false },
    { text: 'At least 1 uppercase letter (A-Z)', met: false },
    { text: 'At least 1 number (0-9)', met: false },
    { text: 'At least 1 special character', met: false }
  ];

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });

    // Watch new password changes to update requirements
    this.passwordForm.get('newPassword')?.valueChanges.subscribe(value => {
      this.checkPasswordRequirements(value);
    });
  }

  checkPasswordRequirements(password: string): void {
    this.passwordRequirements[0].met = password.length >= 8;
    this.passwordRequirements[1].met = /[a-z]/.test(password);
    this.passwordRequirements[2].met = /[A-Z]/.test(password);
    this.passwordRequirements[3].met = /[0-9]/.test(password);
    this.passwordRequirements[4].met = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  get allRequirementsMet(): boolean {
    return this.passwordRequirements.every(req => req.met);
  }

  get passwordsMatch(): boolean {
    const newPassword = this.passwordForm.get('newPassword')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
    return newPassword === confirmPassword && confirmPassword !== '';
  }

  get requirementsMet(): number {
    return this.passwordRequirements.filter(req => req.met).length;
  }

  get passwordStrengthPercentage(): number {
    return (this.requirementsMet / 5) * 100;
  }

  togglePasswordVisibility(field: 'old' | 'new' | 'confirm'): void {
    if (field === 'old') {
      this.showOldPassword = !this.showOldPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (!this.allRequirementsMet) {
      this.errorMessage = 'Password does not meet all requirements';
      return;
    }

    if (!this.passwordsMatch) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // TODO: Call API to change password
    // Simulate API call
    setTimeout(() => {
      this.submitting = false;
      this.successMessage = 'Password changed successfully!';
      this.passwordForm.reset();
      this.passwordRequirements.forEach(req => req.met = false);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    }, 1000);
  }

  onCancel(): void {
    this.passwordForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.passwordRequirements.forEach(req => req.met = false);
  }

  clearSuccessMessage(): void {
    this.successMessage = '';
  }

  clearErrorMessage(): void {
    this.errorMessage = '';
  }
}

