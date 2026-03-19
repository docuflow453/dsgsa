/**
 * Year Detail Component
 * Displays detailed information about a year
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Data
import { Year } from './years-list-type';
import { YEARS } from './years-list-data';

@Component({
  selector: 'app-year-detail',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './year-detail.component.html',
  styleUrl: './year-detail.component.scss'
})
export class YearDetailComponent implements OnInit {
  year: Year | null = null;
  yearId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.yearId = +id;
      this.loadYearData();
    }
  }

  /**
   * Load year data
   */
  loadYearData() {
    this.year = YEARS.find((y) => y.id === this.yearId) || null;
    if (!this.year) {
      this.router.navigate(['/admin/settings/years']);
    }
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
    const index = YEARS.findIndex((y) => y.id === this.yearId);
    if (index > -1) {
      YEARS.splice(index, 1);
      this.modalService.dismissAll();
      this.router.navigate(['/admin/settings/years']);
    }
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-light-success';
      case 'Inactive':
        return 'bg-light-warning';
      case 'Archived':
        return 'bg-light-secondary';
      default:
        return 'bg-light-secondary';
    }
  }
}

