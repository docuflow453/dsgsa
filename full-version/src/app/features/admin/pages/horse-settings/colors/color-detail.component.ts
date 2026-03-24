/**
 * Color Detail Component
 * Displays detailed information about a horse color
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Data
import { Color } from './colors-list-type';
import { COLORS } from './colors-list-data';

@Component({
  selector: 'app-color-detail',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule],
  templateUrl: './color-detail.component.html',
  styleUrl: './color-detail.component.scss'
})
export class ColorDetailComponent implements OnInit {
  color: Color | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadColor();
  }

  /**
   * Load color details
   */
  loadColor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      // Simulate API call
      setTimeout(() => {
        this.color = COLORS.find(c => c.id === parseInt(id, 10)) || null;
        this.loading = false;
      }, 300);
    }
  }

  /**
   * Navigate to edit page
   */
  editColor() {
    if (this.color) {
      this.router.navigate(['/admin/horse-settings/colors', this.color.id, 'edit']);
    }
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete color
   */
  deleteColor() {
    if (this.color) {
      console.log('Deleting color:', this.color);
      // TODO: Implement actual delete logic
      this.modalService.dismissAll();
      this.router.navigate(['/admin/horse-settings/colors']);
    }
  }

  /**
   * Go back to list
   */
  goBack() {
    this.router.navigate(['/admin/horse-settings/colors']);
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

