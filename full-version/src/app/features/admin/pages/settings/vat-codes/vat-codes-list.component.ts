/**
 * VAT Codes List Component
 * Displays and manages VAT/tax codes
 */

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Data
import { VATCode } from './vat-codes-list-type';
import { VAT_CODES } from './vat-codes-list-data';
import { VATCodesListService } from './vat-codes-list.service';

@Component({
  selector: 'app-vat-codes-list',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule],
  templateUrl: './vat-codes-list.component.html',
  styleUrl: './vat-codes-list.component.scss'
})
export class VATCodesListComponent implements OnInit {
  vatCodes: VATCode[] = [];
  filteredVATCodes: VATCode[] = [];
  searchText = '';
  selectedVATCode: VATCode | null = null;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private vatCodesService: VATCodesListService
  ) {}

  ngOnInit() {
    this.loadVATCodes();
  }

  /**
   * Load VAT codes data
   */
  loadVATCodes() {
    this.vatCodesService.getVATCodes().subscribe((data) => {
      this.vatCodes = data;
      this.filteredVATCodes = data;
    });
  }

  /**
   * Filter VAT codes based on search text
   */
  filterVATCodes() {
    if (!this.searchText) {
      this.filteredVATCodes = this.vatCodes;
      return;
    }

    const searchLower = this.searchText.toLowerCase();
    this.filteredVATCodes = this.vatCodes.filter(
      (code) =>
        code.code.toLowerCase().includes(searchLower) ||
        code.name.toLowerCase().includes(searchLower) ||
        code.description.toLowerCase().includes(searchLower) ||
        code.status.toLowerCase().includes(searchLower)
    );
  }

  /**
   * Navigate to create page
   */
  createVATCode() {
    this.router.navigate(['/admin/settings/vat-codes/create']);
  }

  /**
   * View VAT code details
   */
  viewVATCode(code: VATCode) {
    this.router.navigate(['/admin/settings/vat-codes', code.id]);
  }

  /**
   * Edit VAT code
   */
  editVATCode(code: VATCode) {
    this.router.navigate(['/admin/settings/vat-codes', code.id, 'edit']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any, code: VATCode) {
    this.selectedVATCode = code;
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete VAT code
   */
  deleteVATCode() {
    if (this.selectedVATCode) {
      const index = VAT_CODES.findIndex((c) => c.id === this.selectedVATCode!.id);
      if (index > -1) {
        VAT_CODES.splice(index, 1);
        this.loadVATCodes();
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
        return 'bg-light-secondary';
      default:
        return 'bg-light-secondary';
    }
  }
}

