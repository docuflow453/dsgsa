/**
 * Horses List Component
 * Displays and manages the list of Horses in the system
 */

import { Component, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../theme/shared/shared.module';

// Service and Types
import { HorsesListService } from './horses-list.service';
import { Horse } from './horses-list-type';

@Component({
  selector: 'app-horses-list',
  standalone: true,
  imports: [SharedModule, RouterModule, DatePipe],
  templateUrl: './horses-list.component.html',
  styleUrl: './horses-list.component.scss',
  providers: [HorsesListService, DecimalPipe]
})
export class HorsesListComponent implements OnInit {
  horses$: Observable<Horse[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  selectedHorse: Horse | null = null;

  // Filter options
  statuses: string[] = [];

  constructor(
    public service: HorsesListService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.horses$ = service.horses$;
    this.total$ = service.total$;
    this.loading$ = service.loading$;
  }

  ngOnInit() {
    // Load filter options
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
   * Calculate age from date of birth
   */
  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
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
  createHorse() {
    this.router.navigate(['/admin/horses/create']);
  }

  /**
   * View horse details
   */
  viewHorse(horse: Horse) {
    this.router.navigate(['/admin/horses', horse.id]);
  }

  /**
   * Edit horse
   */
  editHorse(horse: Horse) {
    this.router.navigate(['/admin/horses', horse.id, 'edit']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any, horse: Horse) {
    this.selectedHorse = horse;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete horse
   */
  deleteHorse() {
    if (this.selectedHorse) {
      this.service.deleteHorse(this.selectedHorse.id).subscribe(() => {
        console.log('Horse deleted successfully');
        this.modalService.dismissAll();
        this.selectedHorse = null;
      });
    }
  }
}

