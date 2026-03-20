/**
 * Accounting Periods List Service
 * Handles data management, search, filter, sort, and pagination for Accounting Periods List
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { AccountingPeriod, AccountingPeriodStatus } from './accounting-periods-list-type';
import { ACCOUNTING_PERIODS } from './accounting-periods-list-data';
import { SortDirection } from '../../../../../theme/shared/directive/sortable.directive';

interface SearchResult {
  periods: AccountingPeriod[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  statusFilter: string;
  fiscalYearFilter: string;
}

const compare = (v1: string | number | Date, v2: string | number | Date) => {
  if (v1 instanceof Date && v2 instanceof Date) {
    return v1.getTime() < v2.getTime() ? -1 : v1.getTime() > v2.getTime() ? 1 : 0;
  }
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
};

// eslint-disable-next-line
function sort(periods: any, column: string, direction: string): AccountingPeriod[] {
  if (direction === '' || column === '') {
    return periods;
  } else {
    return [...periods].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(period: AccountingPeriod, term: string, statusFilter: string, fiscalYearFilter: string): boolean {
  const searchTerm = term.toLowerCase();
  const matchesSearch: boolean =
    period.name.toLowerCase().includes(searchTerm) ||
    period.code.toLowerCase().includes(searchTerm) ||
    period.fiscalYear.toLowerCase().includes(searchTerm) ||
    (period.quarter ? period.quarter.toLowerCase().includes(searchTerm) : false) ||
    (period.description ? period.description.toLowerCase().includes(searchTerm) : false);

  const matchesStatus: boolean = !statusFilter || period.status === statusFilter;
  const matchesFiscalYear: boolean = !fiscalYearFilter || period.fiscalYear === fiscalYearFilter;

  return matchesSearch && matchesStatus && matchesFiscalYear;
}

@Injectable({ providedIn: 'root' })
export class AccountingPeriodsListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _periods$ = new BehaviorSubject<AccountingPeriod[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    statusFilter: '',
    fiscalYearFilter: ''
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
        this._periods$.next(result.periods);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get periods$() {
    return this._periods$.asObservable();
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
  get fiscalYearFilter() {
    return this._state.fiscalYearFilter;
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
  set fiscalYearFilter(fiscalYearFilter: string) {
    this._set({ fiscalYearFilter });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm, statusFilter, fiscalYearFilter } = this._state;

    // 1. Filter
    let periods = ACCOUNTING_PERIODS.filter((period) => matches(period, searchTerm, statusFilter, fiscalYearFilter));
    const total = periods.length;

    // 2. Sort
    periods = sort(periods, sortColumn, sortDirection);

    // 3. Paginate
    periods = periods.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ periods, total });
  }

  /**
   * Get unique statuses for filter dropdown
   */
  getUniqueStatuses(): AccountingPeriodStatus[] {
    return ['Active', 'Inactive', 'Closed'];
  }

  /**
   * Get unique fiscal years for filter dropdown
   */
  getUniqueFiscalYears(): string[] {
    return Array.from(new Set(ACCOUNTING_PERIODS.map((period) => period.fiscalYear))).sort().reverse();
  }

  /**
   * Delete an accounting period
   */
  deletePeriod(id: number): void {
    const index = ACCOUNTING_PERIODS.findIndex((period) => period.id === id);
    if (index > -1) {
      ACCOUNTING_PERIODS.splice(index, 1);
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
      fiscalYearFilter: '',
      page: 1
    });
  }
}

