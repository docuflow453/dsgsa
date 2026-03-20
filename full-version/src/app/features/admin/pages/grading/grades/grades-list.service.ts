/**
 * Grades List Service
 * Handles data management, search, filter, sort, and pagination for Grades List
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { Grade, GradeStatus, GradeLevel } from './grades-list-type';
import { GRADES } from './grades-list-data';
import { SortDirection } from '../../../../../theme/shared/directive/sortable.directive';

interface SearchResult {
  grades: Grade[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  statusFilter: string;
  levelFilter: string;
}

const compare = (v1: string | number | Date, v2: string | number | Date) => {
  if (v1 instanceof Date && v2 instanceof Date) {
    return v1.getTime() < v2.getTime() ? -1 : v1.getTime() > v2.getTime() ? 1 : 0;
  }
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
};

// eslint-disable-next-line
function sort(grades: any, column: string, direction: string): Grade[] {
  if (direction === '' || column === '') {
    return grades;
  } else {
    return [...grades].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(grade: Grade, term: string, statusFilter: string, levelFilter: string): boolean {
  const searchTerm = term.toLowerCase();
  const matchesSearch: boolean =
    grade.name.toLowerCase().includes(searchTerm) ||
    grade.code.toLowerCase().includes(searchTerm) ||
    grade.level.toLowerCase().includes(searchTerm) ||
    (grade.description ? grade.description.toLowerCase().includes(searchTerm) : false);

  const matchesStatus: boolean = !statusFilter || grade.status === statusFilter;
  const matchesLevel: boolean = !levelFilter || grade.level === levelFilter;

  return matchesSearch && matchesStatus && matchesLevel;
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
  get levelFilter() {
    return this._state.levelFilter;
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
  set sortColumn(sortColumn: string) {
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

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm, statusFilter, levelFilter } = this._state;

    // 1. Filter
    let grades = GRADES.filter((grade) => matches(grade, searchTerm, statusFilter, levelFilter));
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
  getUniqueStatuses(): GradeStatus[] {
    return ['Active', 'Inactive'];
  }

  /**
   * Get unique levels for filter dropdown
   */
  getUniqueLevels(): GradeLevel[] {
    return Array.from(new Set(GRADES.map((grade) => grade.level))) as GradeLevel[];
  }

  /**
   * Delete a grade
   */
  deleteGrade(id: number): void {
    const index = GRADES.findIndex((grade) => grade.id === id);
    if (index > -1) {
      GRADES.splice(index, 1);
      this._search$.next();
    }
  }

  /**
   * Reset all filters
   */
  resetFilters(): void {
    this._set({
      searchTerm: '',
      statusFilter: '',
      levelFilter: '',
      page: 1
    });
  }
}

