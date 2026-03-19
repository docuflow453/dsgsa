/**
 * Administrator List Service
 * Handles data management, filtering, sorting, and pagination for the Administrators List
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, debounceTime, delay, of, switchMap, tap } from 'rxjs';
import { AdministratorUser, SortColumn, SortDirection } from './administrator-list-type';
import { ADMINISTRATORS } from './administrator-list-data';

/**
 * Search Result Interface
 */
interface SearchResult {
  administrators: AdministratorUser[];
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
  roleFilter: string;
  statusFilter: string;
}

/**
 * Compare function for sorting
 */
const compare = (v1: string | number | Date, v2: string | number | Date) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

/**
 * Sort function
 */
function sort(administrators: AdministratorUser[], column: SortColumn, direction: string): AdministratorUser[] {
  if (direction === '' || column === '') {
    return administrators;
  } else {
    return [...administrators].sort((a, b) => {
      const aVal = a[column as keyof AdministratorUser];
      const bVal = b[column as keyof AdministratorUser];
      const res = compare(aVal as string | number | Date, bVal as string | number | Date);
      return direction === 'asc' ? res : -res;
    });
  }
}

/**
 * Match function for filtering
 */
function matches(administrator: AdministratorUser, term: string, roleFilter: string, statusFilter: string): boolean {
  const searchTerm = term.toLowerCase();

  // Role filter
  if (roleFilter && administrator.role !== roleFilter) {
    return false;
  }

  // Status filter
  if (statusFilter && administrator.status !== statusFilter) {
    return false;
  }

  // Search term filter
  if (term) {
    const matchesName = administrator.firstName.toLowerCase().includes(searchTerm) ||
      administrator.lastName.toLowerCase().includes(searchTerm);
    const matchesEmail = administrator.email.toLowerCase().includes(searchTerm);
    const matchesRole = administrator.role.toLowerCase().includes(searchTerm);
    const matchesDepartment = administrator.department ? administrator.department.toLowerCase().includes(searchTerm) : false;

    return matchesName || matchesEmail || matchesRole || matchesDepartment;
  }

  return true;
}

@Injectable({ providedIn: 'root' })
export class AdministratorListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _administrators$ = new BehaviorSubject<AdministratorUser[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    roleFilter: '',
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
        this._administrators$.next(result.administrators);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  /**
   * Getters for observables
   */
  get administrators$() {
    return this._administrators$.asObservable();
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
  set roleFilter(roleFilter: string) {
    this._set({ roleFilter });
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
    const { sortColumn, sortDirection, pageSize, page, searchTerm, roleFilter, statusFilter } = this._state;

    // 1. Filter
    let administrators = ADMINISTRATORS.filter((admin) => matches(admin, searchTerm, roleFilter, statusFilter));
    const total = administrators.length;

    // 2. Sort
    administrators = sort(administrators, sortColumn, sortDirection);

    // 3. Paginate
    administrators = administrators.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ administrators, total });
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this._set({
      searchTerm: '',
      roleFilter: '',
      statusFilter: '',
      page: 1
    });
  }

  /**
   * Get unique roles for filter dropdown
   */
  getUniqueRoles(): string[] {
    const roles = ADMINISTRATORS.map((admin) => admin.role);
    return [...new Set(roles)].sort();
  }

  /**
   * Get unique statuses for filter dropdown
   */
  getUniqueStatuses(): string[] {
    return ['Active', 'Inactive', 'Banned'];
  }

  /**
   * Delete administrator
   */
  deleteAdministrator(id: number): Observable<boolean> {
    const index = ADMINISTRATORS.findIndex((admin) => admin.id === id);
    if (index > -1) {
      ADMINISTRATORS.splice(index, 1);
      this._search$.next();
      return of(true);
    }
    return of(false);
  }

  /**
   * Toggle ban status
   */
  toggleBanStatus(id: number): Observable<boolean> {
    const administrator = ADMINISTRATORS.find((admin) => admin.id === id);
    if (administrator) {
      administrator.isBanned = !administrator.isBanned;
      administrator.status = administrator.isBanned ? 'Banned' : 'Active';
      administrator.isActive = !administrator.isBanned;
      this._search$.next();
      return of(true);
    }
    return of(false);
  }

  /**
   * Change password (mock implementation)
   */
  changePassword(id: number, newPassword: string): Observable<boolean> {
    // In a real application, this would call an API endpoint
    console.log(`Changing password for administrator ${id}`);
    return of(true);
  }
}

