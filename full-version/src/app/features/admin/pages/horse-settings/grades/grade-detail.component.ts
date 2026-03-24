/**
 * Grade Detail Component
 * Displays detailed information about a horse grade
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Data
import { Grade } from './grades-list-type';
import { GRADES } from './grades-list-data';

@Component({
  selector: 'app-grade-detail',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule],
  templateUrl: './grade-detail.component.html',
  styleUrl: './grade-detail.component.scss'
})
export class GradeDetailComponent implements OnInit {
  grade: Grade | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadGrade();
  }

  /**
   * Load grade details
   */
  loadGrade() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      // Simulate API call
      setTimeout(() => {
        this.grade = GRADES.find(g => g.id === parseInt(id, 10)) || null;
        this.loading = false;
      }, 300);
    }
  }

  /**
   * Navigate to edit page
   */
  editGrade() {
    if (this.grade) {
      this.router.navigate(['/admin/horse-settings/grades', this.grade.id, 'edit']);
    }
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete grade
   */
  deleteGrade() {
    if (this.grade) {
      console.log('Deleting grade:', this.grade);
      // TODO: Implement actual delete logic
      this.modalService.dismissAll();
      this.router.navigate(['/admin/horse-settings/grades']);
    }
  }

  /**
   * Go back to list
   */
  goBack() {
    this.router.navigate(['/admin/horse-settings/grades']);
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    return status === 'Active' ? 'bg-success' : 'bg-secondary';
  }

  /**
   * Format date
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

