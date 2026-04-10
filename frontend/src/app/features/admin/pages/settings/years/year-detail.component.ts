/**
 * Year Detail Component
 * Displays detailed information about a year
 */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Service
import { Year } from './years-list-type';
import { YearsListService } from './years-list.service';

@Component({
  selector: 'app-year-detail',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './year-detail.component.html',
  styleUrl: './year-detail.component.scss'
})
export class YearDetailComponent implements OnInit {
  year: Year | null = null;
  yearId: string = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private yearsService: YearsListService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.yearId = id;
      this.loadYearData();
    }
  }

  /**
   * Load year data from backend API
   */
  loadYearData() {
    // Defer loading state to avoid NG0100 when called from ngOnInit
    setTimeout(() => {
      this.loading = true;
      this.cdr.detectChanges();

      this.yearsService.getYearById(this.yearId).subscribe({
        next: (year) => {
          this.year = year;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading year:', error);
          this.loading = false;
          this.cdr.detectChanges();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load year details. Redirecting to list...'
          }).then(() => {
            this.router.navigate(['/admin/settings/years']);
          });
        }
      });
    }, 0);
  }

  /**
   * Navigate to edit page
   */
  editYear() {
    this.router.navigate(['/admin/settings/years', this.yearId, 'edit']);
  }

  /**
   * Navigate back to list
   */
  goBack() {
    this.router.navigate(['/admin/settings/years']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete year
   */
  deleteYear() {
    this.yearsService.deleteYear(this.yearId).subscribe({
      next: () => {
        this.modalService.dismissAll();
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Year has been deleted successfully.'
        }).then(() => {
          this.router.navigate(['/admin/settings/years']);
        });
      },
      error: (error) => {
        console.error('Error deleting year:', error);
        this.modalService.dismissAll();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to delete year. Please try again.'
        });
      }
    });
  }

  /**
   * Activate this year
   */
  activateYear() {
    if (!this.year) return;

    Swal.fire({
      title: 'Activate Year?',
      text: `Are you sure you want to activate ${this.year.name}? This will deactivate all other years.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, activate it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed && this.year) {
        this.yearsService.activateYear(this.year.id).subscribe({
          next: (updatedYear) => {
            this.year = updatedYear;
            Swal.fire('Activated!', `${updatedYear.name} has been activated.`, 'success');
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
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Format datetime for display
   */
  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

