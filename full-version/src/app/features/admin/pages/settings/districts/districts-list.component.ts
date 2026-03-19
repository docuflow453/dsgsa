/**
 * Districts List Component
 * Displays all districts/regions in the system with search, filter, sort, and action capabilities
 */

import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { District } from './districts-list-type';
import { DistrictsListService } from './districts-list.service';

// NgBootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-districts-list',
  standalone: true,
  imports: [SharedModule, RouterModule, DatePipe],
  templateUrl: './districts-list.component.html',
  styleUrl: './districts-list.component.scss',
  providers: [DistrictsListService, DecimalPipe]
})
export class DistrictsListComponent implements OnInit {
  service = inject(DistrictsListService);
  private modalService = inject(NgbModal);
  private router = inject(Router);

  // Public props
  districts$: Observable<District[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  // Filter options
  statuses: string[] = ['Active', 'Inactive'];
  provinces: string[] = [];

  // Selected district for actions
  selectedDistrict: District | null = null;

  // Constructor
  constructor() {
    this.districts$ = this.service.districts$;
    this.total$ = this.service.total$;
    this.loading$ = this.service.loading$;
  }

  ngOnInit(): void {
    // Load filter options
    this.provinces = this.service.getUniqueProvinces();
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
   * Navigate to create page
   */
  createDistrict(): void {
    this.router.navigate(['/admin/settings/districts/create']);
  }

  /**
   * View district details
   */
  viewDistrict(district: District): void {
    this.router.navigate(['/admin/settings/districts', district.id]);
  }

  /**
   * Edit district
   */
  editDistrict(district: District): void {
    this.router.navigate(['/admin/settings/districts', district.id, 'edit']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any, district: District): void {
    this.selectedDistrict = district;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete district
   */
  deleteDistrict(): void {
    if (this.selectedDistrict) {
      this.service.deleteDistrict(this.selectedDistrict.id);
      this.modalService.dismissAll();
      this.selectedDistrict = null;
    }
  }

  /**
   * Reset filters
   */
  resetFilters(): void {
    this.service.resetFilters();
  }
}

