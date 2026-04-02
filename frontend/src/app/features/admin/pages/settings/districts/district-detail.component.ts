/**
 * District Detail Component
 * Displays detailed information about a specific district
 */

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DatePipe, Location } from '@angular/common';

// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { District } from './districts-list-type';
import { DISTRICTS } from './districts-list-data';

// NgBootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-district-detail',
  standalone: true,
  imports: [SharedModule, RouterModule, DatePipe],
  templateUrl: './district-detail.component.html',
  styleUrl: './district-detail.component.scss'
})
export class DistrictDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private modalService = inject(NgbModal);

  district: District | null = null;
  loading = true;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDistrict(id);
  }

  /**
   * Load district data
   */
  loadDistrict(id: number): void {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.district = DISTRICTS.find((d) => d.id === id) || null;
      this.loading = false;
    }, 300);
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
   * Navigate back
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Edit district
   */
  editDistrict(): void {
    if (this.district) {
      this.router.navigate(['/admin/settings/districts', this.district.id, 'edit']);
    }
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any): void {
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete district
   */
  deleteDistrict(): void {
    if (this.district) {
      const index = DISTRICTS.findIndex((d) => d.id === this.district!.id);
      if (index > -1) {
        DISTRICTS.splice(index, 1);
        this.modalService.dismissAll();
        this.router.navigate(['/admin/settings/districts']);
      }
    }
  }
}

