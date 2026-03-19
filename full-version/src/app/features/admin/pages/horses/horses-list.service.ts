/**
 * Horses List Service
 * Handles data management, filtering, sorting, and pagination for the Horses List
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, debounceTime, delay, of, switchMap, tap } from 'rxjs';
import { Horse, SortColumn, SortDirection } from './horses-list-type';
import { HORSES } from './horses-list-data';

/**
 * Search Result Interface
 */
interface SearchResult {
  horses: Horse[];
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
function sort(horses: Horse[], column: SortColumn, direction: string): Horse[] {
  if (direction === '' || column === '') {
    return horses;
  } else {
    return [...horses].sort((a, b) => {
      const aVal = a[column as keyof Horse];
      const bVal = b[column as keyof Horse];
      const res = compare(aVal as string | number | Date, bVal as string | number | Date);
      return direction === 'asc' ? res : -res;
    });
  }
}

/**
 * Match function for filtering
 */
function matches(horse: Horse, term: string, statusFilter: string): boolean {
  const searchTerm = term.toLowerCase();
  
  // Status filter
  if (statusFilter && horse.status !== statusFilter) {
    return false;
  }
  
  // Search term filter
  if (term) {
    const matchesName = horse.name.toLowerCase().includes(searchTerm);
    const matchesMicrochip = horse.microchipNumber.toLowerCase().includes(searchTerm);
    const matchesPassport = horse.passportNumber.toLowerCase().includes(searchTerm);
    const matchesBreed = horse.breed.toLowerCase().includes(searchTerm);
    const matchesColor = horse.color.toLowerCase().includes(searchTerm);
    
    return matchesName || matchesMicrochip || matchesPassport || matchesBreed || matchesColor;
  }
  
  return true;
}

@Injectable({ providedIn: 'root' })
export class HorsesListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _horses$ = new BehaviorSubject<Horse[]>([]);
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
        this._horses$.next(result.horses);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  /**
   * Getters for observables
   */
  get horses$() {
    return this._horses$.asObservable();
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
    let horses = HORSES.filter((horse) => matches(horse, searchTerm, statusFilter));
    const total = horses.length;

    // 2. Sort
    horses = sort(horses, sortColumn, sortDirection);

    // 3. Paginate
    horses = horses.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ horses, total });
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
   * Delete horse
   */
  deleteHorse(id: number): Observable<boolean> {
    const index = HORSES.findIndex((horse) => horse.id === id);
    if (index > -1) {
      HORSES.splice(index, 1);
      this._search$.next();
      return of(true);
    }
    return of(false);
  }
}

