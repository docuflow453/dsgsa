import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CompetitionService } from '../../../services/competition.service';
import { EntryWizardService } from '../../../services/entry-wizard.service';
import { Competition } from '../../../models/rider.model';

@Component({
  selector: 'app-competition-selection',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="competition-selection-page">
      <div class="page-header mb-4">
        <div class="d-flex align-items-center mb-3">
          <button class="btn btn-link text-decoration-none p-0 me-3" (click)="goBack()">
            <i class="ti ti-arrow-left"></i>
          </button>
          <div>
            <h2 class="mb-1">Select Competition</h2>
            <p class="text-muted mb-0">Choose a competition to enter</p>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div *ngIf="!loading && competitions.length === 0" class="card">
        <div class="card-body text-center py-5">
          <i class="ti ti-calendar-off" style="font-size: 3rem; opacity: 0.3;"></i>
          <p class="mt-3 text-muted">No open competitions available at this time</p>
        </div>
      </div>

      <div *ngIf="!loading && competitions.length > 0" class="row">
        <div *ngFor="let competition of competitions" class="col-md-6 col-lg-4 mb-4">
          <div class="card competition-card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h5 class="card-title mb-0">{{ competition.name }}</h5>
                <span class="badge bg-success">Open</span>
              </div>
              
              <div class="competition-details mb-3">
                <div class="detail-item">
                  <i class="ti ti-calendar me-2 text-muted"></i>
                  <span>{{ formatDate(competition.startDate) }} - {{ formatDate(competition.endDate) }}</span>
                </div>
                <div class="detail-item">
                  <i class="ti ti-map-pin me-2 text-muted"></i>
                  <span>{{ competition.venue }}, {{ competition.city }}</span>
                </div>
                <div class="detail-item">
                  <i class="ti ti-clock me-2 text-muted"></i>
                  <span>Closes: {{ formatDate(competition.closingDate) }}</span>
                </div>
                <div class="detail-item" *ngIf="competition.totalClasses">
                  <i class="ti ti-list me-2 text-muted"></i>
                  <span>{{ competition.totalClasses }} classes available</span>
                </div>
              </div>

              <p class="card-text text-muted small" *ngIf="competition.description">
                {{ competition.description }}
              </p>

              <button 
                class="btn btn-primary w-100 mt-3" 
                (click)="selectCompetition(competition)">
                <i class="ti ti-check me-2"></i>Select Competition
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card { 
      border: none; 
      border-radius: 12px; 
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .competition-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .card-title { 
      font-size: 1.125rem; 
      font-weight: 600; 
      color: #1f2937;
      line-height: 1.4;
    }
    .competition-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .detail-item {
      display: flex;
      align-items: center;
      font-size: 0.875rem;
      color: #4b5563;
    }
    .detail-item i {
      font-size: 1rem;
    }
    .btn-link {
      color: #6b7280;
      font-size: 1.5rem;
    }
    .btn-link:hover {
      color: #1f2937;
    }
  `]
})
export class CompetitionSelectionComponent implements OnInit {
  competitions: Competition[] = [];
  loading = true;

  constructor(
    private competitionService: CompetitionService,
    private wizardService: EntryWizardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCompetitions();
  }

  loadCompetitions(): void {
    this.loading = true;
    this.competitionService.getOpenCompetitions().subscribe({
      next: (competitions) => {
        this.competitions = competitions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading competitions:', error);
        this.loading = false;
      }
    });
  }

  selectCompetition(competition: Competition): void {
    this.wizardService.setCompetition(competition);
    this.router.navigate(['/my/entries/entry-details', competition.slug]);
  }

  goBack(): void {
    this.router.navigate(['/my/entries']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}

