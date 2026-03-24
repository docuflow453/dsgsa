/**
 * Breeds List Component
 * Displays and manages the list of horse breeds in the system
 */

import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Service and Types
import { BreedsListService } from './breeds-list.service';
import { Breed } from './breeds-list-type';

@Component({
  selector: 'app-breeds-list',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './breeds-list.component.html',
  styleUrl: './breeds-list.component.scss',
  providers: [BreedsListService, DecimalPipe]
})
export class BreedsListComponent implements OnInit {
  breeds$: Observable<Breed[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  selectedBreed: Breed | null = null;

  // Filter options
  uniqueStatuses: string[] = [];

  constructor(
    public service: BreedsListService,
    private modalService: NgbModal
  ) {
    this.breeds$ = service.breeds$;
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
  openDeleteModal(content: any, breed: Breed) {
    this.selectedBreed = breed;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete breed
   */
  deleteBreed() {
    if (this.selectedBreed) {
      console.log('Deleting breed:', this.selectedBreed);
      // TODO: Implement actual delete logic
      this.modalService.dismissAll();
      this.selectedBreed = null;
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

