import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ShowHoldingBodyService } from '../../../services/show-holding-body.service';

export interface Competition {
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
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-competition-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './competition-list.component.html',
  styleUrls: ['./competition-list.component.scss']
})
export class CompetitionListComponent implements OnInit {
  competitions: Competition[] = [];
  filteredCompetitions: Competition[] = [];
  searchQuery = '';
  statusFilter: string = 'all';
  loading = true;

  // Modal states
  showDeleteModal = false;
  selectedCompetition: Competition | null = null;
  processingAction = false;

  // Toast notification
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private shbService: ShowHoldingBodyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCompetitions();
  }

  loadCompetitions(): void {
    this.loading = true;
    this.shbService.getCompetitions().subscribe({
      next: (competitions) => {
        this.competitions = competitions;
        this.filteredCompetitions = competitions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading competitions:', error);
        this.showErrorToast('Failed to load competitions');
        this.loading = false;
      }
    });
  }

  searchCompetitions(): void {
    const query = this.searchQuery.toLowerCase();
    let filtered = this.competitions;

    // Apply search filter
    if (query) {
      filtered = filtered.filter(comp =>
        comp.name.toLowerCase().includes(query) ||
        comp.venue.toLowerCase().includes(query) ||
        comp.city.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(comp => comp.status === this.statusFilter);
    }

    this.filteredCompetitions = filtered;
    this.currentPage = 1;
  }

  createCompetition(): void {
    this.router.navigate(['/shb/competitions/new']);
  }

  viewCompetition(competition: Competition): void {
    this.router.navigate(['/shb/competitions', competition.id]);
  }

  editCompetition(competition: Competition): void {
    this.router.navigate(['/shb/competitions', competition.id]);
  }

  openDeleteModal(competition: Competition): void {
    this.selectedCompetition = competition;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedCompetition = null;
  }

  confirmDelete(): void {
    if (!this.selectedCompetition) return;

    this.processingAction = true;
    this.shbService.deleteCompetition(this.selectedCompetition.id).subscribe({
      next: (response) => {
        this.showSuccessToast('Competition deleted successfully');
        this.loadCompetitions();
        this.closeDeleteModal();
        this.processingAction = false;
      },
      error: (error) => {
        this.showErrorToast('Failed to delete competition');
        this.processingAction = false;
      }
    });
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

  // Pagination
  get paginatedCompetitions(): Competition[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCompetitions.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCompetitions.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get Math() {
    return Math;
  }
}
