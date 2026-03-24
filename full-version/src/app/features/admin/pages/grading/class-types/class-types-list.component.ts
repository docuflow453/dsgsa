/**
 * Class Types List Component
 * Displays all competition class types in the system with search, filter, sort, and action capabilities
 */

import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DecimalPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs';

// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ClassType } from './class-types-list-type';
import { ClassTypesListService } from './class-types-list.service';

// NgBootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-class-types-list',
  standalone: true,
  imports: [SharedModule, RouterModule, CurrencyPipe],
  templateUrl: './class-types-list.component.html',
  styleUrl: './class-types-list.component.scss',
  providers: [ClassTypesListService, DecimalPipe]
})
export class ClassTypesListComponent implements OnInit {
  service = inject(ClassTypesListService);
  private modalService = inject(NgbModal);
  private router = inject(Router);

  // Public props
  classTypes$: Observable<ClassType[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  // Filter options
  statuses: string[] = ['Active', 'Inactive'];
  categories: string[] = [];

  // Selected class type for actions
  selectedClassType: ClassType | null = null;

  // Constructor
  constructor() {
    this.classTypes$ = this.service.classTypes$;
    this.total$ = this.service.total$;
    this.loading$ = this.service.loading$;
  }

  ngOnInit(): void {
    // Load filter options
    this.categories = this.service.getUniqueCategories();
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
   * Get category badge class
   */
  getCategoryClass(category: string): string {
    switch (category) {
      case 'Dressage':
        return 'badge bg-light-primary';
      case 'Show Jumping':
        return 'badge bg-light-danger';
      case 'Eventing':
        return 'badge bg-light-warning';
      case 'Combined Training':
        return 'badge bg-light-info';
      case 'Working Equitation':
        return 'badge bg-light-success';
      default:
        return 'badge bg-light-secondary';
    }
  }

  /**
   * Get class type badge style based on color
   */
  getClassTypeBadgeStyle(classType: ClassType): any {
    return {
      'background-color': classType.color || '#6c757d',
      'color': '#fff',
      'padding': '0.35rem 0.65rem',
      'border-radius': '0.25rem',
      'font-weight': '500'
    };
  }

  /**
   * Navigate to create page
   */
  createClassType(): void {
    this.router.navigate(['/admin/grading/class-types/create']);
  }

  /**
   * View class type details
   */
  viewClassType(classType: ClassType): void {
    this.router.navigate(['/admin/grading/class-types', classType.id]);
  }

  /**
   * Edit class type
   */
  editClassType(classType: ClassType): void {
    this.router.navigate(['/admin/grading/class-types', classType.id, 'edit']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any, classType: ClassType): void {
    this.selectedClassType = classType;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete class type
   */
  deleteClassType(): void {
    if (this.selectedClassType) {
      this.service.deleteClassType(this.selectedClassType.id);
      this.modalService.dismissAll();
      this.selectedClassType = null;
    }
  }

  /**
   * Reset filters
   */
  resetFilters(): void {
    this.service.resetFilters();
  }
}

