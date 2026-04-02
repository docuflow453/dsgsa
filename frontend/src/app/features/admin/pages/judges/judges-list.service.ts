/**
 * Judges List Service
 * Handles data management, filtering, sorting, and pagination for the Judges List
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, debounceTime, delay, of, switchMap, tap } from 'rxjs';
import { Judge, SortColumn, SortDirection } from './judges-list-type';
import { JUDGES } from './judges-list-data';

/**
 * Search Result Interface
 */
interface SearchResult {
  judges: Judge[];
  total: number;
}

/**
 * State Interface for managing component state
 */
interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  statusFilter: string;
}

/**
 * Compare function for sorting
 */
const compare = (v1: string | number | Date, v2: string | number | Date) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

/**
 * Sort function
 */
function sort(judges: Judge[], column: SortColumn, direction: string): Judge[] {
  if (direction === '' || column === '') {
    return judges;
  } else {
    return [...judges].sort((a, b) => {
      const aVal = a[column as keyof Judge];
      const bVal = b[column as keyof Judge];
      const res = compare(aVal as string | number | Date, bVal as string | number | Date);
      return direction === 'asc' ? res : -res;
    });
  }
}

/**
 * Match function for filtering
 */
function matches(judge: Judge, term: string, statusFilter: string): boolean {
  const searchTerm = term.toLowerCase();
  
  // Status filter
  if (statusFilter && judge.status !== statusFilter) {
    return false;
  }
  
  // Search term filter
  if (term) {
    const matchesFirstName = judge.firstName.toLowerCase().includes(searchTerm);
    const matchesLastName = judge.lastName.toLowerCase().includes(searchTerm);
    const matchesEmail = judge.email.toLowerCase().includes(searchTerm);
    const matchesLicense = judge.licenseNumber.toLowerCase().includes(searchTerm);
    const matchesType = judge.judgeType.toLowerCase().includes(searchTerm);
    
    return matchesFirstName || matchesLastName || matchesEmail || matchesLicense || matchesType;
  }
  
  return true;
}

@Injectable({ providedIn: 'root' })
export class JudgesListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _judges$ = new BehaviorSubject<Judge[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    statusFilter: ''
  };

  constructor() {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._judges$.next(result.judges);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  /**
   * Getters for observables
   */
  get judges$() {
    return this._judges$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  /**
   * Setters that trigger search
   */
  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }
  set statusFilter(statusFilter: string) {
    this._set({ statusFilter });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  /**
   * Search function
   */
  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm, statusFilter } = this._state;

    // 1. Filter
    let judges = JUDGES.filter((judge) => matches(judge, searchTerm, statusFilter));
    const total = judges.length;

    // 2. Sort
    judges = sort(judges, sortColumn, sortDirection);

    // 3. Paginate
    judges = judges.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ judges, total });
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this._set({
      searchTerm: '',
      statusFilter: '',
      page: 1
    });
  }

  /**
   * Get unique statuses for filter dropdown
   */
  getUniqueStatuses(): string[] {
    return ['Active', 'Inactive'];
  }

  /**
   * Delete judge
   */
  deleteJudge(id: number): Observable<boolean> {
    const index = JUDGES.findIndex((judge) => judge.id === id);
    if (index > -1) {
      JUDGES.splice(index, 1);
      this._search$.next();
      return of(true);
    }
    return of(false);
  }
}

