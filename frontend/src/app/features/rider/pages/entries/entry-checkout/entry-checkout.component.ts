import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CompetitionService } from '../../../services/competition.service';
import { EntryWizardService } from '../../../services/entry-wizard.service';
import { EntryWizardState, CreateEntryRequest } from '../../../models/rider.model';

@Component({
  selector: 'app-entry-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="entry-checkout-page">
      <div class="page-header mb-4">
        <div class="d-flex align-items-center mb-3">
          <button class="btn btn-link text-decoration-none p-0 me-3" (click)="goBack()">
            <i class="ti ti-arrow-left"></i>
          </button>
          <div>
            <h2 class="mb-1">Checkout</h2>
            <p class="text-muted mb-0">Step 3 of 3: Review and complete your entry</p>
          </div>
        </div>
      </div>

      <!-- Competition Details -->
      <div class="card mb-4" *ngIf="wizardState?.competition">
        <div class="card-header">
          <h5><i class="ti ti-trophy me-2"></i>Competition Details</h5>
        </div>
        <div class="card-body">
          <h6 class="mb-3">{{ wizardState.competition.name }}</h6>
          <div class="row">
            <div class="col-md-4">
              <small class="text-muted">Date</small>
              <p class="mb-0">{{ formatDate(wizardState.competition.startDate) }} - {{ formatDate(wizardState.competition.endDate) }}</p>
            </div>
            <div class="col-md-4">
              <small class="text-muted">Venue</small>
              <p class="mb-0">{{ wizardState.competition.venue }}, {{ wizardState.competition.city }}</p>
            </div>
            <div class="col-md-4">
              <small class="text-muted">Closing Date</small>
              <p class="mb-0">{{ formatDate(wizardState.competition.closingDate) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Rider and Horse Information -->
      <div class="card mb-4">
        <div class="card-header">
          <h5><i class="ti ti-user me-2"></i>Entry Information</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <small class="text-muted">Rider</small>
              <p class="mb-0">{{ wizardState?.riderName }}</p>
            </div>
            <div class="col-md-6">
              <small class="text-muted">Horse</small>
              <p class="mb-0">{{ wizardState?.horseName }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Classes -->
      <div class="card mb-4">
        <div class="card-header">
          <h5><i class="ti ti-list me-2"></i>Selected Classes</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Grade</th>
                  <th>Time</th>
                  <th class="text-end">Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let class of wizardState?.selectedClasses">
                  <td>{{ class.name }}</td>
                  <td>{{ class.grade || '-' }}</td>
                  <td>{{ class.approximateStartTime || '-' }}</td>
                  <td class="text-end">R{{ class.fee }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="text-end"><strong>Subtotal</strong></td>
                  <td class="text-end"><strong>R{{ classesTotal }}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Selected Extras -->
      <div class="card mb-4" *ngIf="wizardState?.selectedExtras && wizardState?.selectedExtras.length > 0">
        <div class="card-header">
          <h5><i class="ti ti-shopping-cart me-2"></i>Selected Extras</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Item</th>
                  <th class="text-center">Quantity</th>
                  <th class="text-end">Unit Price</th>
                  <th class="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of wizardState?.selectedExtras">
                  <td>{{ item.extra.name }}</td>
                  <td class="text-center">{{ item.quantity }}</td>
                  <td class="text-end">R{{ item.extra.price }}</td>
                  <td class="text-end">R{{ item.extra.price * item.quantity }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="text-end"><strong>Subtotal</strong></td>
                  <td class="text-end"><strong>R{{ extrasTotal }}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Order Total -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Total Amount</h4>
            <h3 class="mb-0 text-primary">R{{ wizardState?.totalAmount || 0 }}</h3>
          </div>
          <hr>
          <p class="text-muted small mb-0">
            <i class="ti ti-info-circle me-2"></i>
            Payment status will be set to 'pending'. You will receive payment instructions via email.
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="card">
        <div class="card-body">
          <div *ngIf="errorMessage" class="alert alert-danger mb-3">
            <i class="ti ti-alert-circle me-2"></i>{{ errorMessage }}
          </div>
          
          <div *ngIf="successMessage" class="alert alert-success mb-3">
            <i class="ti ti-check me-2"></i>{{ successMessage }}
          </div>

          <div class="d-flex gap-2">
            <button 
              class="btn btn-outline-secondary" 
              (click)="goBack()"
              [disabled]="submitting">
              <i class="ti ti-arrow-left me-2"></i>Back
            </button>
            <button 
              class="btn btn-primary flex-grow-1" 
              (click)="completeEntry()"
              [disabled]="submitting">
              <span *ngIf="!submitting">
                <i class="ti ti-check me-2"></i>Complete Entry
              </span>
              <span *ngIf="submitting">
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Submitting...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card { border: none; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
    .card-header { background: white; border-bottom: 1px solid #e5e7eb; padding: 1.25rem 1.5rem; }
    .card-header h5 { font-size: 1.125rem; font-weight: 600; color: #1f2937; margin: 0; }
    .btn-link { color: #6b7280; font-size: 1.5rem; }
    .btn-link:hover { color: #1f2937; }
    .table { margin-bottom: 0; }
    .table thead th { border-bottom: 2px solid #e5e7eb; font-weight: 600; }
    .table tfoot td { border-top: 2px solid #e5e7eb; padding-top: 1rem; }
  `]
})
export class EntryCheckoutComponent implements OnInit {
  wizardState?: EntryWizardState;
  classesTotal = 0;
  extrasTotal = 0;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private competitionService: CompetitionService,
    private wizardService: EntryWizardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.wizardState = this.wizardService.getState();

    if (!this.wizardService.canProceedToCheckout()) {
      this.router.navigate(['/my/entries/competitions']);
      return;
    }

    this.calculateTotals();
  }

  calculateTotals(): void {
    this.classesTotal = this.wizardState?.selectedClasses.reduce((sum, cls) => sum + cls.fee, 0) || 0;
    this.extrasTotal = this.wizardState?.selectedExtras.reduce((sum, item) => sum + (item.extra.price * item.quantity), 0) || 0;
  }

  completeEntry(): void {
    if (!this.wizardState?.competition || !this.wizardState.riderId || !this.wizardState.horseId) {
      this.errorMessage = 'Missing required information. Please go back and complete all steps.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: CreateEntryRequest = {
      competitionId: this.wizardState.competition.id,
      riderId: this.wizardState.riderId,
      horseId: this.wizardState.horseId,
      classes: this.wizardState.selectedClasses.map(c => c.id),
      extras: this.wizardState.selectedExtras.map(item => ({
        extraId: item.extra.id,
        quantity: item.quantity
      }))
    };

    this.competitionService.createEntry(request).subscribe({
      next: (entry) => {
        this.successMessage = 'Entry submitted successfully!';
        this.submitting = false;

        // Reset wizard state
        this.wizardService.reset();

        // Navigate to entries list after a short delay
        setTimeout(() => {
          this.router.navigate(['/my/entries']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating entry:', error);
        this.errorMessage = error.error?.message || 'Failed to submit entry. Please try again.';
        this.submitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/my/entries/entry-extras']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}

