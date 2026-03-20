import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RiderService } from '../../services/rider.service';
import { Horse } from '../../models/rider.model';

@Component({
  selector: 'app-horses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="horses-page">
      <div class="page-header mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2>My Horses</h2>
          <p class="text-muted">Manage your registered horses</p>
        </div>
        <button class="btn btn-primary" [routerLink]="['/my/horses/new']">
          <i class="ti ti-plus me-2"></i>Add New Horse
        </button>
      </div>

      <div *ngIf="horses.length === 0" class="text-center text-muted py-5">
        <i class="ti ti-horse-toy" style="font-size: 4rem; opacity: 0.3;"></i>
        <p class="mt-3">No horses registered yet</p>
        <button class="btn btn-primary mt-2" [routerLink]="['/my/horses/new']">
          <i class="ti ti-plus me-2"></i>Add Your First Horse
        </button>
      </div>

      <div class="row">
        <div *ngFor="let horse of horses" class="col-md-6 col-lg-4 mb-4">
          <div class="horse-card">
            <div class="horse-icon">
              <i class="ti ti-horse"></i>
            </div>
            <div class="horse-info">
              <h5>{{ horse.name }}</h5>
              <p class="text-muted mb-2">{{ horse.registeredName }}</p>
              <div class="horse-details">
                <div class="detail-item">
                  <strong>Breed:</strong> {{ horse.breed }}
                </div>
                <div class="detail-item">
                  <strong>Age:</strong> {{ horse.age }} years
                </div>
                <div class="detail-item">
                  <strong>Gender:</strong> {{ horse.gender }}
                </div>
                <div class="detail-item">
                  <strong>Grade:</strong> {{ horse.grade }}
                </div>
                <div class="detail-item">
                  <strong>Status:</strong>
                  <span class="badge" [ngClass]="{
                    'bg-success': horse.status === 'Active',
                    'bg-secondary': horse.status === 'Inactive'
                  }">{{ horse.status }}</span>
                </div>
              </div>
            </div>
            <div class="horse-actions">
              <button class="btn btn-sm btn-outline-primary me-2" [routerLink]="['/my/horses', horse.id]">
                <i class="ti ti-eye"></i> View
              </button>
              <button class="btn btn-sm btn-outline-secondary me-2" [routerLink]="['/my/horses', horse.id, 'edit']">
                <i class="ti ti-edit"></i> Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .horse-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .horse-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .horse-icon {
      text-align: center;
      margin-bottom: 1rem;
    }
    .horse-icon i {
      font-size: 3rem;
      color: #2563eb;
    }
    .horse-info h5 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.25rem;
      text-align: center;
    }
    .horse-info p {
      text-align: center;
      font-size: 0.875rem;
    }
    .horse-details {
      margin: 1rem 0;
    }
    .detail-item {
      padding: 0.5rem 0;
      border-bottom: 1px solid #f3f4f6;
      font-size: 0.875rem;
    }
    .detail-item:last-child {
      border-bottom: none;
    }
    .detail-item strong {
      color: #6b7280;
      margin-right: 0.5rem;
    }
    .horse-actions {
      display: flex;
      justify-content: center;
      margin-top: 1rem;
    }
  `]
})
export class HorsesComponent implements OnInit {
  horses: Horse[] = [];

  constructor(private riderService: RiderService) {}

  ngOnInit(): void {
    this.riderService.getHorses().subscribe(horses => {
      this.horses = horses;
    });
  }
}

