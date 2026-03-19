/**
 * Judges List Component
 * Displays and manages the list of Judges in the system
 */

import { Component, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Service and Types
import { JudgesListService } from './judges-list.service';
import { Judge } from './judges-list-type';

@Component({
  selector: 'app-judges-list',
  standalone: true,
  imports: [SharedModule, RouterModule, DatePipe],
  templateUrl: './judges-list.component.html',
  styleUrl: './judges-list.component.scss',
  providers: [JudgesListService, DecimalPipe]
})
export class JudgesListComponent implements OnInit {
  judges$: Observable<Judge[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  selectedJudge: Judge | null = null;

  // Filter options
  statuses: string[] = [];

  constructor(
    public service: JudgesListService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.judges$ = service.judges$;
    this.total$ = service.total$;
    this.loading$ = service.loading$;
  }

  ngOnInit() {
    // Load filter options
    this.statuses = this.service.getUniqueStatuses();
  }

  /**
   * Get full name
   */
  getFullName(judge: Judge): string {
    return `${judge.firstName} ${judge.lastName}`;
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
  getJudgeTypeClass(type: string): string {
    const typeClasses: { [key: string]: string } = {
      International: 'badge bg-light-primary',
      National: 'badge bg-light-info',
      Candidate: 'badge bg-light-warning',
      Apprentice: 'badge bg-light-secondary'
    };
    return typeClasses[type] || 'badge bg-light-secondary';
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
  createJudge() {
    this.router.navigate(['/admin/judges/create']);
  }

  /**
   * View judge details
   */
  viewJudge(judge: Judge) {
    this.router.navigate(['/admin/judges', judge.id]);
  }

  /**
   * Edit judge
   */
  editJudge(judge: Judge) {
    this.router.navigate(['/admin/judges', judge.id, 'edit']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any, judge: Judge) {
    this.selectedJudge = judge;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete judge
   */
  deleteJudge() {
    if (this.selectedJudge) {
      this.service.deleteJudge(this.selectedJudge.id).subscribe(() => {
        console.log('Judge deleted successfully');
        this.modalService.dismissAll();
        this.selectedJudge = null;
      });
    }
  }
}

