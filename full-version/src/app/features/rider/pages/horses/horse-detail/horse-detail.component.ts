import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { RiderService } from '../../../services/rider.service';
import { Horse } from '../../../models/rider.model';

@Component({
  selector: 'app-horse-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './horse-detail.component.html',
  styleUrls: ['./horse-detail.component.scss']
})
export class HorseDetailComponent implements OnInit {
  horse: Horse | null = null;
  loading = true;
  errorMessage = '';
  activeTab = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private riderService: RiderService
  ) {}

  ngOnInit(): void {
    const horseId = this.route.snapshot.paramMap.get('id');
    if (horseId) {
      this.loadHorse(horseId);
    } else {
      this.errorMessage = 'Horse ID not found';
      this.loading = false;
    }
  }

  loadHorse(id: string): void {
    this.loading = true;
    this.riderService.getHorseById(id).subscribe({
      next: (horse) => {
        this.horse = horse;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load horse details';
        this.loading = false;
      }
    });
  }

  setActiveTab(tab: number): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/my/horses']);
  }

  editHorse(): void {
    if (this.horse) {
      this.router.navigate(['/my/horses', this.horse.id, 'edit']);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-success';
      case 'Inactive':
        return 'bg-warning';
      case 'Retired':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }

  getAffiliationStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-success';
      case 'Expired':
        return 'bg-danger';
      case 'Pending':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  downloadDocument(documentUrl: string): void {
    // TODO: Implement document download
    console.log('Downloading document:', documentUrl);
  }
}

