import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RiderService } from '../../services/rider.service';
import { SaefMembership, MembershipType, Year, Subscription, MembershipApplication } from '../../models/rider.model';

/**
 * Memberships Component - Manage SAEF memberships
 */
@Component({
  selector: 'app-memberships',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './memberships.component.html',
  styleUrls: ['./memberships.component.scss']
})
export class MembershipsComponent implements OnInit {
  // Current membership data
  currentMemberships: SaefMembership[] = [];
  currentYear = new Date().getFullYear();
  loading = false;

  // Wizard state
  showWizard = false;
  currentStep: 'type' | 'subscription' | 'review' = 'type';
  
  // Available options
  membershipTypes: MembershipType[] = [];
  years: Year[] = [];
  subscriptions: Subscription[] = [];
  
  // Selected values
  selectedMembershipType: MembershipType | null = null;
  selectedYear: Year | null = null;
  selectedSubscription: Subscription | null = null;
  
  // Form
  reviewForm: FormGroup;
  
  // UI state
  loadingTypes = false;
  loadingSubscriptions = false;
  submitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private riderService: RiderService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      acceptTerms: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
    this.loadCurrentMemberships();
  }

  loadCurrentMemberships(): void {
    this.loading = true;
    this.riderService.getSaefMemberships(undefined, this.currentYear.toString()).subscribe({
      next: (memberships) => {
        this.currentMemberships = memberships;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading memberships:', error);
        this.loading = false;
      }
    });
  }

  get hasActiveMembership(): boolean {
    return this.currentMemberships.some(m => m.status === 'Active');
  }

  get activeMembership(): SaefMembership | undefined {
    return this.currentMemberships.find(m => m.status === 'Active');
  }

  // Start renewal wizard
  startRenewal(): void {
    this.showWizard = true;
    this.currentStep = 'type';
    this.loadMembershipTypes();
    this.loadYears();
  }

  loadMembershipTypes(): void {
    this.loadingTypes = true;
    this.riderService.getMembershipTypes().subscribe({
      next: (types) => {
        this.membershipTypes = types.filter(t => t.isActive);
        this.loadingTypes = false;
      },
      error: (error) => {
        console.error('Error loading membership types:', error);
        this.loadingTypes = false;
      }
    });
  }

  loadYears(): void {
    this.riderService.getYears().subscribe({
      next: (years) => {
        this.years = years;
        // Auto-select current year
        this.selectedYear = years.find(y => y.title === this.currentYear.toString()) || years[0];
      },
      error: (error) => {
        console.error('Error loading years:', error);
      }
    });
  }

  selectMembershipType(type: MembershipType): void {
    this.selectedMembershipType = type;
  }

  nextToSubscription(): void {
    if (!this.selectedMembershipType || !this.selectedYear) {
      this.errorMessage = 'Please select a membership type';
      return;
    }
    
    this.currentStep = 'subscription';
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    if (!this.selectedYear) return;
    
    this.loadingSubscriptions = true;
    this.riderService.getSubscriptions(this.selectedYear.id).subscribe({
      next: (subscriptions) => {
        // Filter subscriptions that include the selected membership type
        this.subscriptions = subscriptions.filter(sub => 
          sub.membershipIds.includes(this.selectedMembershipType!.id)
        );
        this.loadingSubscriptions = false;
      },
      error: (error) => {
        console.error('Error loading subscriptions:', error);
        this.loadingSubscriptions = false;
      }
    });
  }

  selectSubscription(subscription: Subscription): void {
    this.selectedSubscription = subscription;
  }

  nextToReview(): void {
    if (!this.selectedSubscription) {
      this.errorMessage = 'Please select a subscription type';
      return;
    }
    
    this.currentStep = 'review';
  }

  backToType(): void {
    this.currentStep = 'type';
    this.errorMessage = '';
  }

  backToSubscription(): void {
    this.currentStep = 'subscription';
    this.errorMessage = '';
  }

  submitApplication(): void {
    if (this.reviewForm.invalid) {
      this.errorMessage = 'Please accept the terms and conditions';
      return;
    }

    if (!this.selectedMembershipType || !this.selectedYear || !this.selectedSubscription) {
      this.errorMessage = 'Missing required information';
      return;
    }

    const application: MembershipApplication = {
      membershipTypeId: this.selectedMembershipType.id,
      subscriptionId: this.selectedSubscription.id,
      yearId: this.selectedYear.id,
      acceptTerms: this.reviewForm.value.acceptTerms
    };

    this.submitting = true;
    this.errorMessage = '';

    this.riderService.submitMembershipApplication(application).subscribe({
      next: (membership) => {
        this.submitting = false;
        this.successMessage = 'Membership application submitted successfully! Your application is pending approval.';
        this.showWizard = false;
        this.loadCurrentMemberships();

        // Clear success message after 5 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        console.error('Error submitting application:', error);
        this.errorMessage = 'Failed to submit application. Please try again.';
        this.submitting = false;
      }
    });
  }

  cancelWizard(): void {
    if (confirm('Are you sure you want to cancel? Your progress will be lost.')) {
      this.showWizard = false;
      this.currentStep = 'type';
      this.selectedMembershipType = null;
      this.selectedYear = null;
      this.selectedSubscription = null;
      this.reviewForm.reset();
      this.errorMessage = '';
    }
  }

  clearSuccessMessage(): void {
    this.successMessage = '';
  }

  clearErrorMessage(): void {
    this.errorMessage = '';
  }
}

