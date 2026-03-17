import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShowHoldingBodyService } from '../../services/show-holding-body.service';
import { ShowHoldingBody } from '../../models/show-holding-body.model';

@Component({
  selector: 'app-shb-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  activeTab = 1;
  profile: ShowHoldingBody | null = null;
  editedProfile: Partial<ShowHoldingBody> = {};
  loading = true;
  saving = false;
  successMessage = '';
  errorMessage = '';

  // Timezone options
  timezones = [
    { value: 'Africa/Johannesburg', label: 'South Africa (SAST)' },
    { value: 'Africa/Cairo', label: 'Egypt (EET)' },
    { value: 'Africa/Lagos', label: 'Nigeria (WAT)' },
    { value: 'Africa/Nairobi', label: 'Kenya (EAT)' }
  ];

  // Account type options
  accountTypes = [
    'Business Cheque Account',
    'Business Savings Account',
    'Current Account',
    'Savings Account'
  ];

  constructor(private shbService: ShowHoldingBodyService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.shbService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.editedProfile = { ...profile };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.errorMessage = 'Failed to load profile. Please try again.';
        this.loading = false;
      }
    });
  }

  setActiveTab(tab: number): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  saveProfile(): void {
    this.saving = true;
    this.clearMessages();

    this.shbService.updateProfile(this.editedProfile).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.editedProfile = { ...updatedProfile };
        this.successMessage = 'Profile updated successfully!';
        this.saving = false;
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage = 'Failed to update profile. Please try again.';
        this.saving = false;
      }
    });
  }

  cancelEdit(): void {
    if (this.profile) {
      this.editedProfile = { ...this.profile };
    }
    this.clearMessages();
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  hasChanges(): boolean {
    if (!this.profile) return false;
    return JSON.stringify(this.editedProfile) !== JSON.stringify(this.profile);
  }

  updateNotificationPreference(key: string, value: boolean): void {
    if (this.editedProfile.notificationPreferences) {
      this.editedProfile.notificationPreferences = {
        ...this.editedProfile.notificationPreferences,
        [key]: value
      };
    }
  }
}

