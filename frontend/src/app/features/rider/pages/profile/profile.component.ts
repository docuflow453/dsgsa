import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RiderService } from '../../services/rider.service';
import { Rider } from '../../models/rider.model';

/**
 * Profile Component - Enhanced rider profile management with tabbed interface
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgbNavModule, NgbTooltipModule, NgbModalModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  riderProfile: Rider | null = null;

  // Form groups for each tab
  personalInfoForm!: FormGroup;
  addressForm!: FormGroup;
  contactForm!: FormGroup;
  notificationForm!: FormGroup;

  // UI state
  activeTab = 1;
  loading = true;
  saving = false;
  successMessage = '';
  errorMessage = '';

  // Profile picture
  profilePictureUrl: string | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  // Dropdown options
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

  genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

  ethnicities = [
    'African',
    'Coloured',
    'Indian/Asian',
    'White',
    'Other',
    'Prefer not to say'
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
    private riderService: RiderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadProfile();
  }

  initializeForms(): void {
    // Personal Information Form
    this.personalInfoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      idNumber: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      ethnicity: [''],
      saefNumber: [''],
      passportNumber: [''],
      passportExpiry: [''],
      nationality: ['South Africa', [Validators.required]]
    });

    // Address Form
    this.addressForm = this.fb.group({
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      suburb: [''],
      city: ['', [Validators.required]],
      province: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      country: ['South Africa', [Validators.required]]
    });

    // Contact Information Form
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^(\+27|0)[6-8][0-9]{8}$/)]],
      alternativePhone: [''],
      emergencyContactName: ['', [Validators.required]],
      emergencyContactNumber: ['', [Validators.required, Validators.pattern(/^(\+27|0)[6-8][0-9]{8}$/)]]
    });

    // Notification Preferences Form
    this.notificationForm = this.fb.group({
      emailUpcomingEntries: [true],
      smsResults: [true],
      monthlyNewsletter: [false],
      marketingCommunications: [false],
      emailResults: [true],
      smsUpcomingEvents: [false]
    });
  }

  loadProfile(): void {
    this.loading = true;
    this.riderService.getProfile().subscribe({
      next: (profile) => {
        this.riderProfile = profile;
        this.populateForms(profile);
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.loading = false;
        }, 0);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load profile';
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.loading = false;
        }, 0);
      }
    });
  }

  populateForms(profile: any): void {
    // Note: Backend returns snake_case, but we'll map to our form's camelCase

    // Personal Information
    this.personalInfoForm.patchValue({
      firstName: profile.full_name?.split(' ')[0] || '',
      lastName: profile.full_name?.split(' ').slice(1).join(' ') || '',
      idNumber: profile.id_number || '',
      dateOfBirth: profile.date_of_birth ? this.formatDate(new Date(profile.date_of_birth)) : '',
      gender: profile.gender || '',
      ethnicity: profile.ethnicity || '',
      saefNumber: profile.saef_number || '',
      passportNumber: profile.passport_number || '',
      passportExpiry: '',
      nationality: profile.nationality || 'South Africa'
    });

    // Address
    this.addressForm.patchValue({
      addressLine1: profile.address_line_1 || '',
      addressLine2: profile.address_line_2 || '',
      suburb: profile.suburb || '',
      city: profile.city || '',
      province: profile.province || '',
      postalCode: profile.postal_code || '',
      country: profile.country || 'South Africa'
    });

    // Contact Information (from user object - will need to fetch separately if available)
    this.contactForm.patchValue({
      email: '', // Not in rider schema, comes from user
      mobileNumber: '',
      alternativePhone: '',
      emergencyContactName: '',
      emergencyContactNumber: ''
    });

    // Notification Preferences (not in current backend schema)
    this.notificationForm.patchValue({
      emailUpcomingEntries: true,
      smsResults: true,
      monthlyNewsletter: false,
      marketingCommunications: false,
      emailResults: true,
      smsUpcomingEvents: false
    });

    // Set profile picture
    const firstName = profile.full_name?.split(' ')[0] || 'User';
    const lastName = profile.full_name?.split(' ').slice(1).join(' ') || '';
    this.profilePictureUrl = 'https://ui-avatars.com/api/?name=' + firstName + '+' + lastName;
  }

  // Submit handlers for each tab
  onSubmitPersonalInfo(): void {
    if (this.personalInfoForm.invalid) {
      this.markFormGroupTouched(this.personalInfoForm);
      return;
    }

    // Map form data to backend snake_case format
    const formData = this.personalInfoForm.value;
    const backendData = {
      id_number: formData.idNumber,
      passport_number: formData.passportNumber,
      date_of_birth: formData.dateOfBirth,
      gender: formData.gender,
      ethnicity: formData.ethnicity,
      nationality: formData.nationality,
      saef_number: formData.saefNumber
    };

    this.saveFormData('Personal information', backendData);
  }

  onSubmitAddress(): void {
    if (this.addressForm.invalid) {
      this.markFormGroupTouched(this.addressForm);
      return;
    }

    // Map form data to backend snake_case format
    const formData = this.addressForm.value;
    const backendData = {
      address_line_1: formData.addressLine1,
      address_line_2: formData.addressLine2,
      suburb: formData.suburb,
      city: formData.city,
      province: formData.province,
      postal_code: formData.postalCode,
      country: formData.country
    };

    this.saveFormData('Address details', backendData);
  }

  onSubmitContact(): void {
    if (this.contactForm.invalid) {
      this.markFormGroupTouched(this.contactForm);
      return;
    }

    // Contact info will be saved when backend supports it
    this.successMessage = 'Contact information saved (pending backend implementation)';
    setTimeout(() => this.successMessage = '', 5000);
  }

  onSubmitNotifications(): void {
    if (this.notificationForm.invalid) {
      this.markFormGroupTouched(this.notificationForm);
      return;
    }

    // Notification preferences will be saved when backend supports it
    this.successMessage = 'Notification preferences saved (pending backend implementation)';
    setTimeout(() => this.successMessage = '', 5000);
  }

  private saveFormData(section: string, data: any): void {
    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.riderService.updateProfile(data).subscribe({
      next: () => {
        this.successMessage = `${section} updated successfully!`;
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.saving = false;
        }, 0);
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (error) => {
        this.errorMessage = `Failed to update ${section}. Please try again.`;
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.saving = false;
        }, 0);
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  hasError(formGroup: FormGroup, fieldName: string, errorType: string): boolean {
    const field = formGroup.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  // Profile Picture Methods
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.validateAndPreviewFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateAndPreviewFile(files[0]);
    }
  }

  private validateAndPreviewFile(file: File): void {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = 'Only JPG and PNG files are allowed.';
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      this.errorMessage = 'File size must be less than 2MB.';
      return;
    }

    this.selectedFile = file;
    this.errorMessage = '';

    // Create preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  uploadProfilePicture(): void {
    if (!this.selectedFile) {
      return;
    }

    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.riderService.uploadProfilePicture(this.selectedFile).subscribe({
      next: (response: any) => {
        this.profilePictureUrl = response.url;
        this.imagePreview = null;
        this.selectedFile = null;
        this.successMessage = 'Profile picture updated successfully!';
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.saving = false;
        }, 0);
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to upload profile picture. Please try again.';
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.saving = false;
        }, 0);
      }
    });
  }

  removeProfilePicture(): void {
    if (confirm('Are you sure you want to remove your profile picture?')) {
      this.saving = true;
      this.riderService.removeProfilePicture().subscribe({
        next: () => {
          this.profilePictureUrl = null;
          this.successMessage = 'Profile picture removed successfully!';
          // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
          setTimeout(() => {
            this.saving = false;
          }, 0);
          setTimeout(() => this.successMessage = '', 5000);
        },
        error: (error) => {
          this.errorMessage = 'Failed to remove profile picture.';
          // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
          setTimeout(() => {
            this.saving = false;
          }, 0);
        }
      });
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

