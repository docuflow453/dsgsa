import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShowHoldingBodyService } from '../../services/show-holding-body.service';

export interface Levy {
  id: string;
  name: string;
  description: string;
  amount: number;
  type: 'fixed' | 'percentage';
  applicableTo: 'entry' | 'class' | 'competition';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-levies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './levies.component.html',
  styleUrls: ['./levies.component.scss']
})
export class LeviesComponent implements OnInit {
  levies: Levy[] = [];
  filteredLevies: Levy[] = [];
  searchQuery = '';
  typeFilter: string = 'all';
  loading = true;

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedLevy: Levy | null = null;
  processingAction = false;

  formData: Partial<Levy> = {
    name: '',
    description: '',
    amount: 0,
    type: 'fixed',
    applicableTo: 'entry',
    isActive: true
  };

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  currentPage = 1;
  itemsPerPage = 10;

  types = [
    { value: 'fixed', label: 'Fixed Amount' },
    { value: 'percentage', label: 'Percentage' }
  ];

  applicableOptions = [
    { value: 'entry', label: 'Per Entry' },
    { value: 'class', label: 'Per Class' },
    { value: 'competition', label: 'Per Competition' }
  ];

  constructor(private shbService: ShowHoldingBodyService) {}

  ngOnInit(): void {
    this.loadLevies();
  }

  loadLevies(): void {
    this.loading = true;
    this.shbService.getLevies().subscribe({
      next: (levies) => {
        this.levies = levies;
        this.filteredLevies = levies;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading levies:', error);
        this.showErrorToast('Failed to load levies');
        this.loading = false;
      }
    });
  }

  searchLevies(): void {
    const query = this.searchQuery.toLowerCase();
    let filtered = this.levies;

    if (query) {
      filtered = filtered.filter(levy =>
        levy.name.toLowerCase().includes(query) ||
        levy.description.toLowerCase().includes(query)
      );
    }

    if (this.typeFilter !== 'all') {
      filtered = filtered.filter(levy => levy.type === this.typeFilter);
    }

    this.filteredLevies = filtered;
    this.currentPage = 1;
  }

  openCreateModal(): void {
    this.formData = {
      name: '',
      description: '',
      amount: 0,
      type: 'fixed',
      applicableTo: 'entry',
      isActive: true
    };
    this.showCreateModal = true;
  }

  openEditModal(levy: Levy): void {
    this.selectedLevy = levy;
    this.formData = { ...levy };
    this.showEditModal = true;
  }

  openDeleteModal(levy: Levy): void {
    this.selectedLevy = levy;
    this.showDeleteModal = true;
  }

  closeAllModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedLevy = null;
    this.formData = {
      name: '',
      description: '',
      amount: 0,
      type: 'fixed',
      applicableTo: 'entry',
      isActive: true
    };
  }

  createLevy(): void {
    if (!this.formData.name || !this.formData.amount) {
      this.showErrorToast('Please fill in all required fields');
      return;
    }

    this.processingAction = true;
    this.shbService.createLevy(this.formData).subscribe({
      next: (response) => {
        this.showSuccessToast('Levy created successfully');
        this.loadLevies();
        this.closeAllModals();
        this.processingAction = false;
      },
      error: (error) => {
        this.showErrorToast('Failed to create levy');
        this.processingAction = false;
      }
    });
  }

  updateLevy(): void {
    if (!this.formData.name || !this.formData.amount || !this.selectedLevy) {
      this.showErrorToast('Please fill in all required fields');
      return;
    }

    this.processingAction = true;
    this.shbService.updateLevy(this.selectedLevy.id, this.formData).subscribe({
      next: (response) => {
        this.showSuccessToast('Levy updated successfully');
        this.loadLevies();
        this.closeAllModals();
        this.processingAction = false;
      },
      error: (error) => {
        this.showErrorToast('Failed to update levy');
        this.processingAction = false;
      }
    });
  }

  confirmDelete(): void {
    if (!this.selectedLevy) return;

    this.processingAction = true;
    this.shbService.deleteLevy(this.selectedLevy.id).subscribe({
      next: (response) => {
        this.showSuccessToast('Levy deleted successfully');
        this.loadLevies();
        this.closeAllModals();
        this.processingAction = false;
      },
      error: (error) => {
        this.showErrorToast('Failed to delete levy');
        this.processingAction = false;
      }
    });
  }

  toggleStatus(levy: Levy): void {
    const updatedLevy = { ...levy, isActive: !levy.isActive };
    this.shbService.updateLevy(levy.id, updatedLevy).subscribe({
      next: (response) => {
        this.showSuccessToast(`Levy ${updatedLevy.isActive ? 'activated' : 'deactivated'} successfully`);
        this.loadLevies();
      },
      error: (error) => {
        this.showErrorToast('Failed to update levy status');
      }
    });
  }

  getTypeBadgeClass(type: string): string {
    return type === 'fixed' ? 'bg-primary' : 'bg-success';
  }

  formatAmount(levy: Levy): string {
    if (levy.type === 'percentage') {
      return `${levy.amount}%`;
    }
    return `R ${levy.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
  }

  showSuccessToast(message: string): void {
    this.toastMessage = message;
    this.toastType = 'success';
    this.showToast = true;
    setTimeout(() => { this.showToast = false; }, 3000);
  }

  showErrorToast(message: string): void {
    this.toastMessage = message;
    this.toastType = 'error';
    this.showToast = true;
    setTimeout(() => { this.showToast = false; }, 3000);
  }

  get paginatedLevies(): Levy[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredLevies.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredLevies.length / this.itemsPerPage);
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
