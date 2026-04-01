/**
 * Shows List Component
 * Displays and manages the list of Shows (Competitions) in the system
 */

import { Component, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Service and Types
import { ShowsListService } from './shows-list.service';
import { Show } from './shows-list-type';

@Component({
  selector: 'app-shows-list',
  standalone: true,
  imports: [SharedModule, RouterModule, DatePipe],
  templateUrl: './shows-list.component.html',
  styleUrl: './shows-list.component.scss',
  providers: [ShowsListService, DecimalPipe]
})
export class ShowsListComponent implements OnInit {
  shows$: Observable<Show[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  selectedShow: Show | null = null;

  // Filter options
  statuses: string[] = [];
  levels: string[] = [];

  // Tab management
  activeTab: number = 2; // Default to "Active" tab (index 2)

  constructor(
    public service: ShowsListService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.shows$ = service.shows$;
    this.total$ = service.total$;
    this.loading$ = service.loading$;
  }

  ngOnInit() {
    // Load filter options
    this.statuses = this.service.getUniqueStatuses();
    this.levels = this.service.getUniqueLevels();

    // Set initial filter based on active tab
    this.onTabChange(this.activeTab);
  }

  /**
   * Handle tab change
   */
  onTabChange(tabId: number) {
    this.activeTab = tabId;

    // Reset page to 1 when changing tabs
    this.service.page = 1;

    // Set status filter based on tab
    switch (tabId) {
      case 1: // Upcoming
        this.service.statusFilter = 'Upcoming';
        break;
      case 2: // Active (Open)
        this.service.statusFilter = 'Open';
        break;
      case 3: // Past (Completed or Cancelled)
        this.service.statusFilter = 'Completed,Cancelled';
        break;
      default:
        this.service.statusFilter = '';
    }
  }

  /**
   * Get count of shows for a specific tab
   */
  getTabCount(tabId: number): number {
    // This would ideally come from the service
    // For now, we'll return 0 as a placeholder
    return 0;
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      Upcoming: 'badge bg-light-info',
      Open: 'badge bg-light-success',
      Closed: 'badge bg-light-warning',
      Completed: 'badge bg-light-secondary',
      Cancelled: 'badge bg-light-danger'
    };
    return statusClasses[status] || 'badge bg-light-secondary';
  }

  /**
   * Get level badge class
   */
  getLevelClass(level: string): string {
    const levelClasses: { [key: string]: string } = {
      Preliminary: 'badge bg-light-primary',
      Novice: 'badge bg-light-info',
      Elementary: 'badge bg-light-success',
      Medium: 'badge bg-light-warning',
      Advanced: 'badge bg-light-danger',
      'Grand Prix': 'badge bg-light-dark',
      'All Levels': 'badge bg-light-secondary'
    };
    return levelClasses[level] || 'badge bg-light-secondary';
  }

  /**
   * Check if entry closing date is approaching (within 7 days)
   */
  isClosingSoon(show: Show): boolean {
    const today = new Date();
    const closingDate = new Date(show.entryClosingDate);
    const daysUntilClosing = Math.ceil((closingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilClosing > 0 && daysUntilClosing <= 7;
  }

  /**
   * Get days until entry closing
   */
  getDaysUntilClosing(show: Show): number {
    const today = new Date();
    const closingDate = new Date(show.entryClosingDate);
    return Math.ceil((closingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Reset all filters (except status which is controlled by tabs)
   */
  resetFilters() {
    // Reset search and level filter, but keep status filter from active tab
    this.service.searchTerm = '';
    this.service.levelFilter = '';
    this.service.page = 1;

    // Re-apply the tab filter
    this.onTabChange(this.activeTab);
  }

  /**
   * Navigate to create page
   */
  createShow() {
    this.router.navigate(['/admin/shows/create']);
  }

  /**
   * View show details
   */
  viewShow(show: Show) {
    this.router.navigate(['/admin/shows', show.id]);
  }

  /**
   * Edit show
   */
  editShow(show: Show) {
    this.router.navigate(['/admin/shows', show.id, 'edit']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any, show: Show) {
    this.selectedShow = show;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete show
   */
  deleteShow() {
    if (this.selectedShow) {
      this.service.deleteShow(this.selectedShow.id).subscribe(() => {
        console.log('Show deleted successfully');
        this.modalService.dismissAll();
        this.selectedShow = null;
      });
    }
  }
}

