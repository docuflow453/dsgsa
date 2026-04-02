/**
 * Grades List Component
 * Displays and manages the list of horse grades in the system
 */

import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Service and Types
import { GradesListService } from './grades-list.service';
import { Grade } from './grades-list-type';

@Component({
  selector: 'app-grades-list',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './grades-list.component.html',
  styleUrl: './grades-list.component.scss',
  providers: [GradesListService, DecimalPipe]
})
export class GradesListComponent implements OnInit {
  grades$: Observable<Grade[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  selectedGrade: Grade | null = null;

  // Filter options
  uniqueStatuses: string[] = [];

  constructor(
    public service: GradesListService,
    private modalService: NgbModal
  ) {
    this.grades$ = service.grades$;
    this.total$ = service.total$;
    this.loading$ = service.loading$;
  }

  ngOnInit() {
    // Load filter options
    this.uniqueStatuses = this.service.getUniqueStatuses();
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'badge bg-light-success';
      case 'Inactive':
        return 'badge bg-light-secondary';
      default:
        return 'badge bg-light-secondary';
    }
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this.service.resetFilters();
  }

  /**
   * Open delete confirmation modal
   */
  openDeleteModal(content: any, grade: Grade) {
    this.selectedGrade = grade;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete grade
   */
  deleteGrade() {
    if (this.selectedGrade) {
      console.log('Deleting grade:', this.selectedGrade);
      // TODO: Implement actual delete logic
      this.modalService.dismissAll();
      this.selectedGrade = null;
    }
  }

  /**
   * Format date for display
   */
  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

