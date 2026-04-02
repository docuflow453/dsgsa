/**
 * Colors List Service
 * Handles data management, filtering, sorting, and pagination for the Colors List
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, debounceTime, delay, of, switchMap, tap } from 'rxjs';
import { Color, SortColumn, SortDirection } from './colors-list-type';
import { COLORS } from './colors-list-data';

/**
 * Search Result Interface
 */
interface SearchResult {
  colors: Color[];
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
const compare = (v1: string | number | Date | boolean, v2: string | number | Date | boolean) => {
  if (v1 instanceof Date && v2 instanceof Date) {
    return v1.getTime() < v2.getTime() ? -1 : v1.getTime() > v2.getTime() ? 1 : 0;
  }
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
};

/**
 * Sort function
 */
function sort(colors: Color[], column: SortColumn, direction: string): Color[] {
  if (direction === '' || column === '') {
    return colors;
  } else {
    return [...colors].sort((a, b) => {
      const aVal = a[column as keyof Color];
      const bVal = b[column as keyof Color];
      const res = compare(aVal as string | number | Date | boolean, bVal as string | number | Date | boolean);
      return direction === 'asc' ? res : -res;
    });
  }
}

/**
 * Match function for filtering
 */
function matches(color: Color, term: string, statusFilter: string): boolean {
  const searchTerm = term.toLowerCase();

  // Status filter
  if (statusFilter && color.status !== statusFilter) {
    return false;
  }

  // Search term filter
  if (term) {
    const matchesName = color.name.toLowerCase().includes(searchTerm);
    const matchesCode = color.code.toLowerCase().includes(searchTerm);
    const matchesDescription = color.description.toLowerCase().includes(searchTerm);
    const matchesCategory = color.category?.toLowerCase().includes(searchTerm) || false;

    return matchesName || matchesCode || matchesDescription || matchesCategory;
  }

  return true;
}

@Injectable({ providedIn: 'root' })
export class ColorsListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _colors$ = new BehaviorSubject<Color[]>([]);
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
        this._colors$.next(result.colors);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get colors$() {
    return this._colors$.asObservable();
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
    let colors = COLORS.filter((color) => matches(color, searchTerm, statusFilter));
    const total = colors.length;

    // 2. Sort
    colors = sort(colors, sortColumn, sortDirection);

    // 3. Paginate
    colors = colors.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ colors, total });
  }

  /**
   * Get unique statuses for filter dropdown
   */
  getUniqueStatuses(): string[] {
    return Array.from(new Set(COLORS.map((color) => color.status)));
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

