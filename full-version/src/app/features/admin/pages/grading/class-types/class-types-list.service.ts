/**
 * Class Types List Service
 * Handles data management, search, filter, sort, and pagination for Class Types List
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { ClassType, ClassTypeStatus, ClassCategory } from './class-types-list-type';
import { CLASS_TYPES } from './class-types-list-data';
import { SortDirection } from '../../../../../theme/shared/directive/sortable.directive';

interface SearchResult {
  classTypes: ClassType[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  statusFilter: string;
  categoryFilter: string;
}

const compare = (v1: string | number | Date, v2: string | number | Date) => {
  if (v1 instanceof Date && v2 instanceof Date) {
    return v1.getTime() < v2.getTime() ? -1 : v1.getTime() > v2.getTime() ? 1 : 0;
  }
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
};

// eslint-disable-next-line
function sort(classTypes: any, column: string, direction: string): ClassType[] {
  if (direction === '' || column === '') {
    return classTypes;
  } else {
    return [...classTypes].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(classType: ClassType, term: string, statusFilter: string, categoryFilter: string): boolean {
  const searchTerm = term.toLowerCase();
  const matchesSearch: boolean =
    classType.name.toLowerCase().includes(searchTerm) ||
    classType.code.toLowerCase().includes(searchTerm) ||
    classType.category.toLowerCase().includes(searchTerm) ||
    (classType.description ? classType.description.toLowerCase().includes(searchTerm) : false);

  const matchesStatus: boolean = !statusFilter || classType.status === statusFilter;
  const matchesCategory: boolean = !categoryFilter || classType.category === categoryFilter;

  return matchesSearch && matchesStatus && matchesCategory;
}

@Injectable({ providedIn: 'root' })
export class ClassTypesListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _classTypes$ = new BehaviorSubject<ClassType[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    statusFilter: '',
    categoryFilter: ''
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
        this._classTypes$.next(result.classTypes);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get classTypes$() {
    return this._classTypes$.asObservable();
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
  get categoryFilter() {
    return this._state.categoryFilter;
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
  set categoryFilter(categoryFilter: string) {
    this._set({ categoryFilter });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm, statusFilter, categoryFilter } = this._state;

    // 1. Filter
    let classTypes = CLASS_TYPES.filter((classType) => matches(classType, searchTerm, statusFilter, categoryFilter));
    const total = classTypes.length;

    // 2. Sort
    classTypes = sort(classTypes, sortColumn, sortDirection);

    // 3. Paginate
    classTypes = classTypes.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ classTypes, total });
  }

  /**
   * Get unique statuses for filter dropdown
   */
  getUniqueStatuses(): ClassTypeStatus[] {
    return ['Active', 'Inactive'];
  }

  /**
   * Get unique categories for filter dropdown
   */
  getUniqueCategories(): ClassCategory[] {
    return Array.from(new Set(CLASS_TYPES.map((classType) => classType.category))) as ClassCategory[];
  }

  /**
   * Delete a class type
   */
  deleteClassType(id: number): void {
    const index = CLASS_TYPES.findIndex((classType) => classType.id === id);
    if (index > -1) {
      CLASS_TYPES.splice(index, 1);
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
      categoryFilter: '',
      page: 1
    });
  }
}

