/**
 * Breeds List Service
 * Handles data management, filtering, sorting, and pagination for the Breeds List
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, debounceTime, delay, of, switchMap, tap } from 'rxjs';
import { Breed, SortColumn, SortDirection } from './breeds-list-type';
import { BREEDS } from './breeds-list-data';

/**
 * Search Result Interface
 */
interface SearchResult {
  breeds: Breed[];
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
const compare = (v1: string | number | Date, v2: string | number | Date) => {
  if (v1 instanceof Date && v2 instanceof Date) {
    return v1.getTime() < v2.getTime() ? -1 : v1.getTime() > v2.getTime() ? 1 : 0;
  }
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
};

/**
 * Sort function
 */
function sort(breeds: Breed[], column: SortColumn, direction: string): Breed[] {
  if (direction === '' || column === '') {
    return breeds;
  } else {
    return [...breeds].sort((a, b) => {
      const aVal = a[column as keyof Breed];
      const bVal = b[column as keyof Breed];
      const res = compare(aVal as string | number | Date, bVal as string | number | Date);
      return direction === 'asc' ? res : -res;
    });
  }
}

/**
 * Match function for filtering
 */
function matches(breed: Breed, term: string, statusFilter: string): boolean {
  const searchTerm = term.toLowerCase();

  // Status filter
  if (statusFilter && breed.status !== statusFilter) {
    return false;
  }

  // Search term filter
  if (term) {
    const matchesName = breed.name.toLowerCase().includes(searchTerm);
    const matchesCode = breed.code.toLowerCase().includes(searchTerm);
    const matchesDescription = breed.description.toLowerCase().includes(searchTerm);
    const matchesOrigin = breed.origin?.toLowerCase().includes(searchTerm) || false;

    return matchesName || matchesCode || matchesDescription || matchesOrigin;
  }

  return true;
}

@Injectable({ providedIn: 'root' })
export class BreedsListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _breeds$ = new BehaviorSubject<Breed[]>([]);
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
        this._breeds$.next(result.breeds);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get breeds$() {
    return this._breeds$.asObservable();
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
  get statusFilter() {
    return this._state.statusFilter;
  }

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

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm, statusFilter } = this._state;

    // 1. Filter
    let breeds = BREEDS.filter((breed) => matches(breed, searchTerm, statusFilter));
    const total = breeds.length;

    // 2. Sort
    breeds = sort(breeds, sortColumn, sortDirection);

    // 3. Paginate
    breeds = breeds.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ breeds, total });
  }

  /**
   * Get unique statuses for filter dropdown
   */
  getUniqueStatuses(): string[] {
    return Array.from(new Set(BREEDS.map((breed) => breed.status)));
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
}

