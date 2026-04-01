/**
 * Years List Service
 * Service for managing years data
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Year } from './years-list-type';
import { YEARS } from './years-list-data';

@Injectable({
  providedIn: 'root'
})
export class YearsListService {
  /**
   * Get all years
   */
  getYears(): Observable<Year[]> {
    return of(YEARS);
  }

  /**
   * Get year by ID
   */
  getYearById(id: number): Observable<Year | undefined> {
    return of(YEARS.find((year) => year.id === id));
  }

  /**
   * Get current year
   */
  getCurrentYear(): Observable<Year | undefined> {
    return of(YEARS.find((year) => year.isCurrent));
  }
}

