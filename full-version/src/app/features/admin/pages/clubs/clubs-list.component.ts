/**
 * Clubs List Component
 * Displays and manages the list of Clubs in the system
 */

import { Component, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Service and Types
import { ClubsListService } from './clubs-list.service';
import { Club } from './clubs-list-type';

@Component({
  selector: 'app-clubs-list',
  standalone: true,
  imports: [SharedModule, RouterModule, DatePipe],
  templateUrl: './clubs-list.component.html',
  styleUrl: './clubs-list.component.scss',
  providers: [ClubsListService, DecimalPipe]
})
export class ClubsListComponent implements OnInit {
  clubs$: Observable<Club[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  selectedClub: Club | null = null;

  // Filter options
  provinces: string[] = [];
  statuses: string[] = [];

  constructor(
    public service: ClubsListService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.clubs$ = service.clubs$;
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
  createClub() {
    this.router.navigate(['/admin/clubs/create']);
  }

  /**
   * View club details
   */
  viewClub(club: Club) {
    this.router.navigate(['/admin/clubs', club.id]);
  }

  /**
   * Edit club
   */
  editClub(club: Club) {
    this.router.navigate(['/admin/clubs', club.id, 'edit']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any, club: Club) {
    this.selectedClub = club;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete club
   */
  deleteClub() {
    if (this.selectedClub) {
      this.service.deleteClub(this.selectedClub.id).subscribe(() => {
        console.log('Club deleted successfully');
        this.modalService.dismissAll();
        this.selectedClub = null;
      });
    }
  }
}

