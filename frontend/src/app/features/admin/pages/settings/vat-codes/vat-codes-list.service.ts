/**
 * VAT Codes List Service
 * Service for managing VAT codes data
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { VATCode } from './vat-codes-list-type';
import { VAT_CODES } from './vat-codes-list-data';

@Injectable({
  providedIn: 'root'
})
export class VATCodesListService {
  /**
   * Get all VAT codes
   */
  getVATCodes(): Observable<VATCode[]> {
    return of(VAT_CODES);
  }

  /**
   * Get VAT code by ID
   */
  getVATCodeById(id: number): Observable<VATCode | undefined> {
    return of(VAT_CODES.find((code) => code.id === id));
  }

  /**
   * Get default VAT code
   */
  getDefaultVATCode(): Observable<VATCode | undefined> {
    return of(VAT_CODES.find((code) => code.isDefault));
  }
}

