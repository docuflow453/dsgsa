/**
 * Show Holding Body List Service
 * Handles data management, filtering, sorting, and pagination for the Show Holding Bodies List
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, debounceTime, delay, of, switchMap, tap } from 'rxjs';
import { ShowHoldingBody, SortColumn, SortDirection } from './show-holding-body-list-type';
import { SHOW_HOLDING_BODIES } from './show-holding-body-list-data';

/**
 * Search Result Interface
 */
interface SearchResult {
  showHoldingBodies: ShowHoldingBody[];
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
  provinceFilter: string;
  statusFilter: string;
}

/**
 * Compare function for sorting
 */
const compare = (v1: string | number | Date, v2: string | number | Date) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

/**
 * Sort function
 */
function sort(showHoldingBodies: ShowHoldingBody[], column: SortColumn, direction: string): ShowHoldingBody[] {
  if (direction === '' || column === '') {
    return showHoldingBodies;
  } else {
    return [...showHoldingBodies].sort((a, b) => {
      const aVal = a[column as keyof ShowHoldingBody];
      const bVal = b[column as keyof ShowHoldingBody];
      const res = compare(aVal as string | number | Date, bVal as string | number | Date);
      return direction === 'asc' ? res : -res;
    });
  }
}

/**
 * Match function for filtering
 */
function matches(shb: ShowHoldingBody, term: string, provinceFilter: string, statusFilter: string): boolean {
  const searchTerm = term.toLowerCase();
  
  // Province filter
  if (provinceFilter && shb.province !== provinceFilter) {
    return false;
  }
  
  // Status filter
  if (statusFilter && shb.status !== statusFilter) {
    return false;
  }
  
  // Search term filter
  if (term) {
    const matchesName = shb.name.toLowerCase().includes(searchTerm);
    const matchesRegNumber = shb.registrationNumber.toLowerCase().includes(searchTerm);
    const matchesCity = shb.city.toLowerCase().includes(searchTerm);
    const matchesProvince = shb.province.toLowerCase().includes(searchTerm);
    
    return matchesName || matchesRegNumber || matchesCity || matchesProvince;
  }
  
  return true;
}

@Injectable({ providedIn: 'root' })
export class ShowHoldingBodyListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _showHoldingBodies$ = new BehaviorSubject<ShowHoldingBody[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    provinceFilter: '',
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
        this._showHoldingBodies$.next(result.showHoldingBodies);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  /**
   * Getters for observables
   */
  get showHoldingBodies$() {
    return this._showHoldingBodies$.asObservable();
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
  set provinceFilter(provinceFilter: string) {
    this._set({ provinceFilter });
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
    const { sortColumn, sortDirection, pageSize, page, searchTerm, provinceFilter, statusFilter } = this._state;

    // 1. Filter
    let showHoldingBodies = SHOW_HOLDING_BODIES.filter((shb) => matches(shb, searchTerm, provinceFilter, statusFilter));
    const total = showHoldingBodies.length;

    // 2. Sort
    showHoldingBodies = sort(showHoldingBodies, sortColumn, sortDirection);

    // 3. Paginate
    showHoldingBodies = showHoldingBodies.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ showHoldingBodies, total });
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this._set({
      searchTerm: '',
      provinceFilter: '',
      statusFilter: '',
      page: 1
    });
  }

  /**
   * Get unique provinces for filter dropdown
   */
  getUniqueProvinces(): string[] {
    const provinces = SHOW_HOLDING_BODIES.map((shb) => shb.province);
    return [...new Set(provinces)].sort();
  }

  /**
   * Get unique statuses for filter dropdown
   */
  getUniqueStatuses(): string[] {
    return ['Active', 'Inactive'];
  }

  /**
   * Delete show holding body
   */
  deleteShowHoldingBody(id: number): Observable<boolean> {
    const index = SHOW_HOLDING_BODIES.findIndex((shb) => shb.id === id);
    if (index > -1) {
      SHOW_HOLDING_BODIES.splice(index, 1);
      this._search$.next();
      return of(true);
    }
    return of(false);
  }
}

