import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Entry, EntryClass, Transaction, RidingOrder } from '../models/entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private apiUrl = `${environment.apiUrl}/entries`;

  constructor(private http: HttpClient) {}

  getEntries(params?: any): Observable<{ count: number; results: Entry[] }> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<{ count: number; results: Entry[] }>(this.apiUrl + '/', { params: httpParams });
  }

  getEntry(id: number): Observable<Entry> {
    return this.http.get<Entry>(`${this.apiUrl}/${id}/`);
  }

  createEntry(entry: Partial<Entry>): Observable<Entry> {
    return this.http.post<Entry>(this.apiUrl + '/', entry);
  }

  updateEntry(id: number, entry: Partial<Entry>): Observable<Entry> {
    return this.http.patch<Entry>(`${this.apiUrl}/${id}/`, entry);
  }

  deleteEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  getEntryClasses(entryId?: number): Observable<EntryClass[]> {
    const params = entryId ? { entry: entryId.toString() } : {};
    return this.http.get<EntryClass[]>(`${environment.apiUrl}/entries-classes/`, { params });
  }

  getTransactions(params?: any): Observable<Transaction[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<Transaction[]>(`${environment.apiUrl}/transactions/`, { params: httpParams });
  }

  getRidingOrders(competitionClassId?: number): Observable<RidingOrder[]> {
    const params = competitionClassId ? { competition_class: competitionClassId.toString() } : {};
    return this.http.get<RidingOrder[]>(`${environment.apiUrl}/riding-orders/`, { params });
  }
}

