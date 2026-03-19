/**
 * Clubs List Service
 * Handles data management, filtering, sorting, and pagination for the Clubs List
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, debounceTime, delay, of, switchMap, tap } from 'rxjs';
import { Club, SortColumn, SortDirection } from './clubs-list-type';
import { CLUBS } from './clubs-list-data';

/**
 * Search Result Interface
 */
interface SearchResult {
  clubs: Club[];
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
function sort(clubs: Club[], column: SortColumn, direction: string): Club[] {
  if (direction === '' || column === '') {
    return clubs;
  } else {
    return [...clubs].sort((a, b) => {
      const aVal = a[column as keyof Club];
      const bVal = b[column as keyof Club];
      const res = compare(aVal as string | number | Date, bVal as string | number | Date);
      return direction === 'asc' ? res : -res;
    });
  }
}

/**
 * Match function for filtering
 */
function matches(club: Club, term: string, provinceFilter: string, statusFilter: string): boolean {
  const searchTerm = term.toLowerCase();
  
  // Province filter
  if (provinceFilter && club.province !== provinceFilter) {
    return false;
  }
  
  // Status filter
  if (statusFilter && club.status !== statusFilter) {
    return false;
  }
  
  // Search term filter
  if (term) {
    const matchesName = club.name.toLowerCase().includes(searchTerm);
    const matchesRegNumber = club.registrationNumber.toLowerCase().includes(searchTerm);
    const matchesCity = club.city.toLowerCase().includes(searchTerm);
    const matchesProvince = club.province.toLowerCase().includes(searchTerm);
    
    return matchesName || matchesRegNumber || matchesCity || matchesProvince;
  }
  
  return true;
}

@Injectable({ providedIn: 'root' })
export class ClubsListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _clubs$ = new BehaviorSubject<Club[]>([]);
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
        this._clubs$.next(result.clubs);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  /**
   * Getters for observables
   */
  get clubs$() {
    return this._clubs$.asObservable();
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
    let clubs = CLUBS.filter((club) => matches(club, searchTerm, provinceFilter, statusFilter));
    const total = clubs.length;

    // 2. Sort
    clubs = sort(clubs, sortColumn, sortDirection);

    // 3. Paginate
    clubs = clubs.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ clubs, total });
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
    const provinces = CLUBS.map((club) => club.province);
    return [...new Set(provinces)].sort();
  }

  /**
   * Get unique statuses for filter dropdown
   */
  getUniqueStatuses(): string[] {
    return ['Active', 'Inactive'];
  }

  /**
   * Delete club
   */
  deleteClub(id: number): Observable<boolean> {
    const index = CLUBS.findIndex((club) => club.id === id);
    if (index > -1) {
      CLUBS.splice(index, 1);
      this._search$.next();
      return of(true);
    }
    return of(false);
  }
}

