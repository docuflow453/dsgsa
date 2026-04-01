import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CompetitionService } from '../../../services/competition.service';
import { EntryWizardService } from '../../../services/entry-wizard.service';
import { CompetitionExtra, EntryWizardState } from '../../../models/rider.model';

@Component({
  selector: 'app-entry-extras',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="entry-extras-page">
      <div class="page-header mb-4">
        <div class="d-flex align-items-center mb-3">
          <button class="btn btn-link text-decoration-none p-0 me-3" (click)="goBack()">
            <i class="ti ti-arrow-left"></i>
          </button>
          <div>
            <h2 class="mb-1">Competition Extras</h2>
            <p class="text-muted mb-0">Step 2 of 3: Select optional extras</p>
          </div>
        </div>
      </div>

      <!-- Competition Summary -->
      <div class="card mb-4" *ngIf="wizardState">
        <div class="card-body">
          <h5 class="mb-3"><i class="ti ti-trophy me-2"></i>{{ wizardState.competition?.name }}</h5>
          <div class="row">
            <div class="col-md-4">
              <small class="text-muted">Rider</small>
              <p class="mb-0">{{ wizardState.riderName }}</p>
            </div>
            <div class="col-md-4">
              <small class="text-muted">Horse</small>
              <p class="mb-0">{{ wizardState.horseName }}</p>
            </div>
            <div class="col-md-4">
              <small class="text-muted">Classes Selected</small>
              <p class="mb-0">{{ wizardState.selectedClasses.length }} class(es)</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Extras Selection -->
      <div class="card mb-4">
        <div class="card-header">
          <h5><i class="ti ti-shopping-cart me-2"></i>Available Extras</h5>
        </div>
        <div class="card-body">
          <div *ngIf="loadingExtras" class="text-center py-3">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div *ngIf="!loadingExtras && extras.length === 0" class="text-muted text-center py-3">
            No extras available for this competition
          </div>

          <div *ngIf="!loadingExtras && extras.length > 0">
            <div *ngFor="let extra of extras" class="extra-item mb-3">
              <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                  <h6 class="mb-1">{{ extra.name }}</h6>
                  <p class="text-muted small mb-2" *ngIf="extra.description">{{ extra.description }}</p>
                  <div class="d-flex align-items-center gap-3">
                    <span class="badge bg-primary">R{{ extra.price }}</span>
                    <span class="text-muted small" *ngIf="extra.quantity">
                      {{ extra.quantity }} available
                    </span>
                  </div>
                </div>
                <div class="quantity-selector d-flex align-items-center">
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    (click)="decrementQuantity(extra)"
                    [disabled]="getQuantity(extra) === 0">
                    <i class="ti ti-minus"></i>
                  </button>
                  <input
                    type="number"
                    class="form-control form-control-sm text-center mx-2"
                    [value]="getQuantity(extra)"
                    (change)="setQuantity(extra, $event)"
                    min="0"
                    [max]="extra.quantity || 999"
                    style="width: 60px;">
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    (click)="incrementQuantity(extra)"
                    [disabled]="extra.quantity && getQuantity(extra) >= extra.quantity">
                    <i class="ti ti-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="card mb-4">
        <div class="card-header">
          <h5><i class="ti ti-receipt me-2"></i>Order Summary</h5>
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-between mb-2">
            <span>Classes ({{ wizardState?.selectedClasses.length }})</span>
            <span>R{{ classesTotal }}</span>
          </div>
          <div class="d-flex justify-content-between mb-2" *ngIf="extrasTotal > 0">
            <span>Extras</span>
            <span>R{{ extrasTotal }}</span>
          </div>
          <hr>
          <div class="d-flex justify-content-between">
            <strong>Total</strong>
            <strong class="text-primary">R{{ totalAmount }}</strong>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="card">
        <div class="card-body">
          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary" (click)="goBack()">
              <i class="ti ti-arrow-left me-2"></i>Back
            </button>
            <button 
              class="btn btn-primary flex-grow-1" 
              (click)="continue()">
              Continue to Checkout
              <i class="ti ti-arrow-right ms-2"></i>
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
    .extra-item { 
      padding: 1rem; 
      border: 1px solid #e5e7eb; 
      border-radius: 8px; 
    }
  `]
})
export class EntryExtrasComponent implements OnInit {
  wizardState?: EntryWizardState;
  extras: CompetitionExtra[] = [];
  loadingExtras = false;
  selectedExtras: Map<string, number> = new Map();
  classesTotal = 0;
  extrasTotal = 0;
  totalAmount = 0;

  constructor(
    private competitionService: CompetitionService,
    private wizardService: EntryWizardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.wizardState = this.wizardService.getState();

    if (!this.wizardService.canProceedToExtras()) {
      this.router.navigate(['/my/entries/competitions']);
      return;
    }

    this.calculateClassesTotal();
    this.loadExtras();
  }

  loadExtras(): void {
    if (!this.wizardState?.competition?.id) return;

    this.loadingExtras = true;
    this.competitionService.getCompetitionExtras(this.wizardState.competition.id).subscribe({
      next: (extras) => {
        this.extras = extras;
        this.loadingExtras = false;
      },
      error: (error) => {
        console.error('Error loading extras:', error);
        this.loadingExtras = false;
      }
    });
  }

  calculateClassesTotal(): void {
    this.classesTotal = this.wizardState?.selectedClasses.reduce((sum, cls) => sum + cls.fee, 0) || 0;
    this.calculateTotal();
  }

  getQuantity(extra: CompetitionExtra): number {
    return this.selectedExtras.get(extra.id) || 0;
  }

  setQuantity(extra: CompetitionExtra, event: any): void {
    const value = parseInt(event.target.value) || 0;
    const maxQuantity = extra.quantity || 999;
    const quantity = Math.max(0, Math.min(value, maxQuantity));

    if (quantity > 0) {
      this.selectedExtras.set(extra.id, quantity);
    } else {
      this.selectedExtras.delete(extra.id);
    }

    this.updateWizardExtras();
    this.calculateTotal();
  }

  incrementQuantity(extra: CompetitionExtra): void {
    const current = this.getQuantity(extra);
    const maxQuantity = extra.quantity || 999;

    if (current < maxQuantity) {
      this.selectedExtras.set(extra.id, current + 1);
      this.updateWizardExtras();
      this.calculateTotal();
    }
  }

  decrementQuantity(extra: CompetitionExtra): void {
    const current = this.getQuantity(extra);

    if (current > 0) {
      if (current === 1) {
        this.selectedExtras.delete(extra.id);
      } else {
        this.selectedExtras.set(extra.id, current - 1);
      }
      this.updateWizardExtras();
      this.calculateTotal();
    }
  }

  updateWizardExtras(): void {
    const extrasArray = Array.from(this.selectedExtras.entries()).map(([extraId, quantity]) => {
      const extra = this.extras.find(e => e.id === extraId);
      return { extra: extra!, quantity };
    }).filter(item => item.extra);

    this.wizardService.setSelectedExtras(extrasArray);
  }

  calculateTotal(): void {
    this.extrasTotal = Array.from(this.selectedExtras.entries()).reduce((sum, [extraId, quantity]) => {
      const extra = this.extras.find(e => e.id === extraId);
      return sum + (extra ? extra.price * quantity : 0);
    }, 0);

    this.totalAmount = this.classesTotal + this.extrasTotal;
  }

  continue(): void {
    this.router.navigate(['/my/entries/entry-checkout']);
  }

  goBack(): void {
    this.router.navigate(['/my/entries/entry-details', this.wizardState?.competition?.slug]);
  }
}

