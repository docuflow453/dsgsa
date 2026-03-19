/**
 * VAT Code Detail Component
 * Displays detailed information about a VAT code
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Shared Module
import { SharedModule } from '../../../../../theme/shared/shared.module';

// Types and Data
import { VATCode } from './vat-codes-list-type';
import { VAT_CODES } from './vat-codes-list-data';

@Component({
  selector: 'app-vat-code-detail',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './vat-code-detail.component.html',
  styleUrl: './vat-code-detail.component.scss'
})
export class VATCodeDetailComponent implements OnInit {
  vatCode: VATCode | null = null;
  vatCodeId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vatCodeId = +id;
      this.loadVATCodeData();
    }
  }

  /**
   * Load VAT code data
   */
  loadVATCodeData() {
    this.vatCode = VAT_CODES.find((c) => c.id === this.vatCodeId) || null;
    if (!this.vatCode) {
      this.router.navigate(['/admin/settings/vat-codes']);
    }
  }

  /**
   * Navigate to edit page
   */
  editVATCode() {
    this.router.navigate(['/admin/settings/vat-codes', this.vatCodeId, 'edit']);
  }

  /**
   * Navigate back to list
   */
  goBack() {
    this.router.navigate(['/admin/settings/vat-codes']);
  }

  /**
   * Open delete modal
   */
  openDeleteModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  /**
   * Delete VAT code
   */
  deleteVATCode() {
    const index = VAT_CODES.findIndex((c) => c.id === this.vatCodeId);
    if (index > -1) {
      VAT_CODES.splice(index, 1);
      this.modalService.dismissAll();
      this.router.navigate(['/admin/settings/vat-codes']);
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

