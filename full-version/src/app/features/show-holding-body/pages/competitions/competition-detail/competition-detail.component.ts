import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ShowHoldingBodyService } from '../../../services/show-holding-body.service';

export interface CompetitionDetail {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  city: string;
  province: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  totalClasses: number;
  totalEntries: number;
  totalRevenue: number;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  closingDate?: Date;
  maxEntries?: number;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-competition-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './competition-detail.component.html',
  styleUrls: ['./competition-detail.component.scss']
})
export class CompetitionDetailComponent implements OnInit {
  competition: CompetitionDetail | null = null;
  competitionId: string = '';
  loading = true;
  activeTab: string = 'overview';

  // Available tabs
  tabs = [
    { id: 'overview', label: 'Overview', icon: 'ti-info-circle' },
    { id: 'dates', label: 'Dates', icon: 'ti-calendar' },
    { id: 'extras', label: 'Extras', icon: 'ti-plus-circle' },
    { id: 'levies', label: 'Levies', icon: 'ti-receipt' },
    { id: 'documents', label: 'Documents', icon: 'ti-file-text' },
    { id: 'classes', label: 'Classes', icon: 'ti-list' },
    { id: 'transactions', label: 'Transactions', icon: 'ti-credit-card' },
    { id: 'entries', label: 'Entries', icon: 'ti-users' },
    { id: 'riding-order', label: 'Riding Order', icon: 'ti-sort-ascending' }
  ];

  // Toast notification
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shbService: ShowHoldingBodyService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.competitionId = params['id'];
      if (this.competitionId === 'new') {
        this.createNewCompetition();
      } else {
        this.loadCompetition();
      }
    });

    // Check for tab query parameter
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
  }

  loadCompetition(): void {
    this.loading = true;
    this.shbService.getCompetitionById(this.competitionId).subscribe({
      next: (competition) => {
        this.competition = competition;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading competition:', error);
        this.showErrorToast('Failed to load competition');
        this.loading = false;
      }
    });
  }

  createNewCompetition(): void {
    // Initialize a new competition object
    this.competition = {
      id: 'new',
      name: '',
      startDate: new Date(),
      endDate: new Date(),
      venue: '',
      city: '',
      province: '',
      status: 'draft',
      totalClasses: 0,
      totalEntries: 0,
      totalRevenue: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.loading = false;
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
    // Update URL with tab parameter
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabId },
      queryParamsHandling: 'merge'
    });
  }

  backToList(): void {
    this.router.navigate(['/shb/competitions']);
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'draft': 'bg-secondary',
      'published': 'bg-info',
      'ongoing': 'bg-success',
      'completed': 'bg-primary',
      'cancelled': 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
  }

  // Toast notifications
  showSuccessToast(message: string): void {
    this.toastMessage = message;
    this.toastType = 'success';
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  showErrorToast(message: string): void {
    this.toastMessage = message;
    this.toastType = 'error';
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}
