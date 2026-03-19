/**
 * Schools List Component
 * Displays all schools/training facilities in the system with search, filter, sort, and action capabilities
 */

import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { School } from './schools-list-type';
import { SchoolsListService } from './schools-list.service';

// NgBootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-schools-list',
  standalone: true,
  imports: [SharedModule, RouterModule, DatePipe],
  templateUrl: './schools-list.component.html',
  styleUrl: './schools-list.component.scss',
  providers: [SchoolsListService, DecimalPipe]
})
export class SchoolsListComponent implements OnInit {
  service = inject(SchoolsListService);
  private modalService = inject(NgbModal);
  private router = inject(Router);

  // Public props
  schools$: Observable<School[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  // Filter options
  statuses: string[] = ['Active', 'Inactive'];
  types: string[] = [];
  provinces: string[] = [];

  // Selected school for actions
  selectedSchool: School | null = null;

  // Constructor
  constructor() {
    this.schools$ = this.service.schools$;
    this.total$ = this.service.total$;
    this.loading$ = this.service.loading$;
  }

  ngOnInit(): void {
    // Load filter options
    this.types = this.service.getUniqueTypes();
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
   * Get type badge class
   */
  getTypeClass(type: string): string {
    switch (type) {
      case 'Riding School':
        return 'badge bg-light-primary';
      case 'Training Center':
        return 'badge bg-light-info';
      case 'Equestrian Club':
        return 'badge bg-light-success';
      case 'Private Facility':
        return 'badge bg-light-warning';
      case 'Competition Venue':
        return 'badge bg-light-danger';
      default:
        return 'badge bg-light-secondary';
    }
  }

  /**
   * Navigate to create page
   */
  createSchool(): void {
    this.router.navigate(['/admin/settings/schools/create']);
  }

  /**
   * View school details
   */
  viewSchool(school: School): void {
    this.router.navigate(['/admin/settings/schools', school.id]);
  }

  /**
   * Edit school
   */
  editSchool(school: School): void {
    this.router.navigate(['/admin/settings/schools', school.id, 'edit']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any, school: School): void {
    this.selectedSchool = school;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete school
   */
  deleteSchool(): void {
    if (this.selectedSchool) {
      this.service.deleteSchool(this.selectedSchool.id);
      this.modalService.dismissAll();
      this.selectedSchool = null;
    }
  }

  /**
   * Reset filters
   */
  resetFilters(): void {
    this.service.resetFilters();
  }
}

