/**
 * Years List Component
 * Displays and manages competition years/seasons
 */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Service
import { Year } from './years-list-type';
import { YearsListService } from './years-list.service';

@Component({
  selector: 'app-years-list',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule],
  templateUrl: './years-list.component.html',
  styleUrl: './years-list.component.scss'
})
export class YearsListComponent implements OnInit {
  years: Year[] = [];
  filteredYears: Year[] = [];
  searchText = '';
  selectedYear: Year | null = null;
  loading = false;
  totalCount = 0;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private yearsService: YearsListService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadYears();
  }

  /**
   * Load years data from backend API
   */
  loadYears() {
    // Defer loading state to avoid NG0100 when called from ngOnInit
    setTimeout(() => {
      this.loading = true;
      this.cdr.detectChanges();

      this.yearsService.getYears({ limit: 100, offset: 0 }).subscribe({
        next: (response) => {
          this.years = response.results;
          this.filteredYears = response.results;
          this.totalCount = response.count;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading years:', error);
          this.loading = false;
          this.cdr.detectChanges();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load years. Please try again.'
          });
        }
      });
    }, 0);
  }

  /**
   * Filter years based on search text
   */
  filterYears() {
    if (!this.searchText) {
      this.filteredYears = this.years;
      return;
    }

    const searchLower = this.searchText.toLowerCase();
    this.filteredYears = this.years.filter(
      (year) =>
        year.year.toString().includes(searchLower) ||
        year.name.toLowerCase().includes(searchLower) ||
        year.notes.toLowerCase().includes(searchLower) ||
        year.status.toLowerCase().includes(searchLower)
    );
  }

  /**
   * Navigate to create page
   */
  createYear() {
    this.router.navigate(['/admin/settings/years/create']);
  }

  /**
   * View year details
   */
  viewYear(year: Year) {
    this.router.navigate(['/admin/settings/years', year.id]);
  }

  /**
   * Edit year
   */
  editYear(year: Year) {
    this.router.navigate(['/admin/settings/years', year.id, 'edit']);
  }

  /**
   * Activate a year (deactivates all others)
   */
  activateYear(year: Year) {
    Swal.fire({
      title: 'Activate Year?',
      text: `Are you sure you want to activate ${year.name}? This will deactivate all other years.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, activate it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.yearsService.activateYear(year.id).subscribe({
          next: () => {
            Swal.fire('Activated!', `${year.name} has been activated.`, 'success');
            this.loadYears();
          },
          error: (error) => {
            console.error('Error activating year:', error);
            Swal.fire('Error', 'Failed to activate year. Please try again.', 'error');
          }
        });
      }
    });
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any, year: Year) {
    this.selectedYear = year;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete year
   */
  deleteYear() {
    if (this.selectedYear) {
      this.yearsService.deleteYear(this.selectedYear.id).subscribe({
        next: () => {
          Swal.fire('Deleted!', 'Year has been deleted successfully.', 'success');
          this.loadYears();
          this.modalService.dismissAll();
        },
        error: (error) => {
          console.error('Error deleting year:', error);
          Swal.fire('Error', 'Failed to delete year. Please try again.', 'error');
          this.modalService.dismissAll();
        }
      });
    }
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'bg-light-success';
      case 'PENDING':
        return 'bg-light-warning';
      case 'COMPLETE':
        return 'bg-light-info';
      case 'ARCHIVED':
        return 'bg-light-secondary';
      default:
        return 'bg-light-secondary';
    }
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

