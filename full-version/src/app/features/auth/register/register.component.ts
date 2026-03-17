import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Register Component - Multi-step user registration wizard
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  // Form groups for each step
  step1Form!: FormGroup; // Personal Information
  step2Form!: FormGroup; // Contact & Address
  step3Form!: FormGroup; // Account Credentials

  currentStep = 1;
  totalSteps = 4;
  loading = false;
  errorMessage = '';
  registeredEmail = '';

  // Dropdown options
  titles = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'];
  genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
  provinces = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'Northern Cape',
    'North West',
    'Western Cape'
  ];
  countries = [
    'South Africa',
    'Botswana',
    'Lesotho',
    'Namibia',
    'Swaziland',
    'Zimbabwe',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  initializeForms(): void {
    // Step 1: Personal Information
    this.step1Form = this.fb.group({
      title: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      maidenName: [''],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', [Validators.required, this.ageValidator(18)]],
      gender: ['', [Validators.required]],
      nationality: ['South Africa', [Validators.required]]
    });

    // Step 2: Contact & Address Information
    this.step2Form = this.fb.group({
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      town: ['', [Validators.required]],
      suburb: [''],
      country: ['South Africa', [Validators.required]],
      city: ['', [Validators.required]],
      province: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^(\+27|0)[6-8][0-9]{8}$/)]],
      marketingEmails: [false]
    });

    // Step 3: Account Credentials
    this.step3Form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: [this.emailMatchValidator, this.passwordMatchValidator]
    });
  }

  // Custom validator: Age must be 18+
  ageValidator(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const birthDate = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age - 1 } };
      }

      return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
    };
  }

  // Custom validator: Password strength
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    if (!valid) {
      return {
        passwordStrength: {
          hasUpperCase,
          hasLowerCase,
          hasNumber,
          hasSpecialChar
        }
      };
    }

    return null;
  }

  // Custom validator: Email match
  emailMatchValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.get('email');
    const confirmEmail = control.get('confirmEmail');

    if (!email || !confirmEmail) {
      return null;
    }

    return email.value === confirmEmail.value ? null : { emailMismatch: true };
  }

  // Custom validator: Password match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  // Navigation methods
  nextStep(): void {
    const currentForm = this.getCurrentForm();

    if (currentForm.invalid) {
      Object.keys(currentForm.controls).forEach(key => {
        currentForm.controls[key].markAsTouched();
      });
      return;
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.errorMessage = '';
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage = '';
    }
  }

  goToStep(step: number): void {
    // Only allow going to completed steps
    if (step < this.currentStep) {
      this.currentStep = step;
      this.errorMessage = '';
    }
  }

  getCurrentForm(): FormGroup {
    switch (this.currentStep) {
      case 1:
        return this.step1Form;
      case 2:
        return this.step2Form;
      case 3:
        return this.step3Form;
      default:
        return this.step1Form;
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return this.step1Form.valid;
      case 2:
        return this.step2Form.valid;
      case 3:
        return this.step3Form.valid;
      default:
        return false;
    }
  }

  isStepCompleted(step: number): boolean {
    return step < this.currentStep;
  }

  onSubmit(): void {
    // Reset error message
    this.errorMessage = '';

    // Validate step 3 form
    if (this.step3Form.invalid) {
      Object.keys(this.step3Form.controls).forEach(key => {
        this.step3Form.controls[key].markAsTouched();
      });
      return;
    }

    // Set loading state
    this.loading = true;

    // Combine all form data
    const registrationData = {
      ...this.step1Form.value,
      ...this.step2Form.value,
      ...this.step3Form.value
    };

    this.authService.register(registrationData).subscribe({
      next: (response) => {
        // Success - move to step 4 (completion)
        this.registeredEmail = registrationData.email;
        this.currentStep = 4;
        this.loading = false;
      },
      error: (error) => {
        // Error - display message
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }

  resendConfirmationEmail(): void {
    // TODO: Implement resend confirmation email
    console.log('Resend confirmation email to:', this.registeredEmail);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Helper method to check if field has error
  hasError(formGroup: FormGroup, fieldName: string, errorType: string): boolean {
    const field = formGroup.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  // Check if emails match error
  hasEmailMismatch(): boolean {
    return !!(
      this.step3Form.hasError('emailMismatch') &&
      this.step3Form.get('confirmEmail')?.touched
    );
  }

  // Check if passwords match error
  hasPasswordMismatch(): boolean {
    return !!(
      this.step3Form.hasError('passwordMismatch') &&
      this.step3Form.get('confirmPassword')?.touched
    );
  }

  // Get password strength errors
  getPasswordStrengthErrors(): any {
    const passwordControl = this.step3Form.get('password');
    if (passwordControl?.hasError('passwordStrength')) {
      return passwordControl.errors?.['passwordStrength'];
    }
    return null;
  }
}

