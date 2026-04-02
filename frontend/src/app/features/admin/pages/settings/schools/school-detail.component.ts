/**
 * School Detail Component
 * Displays detailed information about a school
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Data
import { School } from './schools-list-type';
import { SCHOOLS } from './schools-list-data';

@Component({
  selector: 'app-school-detail',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './school-detail.component.html',
  styleUrl: './school-detail.component.scss'
})
export class SchoolDetailComponent implements OnInit {
  school: School | null = null;
  schoolId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.schoolId = +id;
      this.loadSchoolData();
    }
  }

  /**
   * Load school data
   */
  loadSchoolData() {
    this.school = SCHOOLS.find((s) => s.id === this.schoolId) || null;
    if (!this.school) {
      this.router.navigate(['/admin/settings/schools']);
    }
  }

  /**
   * Navigate to edit page
   */
  editSchool() {
    this.router.navigate(['/admin/settings/schools', this.schoolId, 'edit']);
  }

  /**
   * Navigate back to list
   */
  goBack() {
    this.router.navigate(['/admin/settings/schools']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete school
   */
  deleteSchool() {
    const index = SCHOOLS.findIndex((s) => s.id === this.schoolId);
    if (index > -1) {
      SCHOOLS.splice(index, 1);
      this.modalService.dismissAll();
      this.router.navigate(['/admin/settings/schools']);
    }
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-light-success';
      case 'Inactive':
        return 'bg-light-secondary';
      default:
        return 'bg-light-secondary';
    }
  }

  /**
   * Get type badge class
   */
  getTypeClass(type: string): string {
    switch (type) {
      case 'Riding School':
        return 'bg-light-primary';
      case 'Training Center':
        return 'bg-light-info';
      case 'Equestrian Club':
        return 'bg-light-success';
      case 'Private Facility':
        return 'bg-light-warning';
      case 'Competition Venue':
        return 'bg-light-danger';
      default:
        return 'bg-light-secondary';
    }
  }
}

