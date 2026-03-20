import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CompetitionService } from '../../../services/competition.service';
import { EntryWizardService } from '../../../services/entry-wizard.service';
import { RiderService } from '../../../services/rider.service';
import { Competition, CompetitionClass } from '../../../models/rider.model';

@Component({
  selector: 'app-entry-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="entry-details-page">
      <div class="page-header mb-4">
        <div class="d-flex align-items-center mb-3">
          <button class="btn btn-link text-decoration-none p-0 me-3" (click)="goBack()">
            <i class="ti ti-arrow-left"></i>
          </button>
          <div>
            <h2 class="mb-1">Entry Details</h2>
            <p class="text-muted mb-0">Step 1 of 3: Select rider, horse, and classes</p>
          </div>
        </div>
      </div>

      <!-- Competition Info -->
      <div class="card mb-4" *ngIf="competition">
        <div class="card-body">
          <h5 class="mb-3"><i class="ti ti-trophy me-2"></i>{{ competition.name }}</h5>
          <div class="row">
            <div class="col-md-4">
              <small class="text-muted">Date</small>
              <p class="mb-0">{{ formatDate(competition.startDate) }} - {{ formatDate(competition.endDate) }}</p>
            </div>
            <div class="col-md-4">
              <small class="text-muted">Venue</small>
              <p class="mb-0">{{ competition.venue }}, {{ competition.city }}</p>
            </div>
            <div class="col-md-4">
              <small class="text-muted">Closing Date</small>
              <p class="mb-0">{{ formatDate(competition.closingDate) }}</p>
            </div>
          </div>
        </div>
      </div>

      <form [formGroup]="entryForm">
        <!-- Rider Selection -->
        <div class="card mb-4">
          <div class="card-header">
            <h5><i class="ti ti-user me-2"></i>Rider Selection</h5>
          </div>
          <div class="card-body">
            <div class="form-check mb-3">
              <input 
                class="form-check-input" 
                type="checkbox" 
                id="isCurrentUserRider"
                formControlName="isCurrentUserRider"
                (change)="onRiderCheckboxChange()">
              <label class="form-check-label" for="isCurrentUserRider">
                I am the rider
              </label>
            </div>

            <div *ngIf="!entryForm.get('isCurrentUserRider')?.value">
              <label class="form-label">Search for Rider</label>
              <input 
                type="text" 
                class="form-control" 
                formControlName="riderSearch"
                placeholder="Type to search by name, email, or SAEF number..."
                (input)="onRiderSearch()">
              
              <div class="search-results mt-2" *ngIf="riderSearchResults.length > 0">
                <div 
                  *ngFor="let rider of riderSearchResults" 
                  class="search-result-item"
                  (click)="selectRider(rider)">
                  <strong>{{ rider.firstName }} {{ rider.lastName }}</strong>
                  <small class="text-muted d-block">{{ rider.email }} | {{ rider.saefNumber }}</small>
                </div>
              </div>

              <div *ngIf="selectedRider" class="alert alert-info mt-3">
                <strong>Selected Rider:</strong> {{ selectedRider.firstName }} {{ selectedRider.lastName }}
              </div>
            </div>
          </div>
        </div>

        <!-- Horse Selection -->
        <div class="card mb-4">
          <div class="card-header">
            <h5><i class="ti ti-horse me-2"></i>Horse Selection</h5>
          </div>
          <div class="card-body">
            <label class="form-label">Search for Horse</label>
            <input 
              type="text" 
              class="form-control" 
              formControlName="horseSearch"
              placeholder="Type to search by name or passport number..."
              (input)="onHorseSearch()">
            
            <div class="search-results mt-2" *ngIf="horseSearchResults.length > 0">
              <div 
                *ngFor="let horse of horseSearchResults" 
                class="search-result-item"
                (click)="selectHorse(horse)">
                <strong>{{ horse.name }}</strong> ({{ horse.registeredName }})
                <small class="text-muted d-block">{{ horse.passportNumber }} | {{ horse.breed }}</small>
              </div>
            </div>

            <div *ngIf="selectedHorse" class="alert alert-info mt-3">
              <strong>Selected Horse:</strong> {{ selectedHorse.name }} ({{ selectedHorse.passportNumber }})
            </div>
          </div>
        </div>

        <!-- Class Selection -->
        <div class="card mb-4">
          <div class="card-header">
            <h5><i class="ti ti-list me-2"></i>Class Selection</h5>
          </div>
          <div class="card-body">
            <div *ngIf="loadingClasses" class="text-center py-3">
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div *ngIf="!loadingClasses && classes.length === 0" class="text-muted">
              No classes available for this competition
            </div>

            <div *ngIf="!loadingClasses && classes.length > 0">
              <div *ngFor="let class of classes" class="form-check class-item">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  [id]="'class-' + class.id"
                  [value]="class.id"
                  (change)="onClassSelectionChange(class, $event)">
                <label class="form-check-label w-100" [for]="'class-' + class.id">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{{ class.name }}</strong>
                      <small class="text-muted d-block" *ngIf="class.grade">Grade: {{ class.grade }}</small>
                      <small class="text-muted d-block" *ngIf="class.approximateStartTime">Time: {{ class.approximateStartTime }}</small>
                    </div>
                    <span class="badge bg-primary">R{{ class.fee }}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>

      <!-- Total and Actions -->
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="mb-0">Total (Classes)</h5>
            <h4 class="mb-0 text-primary">R{{ classesTotal }}</h4>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-secondary" (click)="cancel()">Cancel</button>
            <button 
              class="btn btn-primary flex-grow-1" 
              [disabled]="!canContinue()"
              (click)="continue()">
              Continue to Extras
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
    .search-results {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      max-height: 200px;
      overflow-y: auto;
    }
    .search-result-item {
      padding: 0.75rem 1rem;
      cursor: pointer;
      border-bottom: 1px solid #e5e7eb;
    }
    .search-result-item:last-child { border-bottom: none; }
    .search-result-item:hover { background-color: #f3f4f6; }
    .class-item {
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 0.75rem;
    }
    .class-item:hover { background-color: #f9fafb; }
  `]
})
export class EntryDetailsComponent implements OnInit {
  competition?: Competition;
  classes: CompetitionClass[] = [];
  loadingClasses = false;
  entryForm: FormGroup;
  riderSearchResults: any[] = [];
  horseSearchResults: any[] = [];
  selectedRider: any = null;
  selectedHorse: any = null;
  selectedClasses: CompetitionClass[] = [];
  classesTotal = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private competitionService: CompetitionService,
    private wizardService: EntryWizardService,
    private riderService: RiderService
  ) {
    this.entryForm = this.fb.group({
      isCurrentUserRider: [true],
      riderSearch: [''],
      horseSearch: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadCompetition(slug);
    }

    // Set current user as rider by default
    this.setCurrentUserAsRider();
  }

  loadCompetition(slug: string): void {
    this.competitionService.getCompetitionBySlug(slug).subscribe({
      next: (competition) => {
        this.competition = competition;
        this.wizardService.setCompetition(competition);
        this.loadClasses(competition.id);
      },
      error: (error) => {
        console.error('Error loading competition:', error);
        this.router.navigate(['/my/entries/competitions']);
      }
    });
  }

  loadClasses(competitionId: string): void {
    this.loadingClasses = true;
    this.competitionService.getCompetitionClasses(competitionId).subscribe({
      next: (classes) => {
        this.classes = classes;
        this.loadingClasses = false;
      },
      error: (error) => {
        console.error('Error loading classes:', error);
        this.loadingClasses = false;
      }
    });
  }

  setCurrentUserAsRider(): void {
    this.riderService.getProfile().subscribe({
      next: (rider) => {
        this.selectedRider = rider;
        this.wizardService.setRider(rider.id, `${rider.firstName} ${rider.lastName}`, true);
      }
    });
  }

  onRiderCheckboxChange(): void {
    const isCurrentUser = this.entryForm.get('isCurrentUserRider')?.value;
    if (isCurrentUser) {
      this.setCurrentUserAsRider();
      this.entryForm.get('riderSearch')?.setValue('');
      this.riderSearchResults = [];
    } else {
      this.selectedRider = null;
    }
  }

  onRiderSearch(): void {
    const searchTerm = this.entryForm.get('riderSearch')?.value;
    if (searchTerm && searchTerm.length >= 2) {
      this.competitionService.searchRiders(searchTerm).subscribe({
        next: (results) => {
          this.riderSearchResults = results;
        }
      });
    } else {
      this.riderSearchResults = [];
    }
  }

  selectRider(rider: any): void {
    this.selectedRider = rider;
    this.wizardService.setRider(rider.id, `${rider.firstName} ${rider.lastName}`, false);
    this.entryForm.get('riderSearch')?.setValue(`${rider.firstName} ${rider.lastName}`);
    this.riderSearchResults = [];
  }

  onHorseSearch(): void {
    const searchTerm = this.entryForm.get('horseSearch')?.value;
    if (searchTerm && searchTerm.length >= 2) {
      this.competitionService.searchHorses(searchTerm).subscribe({
        next: (results) => {
          this.horseSearchResults = results;
        }
      });
    } else {
      this.horseSearchResults = [];
    }
  }

  selectHorse(horse: any): void {
    this.selectedHorse = horse;
    this.wizardService.setHorse(horse.id, horse.name);
    this.entryForm.get('horseSearch')?.setValue(horse.name);
    this.horseSearchResults = [];
  }

  onClassSelectionChange(classItem: CompetitionClass, event: any): void {
    if (event.target.checked) {
      this.selectedClasses.push(classItem);
    } else {
      this.selectedClasses = this.selectedClasses.filter(c => c.id !== classItem.id);
    }
    this.wizardService.setSelectedClasses(this.selectedClasses);
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.classesTotal = this.selectedClasses.reduce((sum, cls) => sum + cls.fee, 0);
  }

  canContinue(): boolean {
    return !!(this.selectedRider && this.selectedHorse && this.selectedClasses.length > 0);
  }

  continue(): void {
    if (this.canContinue()) {
      this.router.navigate(['/my/entries/entry-extras']);
    }
  }

  cancel(): void {
    this.wizardService.reset();
    this.router.navigate(['/my/entries']);
  }

  goBack(): void {
    this.router.navigate(['/my/entries/competitions']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}

