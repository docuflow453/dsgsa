/**
 * Shows List Service
 * Handles data management, filtering, sorting, and pagination for the Shows List
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, debounceTime, delay, of, switchMap, tap } from 'rxjs';
import { Show, SortColumn, SortDirection } from './shows-list-type';
import { SHOWS } from './shows-list-data';

/**
 * Search Result Interface
 */
interface SearchResult {
  shows: Show[];
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
  levelFilter: string;
}

/**
 * Compare function for sorting
 */
const compare = (v1: string | number | Date, v2: string | number | Date) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

/**
 * Sort function
 */
function sort(shows: Show[], column: SortColumn, direction: string): Show[] {
  if (direction === '' || column === '') {
    return shows;
  } else {
    return [...shows].sort((a, b) => {
      const aVal = a[column as keyof Show];
      const bVal = b[column as keyof Show];
      const res = compare(aVal as string | number | Date, bVal as string | number | Date);
      return direction === 'asc' ? res : -res;
    });
  }
}

/**
 * Match function for filtering
 */
function matches(show: Show, term: string, statusFilter: string, levelFilter: string): boolean {
  const searchTerm = term.toLowerCase();

  // Status filter (supports comma-separated values for multiple statuses)
  if (statusFilter) {
    const allowedStatuses = statusFilter.split(',').map(s => s.trim());
    if (!allowedStatuses.includes(show.status)) {
      return false;
    }
  }

  // Level filter
  if (levelFilter && show.level !== levelFilter) {
    return false;
  }

  // Search term filter
  if (term) {
    const matchesName = show.name.toLowerCase().includes(searchTerm);
    const matchesSHB = show.showHoldingBody.toLowerCase().includes(searchTerm);
    const matchesVenue = show.venue.toLowerCase().includes(searchTerm);
    const matchesCity = show.city?.toLowerCase().includes(searchTerm) || false;
    const matchesProvince = show.province?.toLowerCase().includes(searchTerm) || false;

    return matchesName || matchesSHB || matchesVenue || matchesCity || matchesProvince;
  }

  return true;
}

@Injectable({ providedIn: 'root' })
export class ShowsListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _shows$ = new BehaviorSubject<Show[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    statusFilter: '',
    levelFilter: ''
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
        this._shows$.next(result.shows);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  /**
   * Getters for observables
   */
  get shows$() {
    return this._shows$.asObservable();
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
  set levelFilter(levelFilter: string) {
    this._set({ levelFilter });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  /**
   * Search function
   */
  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm, statusFilter, levelFilter } = this._state;

    // 1. Filter
    let shows = SHOWS.filter((show) => matches(show, searchTerm, statusFilter, levelFilter));
    const total = shows.length;

    // 2. Sort
    shows = sort(shows, sortColumn, sortDirection);

    // 3. Paginate
    shows = shows.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ shows, total });
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this._set({
      searchTerm: '',
      statusFilter: '',
      levelFilter: '',
      page: 1
    });
  }

  /**
   * Get unique statuses for filter dropdown
   */
  getUniqueStatuses(): string[] {
    return ['Upcoming', 'Open', 'Closed', 'Completed', 'Cancelled'];
  }

  /**
   * Get unique levels for filter dropdown
   */
  getUniqueLevels(): string[] {
    return ['Preliminary', 'Novice', 'Elementary', 'Medium', 'Advanced', 'Grand Prix', 'All Levels'];
  }

  /**
   * Delete show
   */
  deleteShow(id: number): Observable<boolean> {
    const index = SHOWS.findIndex((show) => show.id === id);
    if (index > -1) {
      SHOWS.splice(index, 1);
      this._search$.next();
      return of(true);
    }
    return of(false);
  }
}

