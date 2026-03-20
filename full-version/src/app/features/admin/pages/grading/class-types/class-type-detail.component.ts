/**
 * Class Type Detail Component
 * Displays detailed information about a specific class type
 */

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';

// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ClassType } from './class-types-list-type';
import { CLASS_TYPES } from './class-types-list-data';

// NgBootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-class-type-detail',
  standalone: true,
  imports: [SharedModule, RouterModule, DatePipe, CurrencyPipe],
  templateUrl: './class-type-detail.component.html',
  styleUrl: './class-type-detail.component.scss'
})
export class ClassTypeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(NgbModal);

  classType: ClassType | null = null;
  loading = false;

  ngOnInit(): void {
    this.loadClassType();
  }

  /**
   * Load class type data
   */
  loadClassType(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.classType = CLASS_TYPES.find((ct) => ct.id === id) || null;
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
   * Get class type badge style
   */
  getClassTypeBadgeStyle(classType: ClassType): any {
    return {
      'background-color': classType.color || '#6c757d',
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
    this.router.navigate(['/admin/grading/class-types']);
  }

  /**
   * Edit class type
   */
  editClassType(): void {
    if (this.classType) {
      this.router.navigate(['/admin/grading/class-types', this.classType.id, 'edit']);
    }
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any): void {
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete class type
   */
  deleteClassType(): void {
    if (this.classType) {
      const index = CLASS_TYPES.findIndex((ct) => ct.id === this.classType!.id);
      if (index > -1) {
        CLASS_TYPES.splice(index, 1);
        this.modalService.dismissAll();
        this.goBack();
      }
    }
  }
}

