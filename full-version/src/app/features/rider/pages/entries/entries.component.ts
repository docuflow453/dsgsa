import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RiderService } from '../../services/rider.service';
import { Entry } from '../../models/rider.model';

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="entries-page">
      <div class="page-header mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2>My Entries</h2>
          <p class="text-muted">Manage your competition entries</p>
        </div>
        <button class="btn btn-primary">
          <i class="ti ti-plus me-2"></i>New Entry
        </button>
      </div>

      <div class="card mb-4">
        <div class="card-header">
          <h5><i class="ti ti-calendar-event me-2"></i>Upcoming Entries</h5>
        </div>
        <div class="card-body">
          <div *ngIf="upcomingEntries.length === 0" class="text-center text-muted py-4">
            <i class="ti ti-calendar-off" style="font-size: 3rem; opacity: 0.3;"></i>
            <p class="mt-2">No upcoming entries</p>
          </div>
          <div *ngFor="let entry of upcomingEntries" class="entry-card mb-3">
            <div class="entry-header">
              <h6>{{ formatDate(entry.eventDate) }} - {{ entry.eventName }}</h6>
              <span class="badge" [ngClass]="{
                'bg-success': entry.status === 'Confirmed',
                'bg-warning': entry.status === 'Entered'
              }">{{ entry.status }}</span>
            </div>
            <div class="entry-details">
              <p><strong>Horse:</strong> {{ entry.horseName }}</p>
              <p><strong>Tests:</strong> {{ entry.tests.length }} test(s)</p>
            </div>
            <div class="entry-actions">
              <button class="btn btn-sm btn-outline-primary me-2">View Details</button>
              <button class="btn btn-sm btn-outline-danger">Withdraw</button>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h5><i class="ti ti-history me-2"></i>Past Entries</h5>
        </div>
        <div class="card-body">
          <div *ngIf="pastEntries.length === 0" class="text-center text-muted py-4">
            <p>No past entries</p>
          </div>
          <div *ngFor="let entry of pastEntries" class="entry-card mb-3">
            <div class="entry-header">
              <h6>{{ formatDate(entry.eventDate) }} - {{ entry.eventName }}</h6>
              <span class="badge bg-secondary">Completed</span>
            </div>
            <div class="entry-actions">
              <button class="btn btn-sm btn-outline-primary">View Results</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card { border: none; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
    .card-header { background: white; border-bottom: 1px solid #e5e7eb; padding: 1.25rem 1.5rem; }
    .card-header h5 { font-size: 1.125rem; font-weight: 600; color: #1f2937; margin: 0; }
    .entry-card { padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; }
    .entry-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .entry-header h6 { margin: 0; font-weight: 600; }
    .entry-details p { margin: 0.25rem 0; font-size: 0.875rem; }
    .entry-actions { margin-top: 0.75rem; }
  `]
})
export class EntriesComponent implements OnInit {
  upcomingEntries: Entry[] = [];
  pastEntries: Entry[] = [];

  constructor(private riderService: RiderService) {}

  ngOnInit(): void {
    this.riderService.getEntries().subscribe(entries => {
      const now = new Date();
      this.upcomingEntries = entries.filter(e => new Date(e.eventDate) >= now);
      this.pastEntries = entries.filter(e => new Date(e.eventDate) < now);
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}

