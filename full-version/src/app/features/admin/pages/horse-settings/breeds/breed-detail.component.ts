/**
 * Breed Detail Component
 * Displays detailed information about a horse breed
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Data
import { Breed } from './breeds-list-type';
import { BREEDS } from './breeds-list-data';

@Component({
  selector: 'app-breed-detail',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule],
  templateUrl: './breed-detail.component.html',
  styleUrl: './breed-detail.component.scss'
})
export class BreedDetailComponent implements OnInit {
  breed: Breed | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadBreed();
  }

  /**
   * Load breed details
   */
  loadBreed() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      // Simulate API call
      setTimeout(() => {
        this.breed = BREEDS.find(b => b.id === parseInt(id, 10)) || null;
        this.loading = false;
      }, 300);
    }
  }

  /**
   * Navigate to edit page
   */
  editBreed() {
    if (this.breed) {
      this.router.navigate(['/admin/horse-settings/breeds', this.breed.id, 'edit']);
    }
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete breed
   */
  deleteBreed() {
    if (this.breed) {
      console.log('Deleting breed:', this.breed);
      // TODO: Implement actual delete logic
      this.modalService.dismissAll();
      this.router.navigate(['/admin/horse-settings/breeds']);
    }
  }

  /**
   * Go back to list
   */
  goBack() {
    this.router.navigate(['/admin/horse-settings/breeds']);
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

