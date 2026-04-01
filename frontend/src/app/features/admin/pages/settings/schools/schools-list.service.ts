/**
 * Schools List Service
 * Handles data management, search, filter, sort, and pagination for Schools List
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { School, SchoolStatus, SchoolType } from './schools-list-type';
import { SCHOOLS } from './schools-list-data';
import { SortDirection } from '../../../../../theme/shared/directive/sortable.directive';

interface SearchResult {
  schools: School[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  statusFilter: string;
  typeFilter: string;
  provinceFilter: string;
}

const compare = (v1: string | number | Date, v2: string | number | Date) => {
  if (v1 instanceof Date && v2 instanceof Date) {
    return v1.getTime() < v2.getTime() ? -1 : v1.getTime() > v2.getTime() ? 1 : 0;
  }
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
};

// eslint-disable-next-line
function sort(schools: any, column: string, direction: string): School[] {
  if (direction === '' || column === '') {
    return schools;
  } else {
    return [...schools].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(school: School, term: string, statusFilter: string, typeFilter: string, provinceFilter: string): boolean {
  const searchTerm = term.toLowerCase();
  const matchesSearch =
    school.name.toLowerCase().includes(searchTerm) ||
    school.contactPerson.toLowerCase().includes(searchTerm) ||
    school.email.toLowerCase().includes(searchTerm) ||
    school.city.toLowerCase().includes(searchTerm) ||
    school.province.toLowerCase().includes(searchTerm);

  const matchesStatus = !statusFilter || school.status === statusFilter;
  const matchesType = !typeFilter || school.type === typeFilter;
  const matchesProvince = !provinceFilter || school.province === provinceFilter;

  return matchesSearch && matchesStatus && matchesType && matchesProvince;
}

@Injectable({ providedIn: 'root' })
export class SchoolsListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _schools$ = new BehaviorSubject<School[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    statusFilter: '',
    typeFilter: '',
    provinceFilter: ''
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
        this._schools$.next(result.schools);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get schools$() {
    return this._schools$.asObservable();
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
  get typeFilter() {
    return this._state.typeFilter;
  }
  get provinceFilter() {
    return this._state.provinceFilter;
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
  set typeFilter(typeFilter: string) {
    this._set({ typeFilter });
  }
  set provinceFilter(provinceFilter: string) {
    this._set({ provinceFilter });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm, statusFilter, typeFilter, provinceFilter } = this._state;

    // 1. Filter
    let schools = SCHOOLS.filter((school) => matches(school, searchTerm, statusFilter, typeFilter, provinceFilter));
    const total = schools.length;

    // 2. Sort
    schools = sort(schools, sortColumn, sortDirection);

    // 3. Paginate
    schools = schools.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ schools, total });
  }

  /**
   * Get unique statuses for filter dropdown
   */
  getUniqueStatuses(): SchoolStatus[] {
    return ['Active', 'Inactive'];
  }

  /**
   * Get unique types for filter dropdown
   */
  getUniqueTypes(): SchoolType[] {
    return Array.from(new Set(SCHOOLS.map((school) => school.type))) as SchoolType[];
  }

  /**
   * Get unique provinces for filter dropdown
   */
  getUniqueProvinces(): string[] {
    return Array.from(new Set(SCHOOLS.map((school) => school.province))).sort();
  }

  /**
   * Delete a school
   */
  deleteSchool(id: number): void {
    const index = SCHOOLS.findIndex((school) => school.id === id);
    if (index > -1) {
      SCHOOLS.splice(index, 1);
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
      typeFilter: '',
      provinceFilter: '',
      page: 1
    });
  }
}

