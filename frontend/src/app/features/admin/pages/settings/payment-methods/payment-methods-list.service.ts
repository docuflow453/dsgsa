/**
 * Payment Methods List Service
 * Handles data operations for payment methods
 */

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { PaymentMethod } from './payment-methods-list-type';
import { PAYMENT_METHODS } from './payment-methods-list-data';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodsListService {
  /**
   * Get all payment methods
   * In production, this would call the backend API
   */
  getPaymentMethods(): Observable<PaymentMethod[]> {
    // Simulate API call with delay
    return of(PAYMENT_METHODS).pipe(delay(300));
  }

  /**
   * Get payment method by ID
   */
  getPaymentMethodById(id: number): Observable<PaymentMethod | undefined> {
    const paymentMethod = PAYMENT_METHODS.find(pm => pm.id === id);
    return of(paymentMethod).pipe(delay(200));
  }

  /**
   * Create new payment method
   */
  createPaymentMethod(paymentMethod: Partial<PaymentMethod>): Observable<PaymentMethod> {
    const newPaymentMethod: PaymentMethod = {
      id: Math.max(...PAYMENT_METHODS.map(pm => pm.id)) + 1,
      name: paymentMethod.name || '',
      code: paymentMethod.code || '',
      description: paymentMethod.description || '',
      processingFee: paymentMethod.processingFee || 0,
      status: paymentMethod.isActive ? 'Active' : 'Inactive',
      isActive: paymentMethod.isActive || false,
      allowForEntries: paymentMethod.allowForEntries || false,
      allowForRenewals: paymentMethod.allowForRenewals || false,
      dateCreated: new Date(),
      notes: paymentMethod.notes
    };
    
    PAYMENT_METHODS.push(newPaymentMethod);
    return of(newPaymentMethod).pipe(delay(300));
  }

  /**
   * Update existing payment method
   */
  updatePaymentMethod(id: number, paymentMethod: Partial<PaymentMethod>): Observable<PaymentMethod> {
    const index = PAYMENT_METHODS.findIndex(pm => pm.id === id);
    if (index !== -1) {
      PAYMENT_METHODS[index] = {
        ...PAYMENT_METHODS[index],
        ...paymentMethod,
        status: paymentMethod.isActive ? 'Active' : 'Inactive',
        dateUpdated: new Date()
      };
      return of(PAYMENT_METHODS[index]).pipe(delay(300));
    }
    throw new Error('Payment method not found');
  }

  /**
   * Delete payment method
   */
  deletePaymentMethod(id: number): Observable<boolean> {
    const index = PAYMENT_METHODS.findIndex(pm => pm.id === id);
    if (index !== -1) {
      PAYMENT_METHODS.splice(index, 1);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  /**
   * Toggle payment method active status
   */
  toggleActiveStatus(id: number): Observable<PaymentMethod> {
    const index = PAYMENT_METHODS.findIndex(pm => pm.id === id);
    if (index !== -1) {
      PAYMENT_METHODS[index].isActive = !PAYMENT_METHODS[index].isActive;
      PAYMENT_METHODS[index].status = PAYMENT_METHODS[index].isActive ? 'Active' : 'Inactive';
      PAYMENT_METHODS[index].dateUpdated = new Date();
      return of(PAYMENT_METHODS[index]).pipe(delay(200));
    }
    throw new Error('Payment method not found');
  }

  /**
   * Get active payment methods for entries
   */
  getActivePaymentMethodsForEntries(): Observable<PaymentMethod[]> {
    const filtered = PAYMENT_METHODS.filter(pm => pm.isActive && pm.allowForEntries);
    return of(filtered).pipe(delay(200));
  }

  /**
   * Get active payment methods for renewals
   */
  getActivePaymentMethodsForRenewals(): Observable<PaymentMethod[]> {
    const filtered = PAYMENT_METHODS.filter(pm => pm.isActive && pm.allowForRenewals);
    return of(filtered).pipe(delay(200));
  }
}

