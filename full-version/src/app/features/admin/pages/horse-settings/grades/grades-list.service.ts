/**
 * Grades List Service
 * Handles data management, filtering, sorting, and pagination for the Grades List
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, debounceTime, delay, of, switchMap, tap } from 'rxjs';
import { Grade, SortColumn, SortDirection } from './grades-list-type';
import { GRADES } from './grades-list-data';

/**
 * Search Result Interface
 */
interface SearchResult {
  grades: Grade[];
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
function sort(grades: Grade[], column: SortColumn, direction: string): Grade[] {
  if (direction === '' || column === '') {
    return grades;
  } else {
    return [...grades].sort((a, b) => {
      const aVal = a[column as keyof Grade];
      const bVal = b[column as keyof Grade];
      const res = compare(aVal as string | number | Date, bVal as string | number | Date);
      return direction === 'asc' ? res : -res;
    });
  }
}

/**
 * Match function for filtering
 */
function matches(grade: Grade, term: string, statusFilter: string): boolean {
  const searchTerm = term.toLowerCase();

  // Status filter
  if (statusFilter && grade.status !== statusFilter) {
    return false;
  }

  // Search term filter
  if (term) {
    const matchesName = grade.name.toLowerCase().includes(searchTerm);
    const matchesCode = grade.code.toLowerCase().includes(searchTerm);
    const matchesDescription = grade.description.toLowerCase().includes(searchTerm);
    const matchesLevel = grade.level.toString().includes(searchTerm);

    return matchesName || matchesCode || matchesDescription || matchesLevel;
  }

  return true;
}

@Injectable({ providedIn: 'root' })
export class GradesListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _grades$ = new BehaviorSubject<Grade[]>([]);
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
        this._grades$.next(result.grades);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get grades$() {
    return this._grades$.asObservable();
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
    let grades = GRADES.filter((grade) => matches(grade, searchTerm, statusFilter));
    const total = grades.length;

    // 2. Sort
    grades = sort(grades, sortColumn, sortDirection);

    // 3. Paginate
    grades = grades.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ grades, total });
  }

  /**
   * Get unique statuses for filter dropdown
   */
  getUniqueStatuses(): string[] {
    return Array.from(new Set(GRADES.map((grade) => grade.status)));
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

