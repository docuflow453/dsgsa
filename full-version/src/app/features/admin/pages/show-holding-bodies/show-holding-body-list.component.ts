/**
 * Show Holding Body List Component
 * Displays and manages the list of Show Holding Bodies in the system
 */

import { Component, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Service and Types
import { ShowHoldingBodyListService } from './show-holding-body-list.service';
import { ShowHoldingBody } from './show-holding-body-list-type';

@Component({
  selector: 'app-show-holding-body-list',
  standalone: true,
  imports: [SharedModule, RouterModule, DatePipe],
  templateUrl: './show-holding-body-list.component.html',
  styleUrl: './show-holding-body-list.component.scss',
  providers: [ShowHoldingBodyListService, DecimalPipe]
})
export class ShowHoldingBodyListComponent implements OnInit {
  showHoldingBodies$: Observable<ShowHoldingBody[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  selectedShowHoldingBody: ShowHoldingBody | null = null;

  // Filter options
  provinces: string[] = [];
  statuses: string[] = [];

  constructor(
    public service: ShowHoldingBodyListService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.showHoldingBodies$ = service.showHoldingBodies$;
    this.total$ = service.total$;
    this.loading$ = service.loading$;
  }

  ngOnInit() {
    // Load filter options
    this.provinces = this.service.getUniqueProvinces();
    this.statuses = this.service.getUniqueStatuses();
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      Active: 'badge bg-light-success',
      Inactive: 'badge bg-light-secondary'
    };
    return statusClasses[status] || 'badge bg-light-secondary';
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this.service.resetFilters();
  }

  /**
   * Navigate to create page
   */
  createShowHoldingBody() {
    this.router.navigate(['/admin/show-holding-bodies/create']);
  }

  /**
   * View show holding body details
   */
  viewShowHoldingBody(shb: ShowHoldingBody) {
    this.router.navigate(['/admin/show-holding-bodies', shb.id]);
  }

  /**
   * Edit show holding body
   */
  editShowHoldingBody(shb: ShowHoldingBody) {
    this.router.navigate(['/admin/show-holding-bodies', shb.id, 'edit']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any, shb: ShowHoldingBody) {
    this.selectedShowHoldingBody = shb;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete show holding body
   */
  deleteShowHoldingBody() {
    if (this.selectedShowHoldingBody) {
      this.service.deleteShowHoldingBody(this.selectedShowHoldingBody.id).subscribe(() => {
        console.log('Show Holding Body deleted successfully');
        this.modalService.dismissAll();
        this.selectedShowHoldingBody = null;
      });
    }
  }
}

