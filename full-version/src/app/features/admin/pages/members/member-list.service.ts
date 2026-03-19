/**
 * Member List Service
 * Handles data management, search, filter, sort, and pagination for Members List
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { MemberUser, UserRole, UserStatus } from './member-list-type';
import { MEMBERS } from './member-list-data';
import { SortDirection } from '../../../../theme/shared/directive/sortable.directive';

interface SearchResult {
  members: MemberUser[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  roleFilter: string;
  statusFilter: string;
  membershipTypeFilter: string;
  countryFilter: string;
}

const compare = (v1: string | number | Date, v2: string | number | Date) => {
  if (v1 instanceof Date && v2 instanceof Date) {
    return v1.getTime() < v2.getTime() ? -1 : v1.getTime() > v2.getTime() ? 1 : 0;
  }
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
};

// eslint-disable-next-line
function sort(members: any, column: string, direction: string): MemberUser[] {
  if (direction === '' || column === '') {
    return members;
  } else {
    return [...members].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(member: MemberUser, term: string) {
  const searchTerm = term.toLowerCase();
  return (
    member.firstName.toLowerCase().includes(searchTerm) ||
    member.lastName.toLowerCase().includes(searchTerm) ||
    member.email.toLowerCase().includes(searchTerm) ||
    member.membershipNumber.toLowerCase().includes(searchTerm) ||
    member.role.toLowerCase().includes(searchTerm)
  );
}

@Injectable({ providedIn: 'root' })
export class MemberListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _members$ = new BehaviorSubject<MemberUser[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    roleFilter: '',
    statusFilter: '',
    membershipTypeFilter: '',
    countryFilter: ''
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
        this._members$.next(result.members);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get members$() {
    return this._members$.asObservable();
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
  get roleFilter() {
    return this._state.roleFilter;
  }
  get statusFilter() {
    return this._state.statusFilter;
  }
  get membershipTypeFilter() {
    return this._state.membershipTypeFilter;
  }
  get countryFilter() {
    return this._state.countryFilter;
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
  set roleFilter(roleFilter: string) {
    this._set({ roleFilter });
  }
  set statusFilter(statusFilter: string) {
    this._set({ statusFilter });
  }
  set membershipTypeFilter(membershipTypeFilter: string) {
    this._set({ membershipTypeFilter });
  }
  set countryFilter(countryFilter: string) {
    this._set({ countryFilter });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm, roleFilter, statusFilter, membershipTypeFilter, countryFilter } =
      this._state;

    // 1. sort
    let members = sort(MEMBERS, sortColumn, sortDirection);

    // 2. filter by search term
    members = members.filter((member) => matches(member, searchTerm));

    // 3. filter by role
    if (roleFilter) {
      members = members.filter((member) => member.role === roleFilter);
    }

    // 4. filter by status
    if (statusFilter) {
      members = members.filter((member) => member.status === statusFilter);
    }

    // 5. filter by membership type
    if (membershipTypeFilter) {
      members = members.filter((member) => member.membershipType === membershipTypeFilter);
    }

    // 6. filter by country
    if (countryFilter) {
      members = members.filter((member) => member.country === countryFilter);
    }

    const total = members.length;

    // 7. paginate
    members = members.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ members, total });
  }

  deleteMember(id: number): void {
    const index = MEMBERS.findIndex((res) => res.id === id);
    if (index > -1) {
      MEMBERS.splice(index, 1);
      this._search$.next();
    }
  }

  banMember(id: number): void {
    const member = MEMBERS.find((res) => res.id === id);
    if (member) {
      member.isBanned = true;
      member.status = 'Banned';
      member.isActive = false;
      this._search$.next();
    }
  }

  unbanMember(id: number): void {
    const member = MEMBERS.find((res) => res.id === id);
    if (member) {
      member.isBanned = false;
      member.status = 'Active';
      member.isActive = true;
      this._search$.next();
    }
  }

  // Get unique values for filters
  getUniqueRoles(): string[] {
    return [...new Set(MEMBERS.map((m) => m.role))];
  }

  getUniqueMembershipTypes(): string[] {
    return [...new Set(MEMBERS.map((m) => m.membershipType))];
  }

  getUniqueCountries(): string[] {
    return [...new Set(MEMBERS.map((m) => m.country))];
  }
}

