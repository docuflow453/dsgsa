/**
 * Show Detail Component
 * Displays detailed information about a specific show/competition
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Types and Data
import { Show } from './shows-list-type';
import { SHOWS } from './shows-list-data';

@Component({
  selector: 'app-show-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, DatePipe, CurrencyPipe],
  templateUrl: './show-detail.component.html',
  styleUrl: './show-detail.component.scss'
})
export class ShowDetailComponent implements OnInit {
  show: Show | null = null;
  showId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    // Get show ID from route
    this.route.params.subscribe((params) => {
      this.showId = +params['id'];
      this.loadShow();
    });
  }

  /**
   * Load show data
   */
  loadShow() {
    this.show = SHOWS.find((s) => s.id === this.showId) || null;
    
    if (!this.show) {
      console.error('Show not found');
      this.router.navigate(['/admin/shows']);
    }
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
   * Navigate to edit page
   */
  editShow() {
    this.router.navigate(['/admin/shows', this.showId, 'edit']);
  }

  /**
   * Navigate back to list
   */
  goBack() {
    this.router.navigate(['/admin/shows']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete show
   */
  deleteShow() {
    const index = SHOWS.findIndex((s) => s.id === this.showId);
    if (index > -1) {
      SHOWS.splice(index, 1);
      this.modalService.dismissAll();
      this.router.navigate(['/admin/shows']);
    }
  }
}

