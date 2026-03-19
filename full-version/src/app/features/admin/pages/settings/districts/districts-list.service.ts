/**
 * Districts List Service
 * Handles data management, search, filter, sort, and pagination for Districts List
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { District, DistrictStatus } from './districts-list-type';
import { DISTRICTS } from './districts-list-data';
import { SortDirection } from '../../../../../theme/shared/directive/sortable.directive';

interface SearchResult {
  districts: District[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  statusFilter: string;
  provinceFilter: string;
}

const compare = (v1: string | number | Date, v2: string | number | Date) => {
  if (v1 instanceof Date && v2 instanceof Date) {
    return v1.getTime() < v2.getTime() ? -1 : v1.getTime() > v2.getTime() ? 1 : 0;
  }
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
};

// eslint-disable-next-line
function sort(districts: any, column: string, direction: string): District[] {
  if (direction === '' || column === '') {
    return districts;
  } else {
    return [...districts].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(district: District, term: string, statusFilter: string, provinceFilter: string): boolean {
  const searchTerm = term.toLowerCase();
  const matchesSearch: boolean =
    district.name.toLowerCase().includes(searchTerm) ||
    district.code.toLowerCase().includes(searchTerm) ||
    district.contactPerson.toLowerCase().includes(searchTerm) ||
    district.email.toLowerCase().includes(searchTerm) ||
    district.province.toLowerCase().includes(searchTerm) ||
    (district.city ? district.city.toLowerCase().includes(searchTerm) : false);

  const matchesStatus: boolean = !statusFilter || district.status === statusFilter;
  const matchesProvince: boolean = !provinceFilter || district.province === provinceFilter;

  return matchesSearch && matchesStatus && matchesProvince;
}

@Injectable({ providedIn: 'root' })
export class DistrictsListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _districts$ = new BehaviorSubject<District[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    statusFilter: '',
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
        this._districts$.next(result.districts);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get districts$() {
    return this._districts$.asObservable();
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
  set provinceFilter(provinceFilter: string) {
    this._set({ provinceFilter });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm, statusFilter, provinceFilter } = this._state;

    // 1. Filter
    let districts = DISTRICTS.filter((district) => matches(district, searchTerm, statusFilter, provinceFilter));
    const total = districts.length;

    // 2. Sort
    districts = sort(districts, sortColumn, sortDirection);

    // 3. Paginate
    districts = districts.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ districts, total });
  }

  /**
   * Get unique statuses for filter dropdown
   */
  getUniqueStatuses(): DistrictStatus[] {
    return ['Active', 'Inactive'];
  }

  /**
   * Get unique provinces for filter dropdown
   */
  getUniqueProvinces(): string[] {
    return Array.from(new Set(DISTRICTS.map((district) => district.province))).sort();
  }

  /**
   * Delete a district
   */
  deleteDistrict(id: number): void {
    const index = DISTRICTS.findIndex((district) => district.id === id);
    if (index > -1) {
      DISTRICTS.splice(index, 1);
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
      provinceFilter: '',
      page: 1
    });
  }
}

