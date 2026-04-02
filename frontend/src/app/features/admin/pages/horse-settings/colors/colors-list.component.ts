/**
 * Colors List Component
 * Displays and manages the list of horse colors in the system
 */

import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Service and Types
import { ColorsListService } from './colors-list.service';
import { Color } from './colors-list-type';

@Component({
  selector: 'app-colors-list',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './colors-list.component.html',
  styleUrl: './colors-list.component.scss',
  providers: [ColorsListService, DecimalPipe]
})
export class ColorsListComponent implements OnInit {
  colors$: Observable<Color[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  selectedColor: Color | null = null;

  // Filter options
  uniqueStatuses: string[] = [];

  constructor(
    public service: ColorsListService,
    private modalService: NgbModal
  ) {
    this.colors$ = service.colors$;
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
  openDeleteModal(content: any, color: Color) {
    this.selectedColor = color;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete color
   */
  deleteColor() {
    if (this.selectedColor) {
      console.log('Deleting color:', this.selectedColor);
      // TODO: Implement actual delete logic
      this.modalService.dismissAll();
      this.selectedColor = null;
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

