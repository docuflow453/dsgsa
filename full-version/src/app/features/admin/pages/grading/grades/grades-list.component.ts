/**
 * Grades List Component
 * Displays all dressage grades in the system with search, filter, sort, and action capabilities
 */

import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Grade } from './grades-list-type';
import { GradesListService } from './grades-list.service';

// NgBootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-grades-list',
  standalone: true,
  imports: [SharedModule, RouterModule, DatePipe],
  templateUrl: './grades-list.component.html',
  styleUrl: './grades-list.component.scss',
  providers: [GradesListService, DecimalPipe]
})
export class GradesListComponent implements OnInit {
  service = inject(GradesListService);
  private modalService = inject(NgbModal);
  private router = inject(Router);

  // Public props
  grades$: Observable<Grade[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  // Filter options
  statuses: string[] = ['Active', 'Inactive'];
  levels: string[] = [];

  // Selected grade for actions
  selectedGrade: Grade | null = null;

  // Constructor
  constructor() {
    this.grades$ = this.service.grades$;
    this.total$ = this.service.total$;
    this.loading$ = this.service.loading$;
  }

  ngOnInit(): void {
    // Load filter options
    this.levels = this.service.getUniqueLevels();
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
   * Get level badge class based on color
   */
  getLevelBadgeStyle(grade: Grade): any {
    return {
      'background-color': grade.color || '#6c757d',
      'color': '#fff',
      'padding': '0.35rem 0.65rem',
      'border-radius': '0.25rem',
      'font-weight': '500'
    };
  }

  /**
   * Navigate to create page
   */
  createGrade(): void {
    this.router.navigate(['/admin/grading/grades/create']);
  }

  /**
   * View grade details
   */
  viewGrade(grade: Grade): void {
    this.router.navigate(['/admin/grading/grades', grade.id]);
  }

  /**
   * Edit grade
   */
  editGrade(grade: Grade): void {
    this.router.navigate(['/admin/grading/grades', grade.id, 'edit']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any, grade: Grade): void {
    this.selectedGrade = grade;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete grade
   */
  deleteGrade(): void {
    if (this.selectedGrade) {
      this.service.deleteGrade(this.selectedGrade.id);
      this.modalService.dismissAll();
      this.selectedGrade = null;
    }
  }

  /**
   * Reset filters
   */
  resetFilters(): void {
    this.service.resetFilters();
  }
}

