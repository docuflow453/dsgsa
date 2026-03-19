/**
 * Years List Component
 * Displays and manages competition years/seasons
 */

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Data
import { Year } from './years-list-type';
import { YEARS } from './years-list-data';
import { YearsListService } from './years-list.service';

@Component({
  selector: 'app-years-list',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule],
  templateUrl: './years-list.component.html',
  styleUrl: './years-list.component.scss'
})
export class YearsListComponent implements OnInit {
  years: Year[] = [];
  filteredYears: Year[] = [];
  searchText = '';
  selectedYear: Year | null = null;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private yearsService: YearsListService
  ) {}

  ngOnInit() {
    this.loadYears();
  }

  /**
   * Load years data
   */
  loadYears() {
    this.yearsService.getYears().subscribe((data) => {
      this.years = data;
      this.filteredYears = data;
    });
  }

  /**
   * Filter years based on search text
   */
  filterYears() {
    if (!this.searchText) {
      this.filteredYears = this.years;
      return;
    }

    const searchLower = this.searchText.toLowerCase();
    this.filteredYears = this.years.filter(
      (year) =>
        year.year.toString().includes(searchLower) ||
        year.name.toLowerCase().includes(searchLower) ||
        year.description.toLowerCase().includes(searchLower) ||
        year.status.toLowerCase().includes(searchLower)
    );
  }

  /**
   * Navigate to create page
   */
  createYear() {
    this.router.navigate(['/admin/settings/years/create']);
  }

  /**
   * View year details
   */
  viewYear(year: Year) {
    this.router.navigate(['/admin/settings/years', year.id]);
  }

  /**
   * Edit year
   */
  editYear(year: Year) {
    this.router.navigate(['/admin/settings/years', year.id, 'edit']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any, year: Year) {
    this.selectedYear = year;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete year
   */
  deleteYear() {
    if (this.selectedYear) {
      const index = YEARS.findIndex((y) => y.id === this.selectedYear!.id);
      if (index > -1) {
        YEARS.splice(index, 1);
        this.loadYears();
        this.modalService.dismissAll();
      }
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
        return 'bg-light-warning';
      case 'Archived':
        return 'bg-light-secondary';
      default:
        return 'bg-light-secondary';
    }
  }
}

