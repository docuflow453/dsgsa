/**
 * Judge Detail Component
 * Displays detailed information about a specific judge
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Types and Data
import { Judge } from './judges-list-type';
import { JUDGES } from './judges-list-data';

@Component({
  selector: 'app-judge-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, DatePipe],
  templateUrl: './judge-detail.component.html',
  styleUrl: './judge-detail.component.scss'
})
export class JudgeDetailComponent implements OnInit {
  judge: Judge | null = null;
  judgeId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    // Get judge ID from route
    this.route.params.subscribe((params) => {
      this.judgeId = +params['id'];
      this.loadJudge();
    });
  }

  /**
   * Load judge data
   */
  loadJudge() {
    this.judge = JUDGES.find((j) => j.id === this.judgeId) || null;
    
    if (!this.judge) {
      console.error('Judge not found');
      this.router.navigate(['/admin/judges']);
    }
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
   * Get judge type badge class
   */
  getJudgeTypeClass(judgeType: string): string {
    const typeClasses: { [key: string]: string } = {
      International: 'badge bg-light-danger',
      National: 'badge bg-light-primary',
      Candidate: 'badge bg-light-warning',
      Apprentice: 'badge bg-light-info'
    };
    return typeClasses[judgeType] || 'badge bg-light-secondary';
  }

  /**
   * Navigate to edit page
   */
  editJudge() {
    this.router.navigate(['/admin/judges', this.judgeId, 'edit']);
  }

  /**
   * Navigate back to list
   */
  goBack() {
    this.router.navigate(['/admin/judges']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete judge
   */
  deleteJudge() {
    const index = JUDGES.findIndex((j) => j.id === this.judgeId);
    if (index > -1) {
      JUDGES.splice(index, 1);
      this.modalService.dismissAll();
      this.router.navigate(['/admin/judges']);
    }
  }

  /**
   * Get full name
   */
  getFullName(): string {
    return this.judge ? `${this.judge.firstName} ${this.judge.lastName}` : '';
  }
}

