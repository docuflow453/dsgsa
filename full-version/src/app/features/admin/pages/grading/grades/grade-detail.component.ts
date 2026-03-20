/**
 * Grade Detail Component
 * Displays detailed information about a specific grade
 */

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Grade } from './grades-list-type';
import { GRADES } from './grades-list-data';

// NgBootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-grade-detail',
  standalone: true,
  imports: [SharedModule, RouterModule, DatePipe],
  templateUrl: './grade-detail.component.html',
  styleUrl: './grade-detail.component.scss'
})
export class GradeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(NgbModal);

  grade: Grade | null = null;
  loading = false;

  ngOnInit(): void {
    this.loadGrade();
  }

  /**
   * Load grade data
   */
  loadGrade(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.grade = GRADES.find((g) => g.id === id) || null;
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
   * Get level badge style
   */
  getLevelBadgeStyle(grade: Grade): any {
    return {
      'background-color': grade.color || '#6c757d',
      'color': '#fff',
      'padding': '0.5rem 1rem',
      'border-radius': '0.25rem',
      'font-weight': '500',
      'font-size': '1rem'
    };
  }

  /**
   * Navigate back to list
   */
  goBack(): void {
    this.router.navigate(['/admin/grading/grades']);
  }

  /**
   * Edit grade
   */
  editGrade(): void {
    if (this.grade) {
      this.router.navigate(['/admin/grading/grades', this.grade.id, 'edit']);
    }
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any): void {
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete grade
   */
  deleteGrade(): void {
    if (this.grade) {
      const index = GRADES.findIndex((g) => g.id === this.grade!.id);
      if (index > -1) {
        GRADES.splice(index, 1);
        this.modalService.dismissAll();
        this.goBack();
      }
    }
  }
}

