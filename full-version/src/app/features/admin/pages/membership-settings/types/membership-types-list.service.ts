/**
 * Membership Types List Service
 * Handles data management, filtering, sorting, and pagination for the Membership Types List
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, debounceTime, delay, of, switchMap, tap } from 'rxjs';
import { MembershipType, SortColumn, SortDirection } from './membership-types-list-type';
import { MEMBERSHIP_TYPES } from './membership-types-list-data';

/**
 * Search Result Interface
 */
interface SearchResult {
  membershipTypes: MembershipType[];
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
  ruleGroupFilter: string;
}

/**
 * Compare function for sorting
 */
const compare = (v1: string | number | Date, v2: string | number | Date) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

/**
 * Sort function
 */
function sort(membershipTypes: MembershipType[], column: SortColumn, direction: string): MembershipType[] {
  if (direction === '' || column === '') {
    return membershipTypes;
  } else {
    return [...membershipTypes].sort((a, b) => {
      const aVal = a[column as keyof MembershipType];
      const bVal = b[column as keyof MembershipType];
      const res = compare(aVal as string | number | Date, bVal as string | number | Date);
      return direction === 'asc' ? res : -res;
    });
  }
}

/**
 * Match function for filtering
 */
function matches(membershipType: MembershipType, term: string, statusFilter: string, ruleGroupFilter: string): boolean {
  const searchTerm = term.toLowerCase();
  
  // Status filter
  if (statusFilter && membershipType.status !== statusFilter) {
    return false;
  }
  
  // Rule Group filter
  if (ruleGroupFilter && membershipType.ruleGroup !== ruleGroupFilter) {
    return false;
  }
  
  // Search term filter
  if (term) {
    const matchesName = membershipType.name.toLowerCase().includes(searchTerm);
    const matchesDescription = membershipType.description.toLowerCase().includes(searchTerm);
    const matchesRuleGroup = membershipType.ruleGroup.toLowerCase().includes(searchTerm);
    const matchesFee = membershipType.fee.toString().includes(searchTerm);
    
    return matchesName || matchesDescription || matchesRuleGroup || matchesFee;
  }
  
  return true;
}

@Injectable({ providedIn: 'root' })
export class MembershipTypesListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _membershipTypes$ = new BehaviorSubject<MembershipType[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    statusFilter: '',
    ruleGroupFilter: ''
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
        this._membershipTypes$.next(result.membershipTypes);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  /**
   * Getters for observables
   */
  get membershipTypes$() {
    return this._membershipTypes$.asObservable();
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
  set ruleGroupFilter(ruleGroupFilter: string) {
    this._set({ ruleGroupFilter });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  /**
   * Search function
   */
  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm, statusFilter, ruleGroupFilter } = this._state;

    // 1. Filter
    let membershipTypes = MEMBERSHIP_TYPES.filter((membershipType) => matches(membershipType, searchTerm, statusFilter, ruleGroupFilter));
    const total = membershipTypes.length;

    // 2. Sort
    membershipTypes = sort(membershipTypes, sortColumn, sortDirection);

    // 3. Paginate
    membershipTypes = membershipTypes.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ membershipTypes, total });
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this._set({
      searchTerm: '',
      statusFilter: '',
      ruleGroupFilter: '',
      page: 1
    });
  }

  /**
   * Get unique statuses for filter dropdown
   */
  getUniqueStatuses(): string[] {
    return ['Active', 'Inactive'];
  }

  /**
   * Get unique rule groups for filter dropdown
   */
  getUniqueRuleGroups(): string[] {
    return ['Individual', 'Organization', 'Junior', 'Senior', 'Professional', 'Amateur'];
  }

  /**
   * Delete membership type
   */
  deleteMembershipType(id: number): Observable<boolean> {
    const index = MEMBERSHIP_TYPES.findIndex((membershipType) => membershipType.id === id);
    if (index > -1) {
      MEMBERSHIP_TYPES.splice(index, 1);
      this._search$.next();
      return of(true);
    }
    return of(false);
  }
}

