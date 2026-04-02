import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShowHoldingBodyService } from '../../services/show-holding-body.service';

export interface Extra {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'stabling' | 'feed' | 'bedding' | 'services' | 'other';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-extras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.scss']
})
export class ExtrasComponent implements OnInit {
  extras: Extra[] = [];
  filteredExtras: Extra[] = [];
  searchQuery = '';
  categoryFilter: string = 'all';
  loading = true;

  // Modal states
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedExtra: Extra | null = null;
  processingAction = false;

  // Form data
  formData: Partial<Extra> = {
    name: '',
    description: '',
    price: 0,
    category: 'other',
    isActive: true
  };

  // Toast notification
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  categories = [
    { value: 'stabling', label: 'Stabling' },
    { value: 'feed', label: 'Feed' },
    { value: 'bedding', label: 'Bedding' },
    { value: 'services', label: 'Services' },
    { value: 'other', label: 'Other' }
  ];

  constructor(private shbService: ShowHoldingBodyService) {}

  ngOnInit(): void {
    this.loadExtras();
  }

  loadExtras(): void {
    this.loading = true;
    this.shbService.getExtras().subscribe({
      next: (extras) => {
        this.extras = extras;
        this.filteredExtras = extras;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading extras:', error);
        this.showErrorToast('Failed to load extras');
        this.loading = false;
      }
    });
  }

  searchExtras(): void {
    const query = this.searchQuery.toLowerCase();
    let filtered = this.extras;

    // Apply search filter
    if (query) {
      filtered = filtered.filter(extra =>
        extra.name.toLowerCase().includes(query) ||
        extra.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (this.categoryFilter !== 'all') {
      filtered = filtered.filter(extra => extra.category === this.categoryFilter);
    }

    this.filteredExtras = filtered;
    this.currentPage = 1;
  }

  openCreateModal(): void {
    this.formData = {
      name: '',
      description: '',
      price: 0,
      category: 'other',
      isActive: true
    };
    this.showCreateModal = true;
  }

  openEditModal(extra: Extra): void {
    this.selectedExtra = extra;
    this.formData = { ...extra };
    this.showEditModal = true;
  }

  openDeleteModal(extra: Extra): void {
    this.selectedExtra = extra;
    this.showDeleteModal = true;
  }

  closeAllModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedExtra = null;
    this.formData = {
      name: '',
      description: '',
      price: 0,
      category: 'other',
      isActive: true
    };
  }

  createExtra(): void {
    if (!this.formData.name || !this.formData.price) {
      this.showErrorToast('Please fill in all required fields');
      return;
    }

    this.processingAction = true;
    this.shbService.createExtra(this.formData).subscribe({
      next: (response) => {
        this.showSuccessToast('Extra created successfully');
        this.loadExtras();
        this.closeAllModals();
        this.processingAction = false;
      },
      error: (error) => {
        this.showErrorToast('Failed to create extra');
        this.processingAction = false;
      }
    });
  }

  updateExtra(): void {
    if (!this.formData.name || !this.formData.price || !this.selectedExtra) {
      this.showErrorToast('Please fill in all required fields');
      return;
    }

    this.processingAction = true;
    this.shbService.updateExtra(this.selectedExtra.id, this.formData).subscribe({
      next: (response) => {
        this.showSuccessToast('Extra updated successfully');
        this.loadExtras();
        this.closeAllModals();
        this.processingAction = false;
      },
      error: (error) => {
        this.showErrorToast('Failed to update extra');
        this.processingAction = false;
      }
    });
  }

  confirmDelete(): void {
    if (!this.selectedExtra) return;

    this.processingAction = true;
    this.shbService.deleteExtra(this.selectedExtra.id).subscribe({
      next: (response) => {
        this.showSuccessToast('Extra deleted successfully');
        this.loadExtras();
        this.closeAllModals();
        this.processingAction = false;
      },
      error: (error) => {
        this.showErrorToast('Failed to delete extra');
        this.processingAction = false;
      }
    });
  }

  toggleStatus(extra: Extra): void {
    const updatedExtra = { ...extra, isActive: !extra.isActive };
    this.shbService.updateExtra(extra.id, updatedExtra).subscribe({
      next: (response) => {
        this.showSuccessToast(`Extra ${updatedExtra.isActive ? 'activated' : 'deactivated'} successfully`);
        this.loadExtras();
      },
      error: (error) => {
        this.showErrorToast('Failed to update extra status');
      }
    });
  }

  getCategoryBadgeClass(category: string): string {
    const classes: { [key: string]: string } = {
      'stabling': 'bg-primary',
      'feed': 'bg-success',
      'bedding': 'bg-warning',
      'services': 'bg-info',
      'other': 'bg-secondary'
    };
    return classes[category] || 'bg-secondary';
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
  get paginatedExtras(): Extra[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredExtras.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredExtras.length / this.itemsPerPage);
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
