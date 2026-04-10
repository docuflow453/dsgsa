/**
 * Years List Service
 * Service for managing years data via Django backend API
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Year, YearListResponse, YearCreatePayload, YearUpdatePayload } from './years-list-type';
import {environment} from "../../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class YearsListService {
  private readonly apiUrl = `${environment.apiUrl}/years`;

  constructor(private http: HttpClient) {}

  /**
   * Get all years with optional filtering
   */
  getYears(params?: {
    status?: string;
    year?: number;
    is_registration_open?: boolean;
    limit?: number;
    offset?: number;
  }): Observable<YearListResponse> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<YearListResponse>(this.apiUrl, { params: httpParams });
  }

  /**
   * Get year by ID
   */
  getYearById(id: string): Observable<Year> {
    return this.http.get<Year>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new year
   */
  createYear(payload: YearCreatePayload): Observable<Year> {
    return this.http.post<Year>(this.apiUrl, payload);
  }

  /**
   * Update an existing year
   */
  updateYear(id: string, payload: YearUpdatePayload): Observable<Year> {
    return this.http.patch<Year>(`${this.apiUrl}/${id}`, payload);
  }

  /**
   * Delete a year
   */
  deleteYear(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Activate a specific year (deactivates all others)
   */
  activateYear(id: string): Observable<Year> {
    return this.http.post<Year>(`${this.apiUrl}/${id}/activate`, {});
  }

  /**
   * Get current active year
   */
  getCurrentYear(): Observable<Year | null> {
    return this.getYears({ status: 'ACTIVE', limit: 1 }).pipe(
      map(response => response.results.length > 0 ? response.results[0] : null)
    );
  }
}

