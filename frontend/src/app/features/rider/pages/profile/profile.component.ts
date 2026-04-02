import { Component, OnInit } from '@angular/core';
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
    private riderService: RiderService
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
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  populateForms(profile: Rider): void {
    // Personal Information
    this.personalInfoForm.patchValue({
      firstName: profile.firstName,
      lastName: profile.lastName,
      idNumber: profile.idNumber,
      dateOfBirth: this.formatDate(profile.dateOfBirth),
      gender: 'Male',
      ethnicity: 'African',
      saefNumber: 'SAEF-2024-001234',
      passportNumber: '',
      passportExpiry: '',
      nationality: 'South Africa'
    });

    // Address
    this.addressForm.patchValue({
      addressLine1: profile.address.street,
      addressLine2: '',
      suburb: '',
      city: profile.address.city,
      province: profile.address.province,
      postalCode: profile.address.postalCode,
      country: profile.address.country
    });

    // Contact Information
    this.contactForm.patchValue({
      email: profile.email,
      mobileNumber: profile.phone,
      alternativePhone: '',
      emergencyContactName: 'John Smith',
      emergencyContactNumber: '082 555 1234'
    });

    // Notification Preferences
    this.notificationForm.patchValue({
      emailUpcomingEntries: profile.preferences.emailUpcomingEntries,
      smsResults: profile.preferences.smsResults,
      monthlyNewsletter: profile.preferences.monthlyNewsletter,
      marketingCommunications: profile.preferences.marketingCommunications,
      emailResults: true,
      smsUpcomingEvents: false
    });

    // Set profile picture
    this.profilePictureUrl = 'https://ui-avatars.com/api/?name=' + profile.firstName + '+' + profile.lastName;
  }

  // Submit handlers for each tab
  onSubmitPersonalInfo(): void {
    if (this.personalInfoForm.invalid) {
      this.markFormGroupTouched(this.personalInfoForm);
      return;
    }
    this.saveFormData('Personal information', this.personalInfoForm.value);
  }

  onSubmitAddress(): void {
    if (this.addressForm.invalid) {
      this.markFormGroupTouched(this.addressForm);
      return;
    }
    this.saveFormData('Address details', this.addressForm.value);
  }

  onSubmitContact(): void {
    if (this.contactForm.invalid) {
      this.markFormGroupTouched(this.contactForm);
      return;
    }
    this.saveFormData('Contact information', this.contactForm.value);
  }

  onSubmitNotifications(): void {
    if (this.notificationForm.invalid) {
      this.markFormGroupTouched(this.notificationForm);
      return;
    }
    this.saveFormData('Notification preferences', this.notificationForm.value);
  }

  private saveFormData(section: string, data: any): void {
    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.riderService.updateProfile(data).subscribe({
      next: () => {
        this.successMessage = `${section} updated successfully!`;
        this.saving = false;
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (error) => {
        this.errorMessage = `Failed to update ${section}. Please try again.`;
        this.saving = false;
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
        this.saving = false;
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to upload profile picture. Please try again.';
        this.saving = false;
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
          this.saving = false;
          setTimeout(() => this.successMessage = '', 5000);
        },
        error: (error) => {
          this.errorMessage = 'Failed to remove profile picture.';
          this.saving = false;
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

