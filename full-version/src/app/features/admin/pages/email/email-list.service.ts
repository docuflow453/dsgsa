/**
 * Email List Service
 * Handles data management, filtering, sorting, and pagination for the Bulk Email List
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, debounceTime, delay, of, switchMap, tap } from 'rxjs';
import { BulkEmail, SortColumn, SortDirection, EmailType, RecipientGroup, EmailStatus } from './email-list-type';
import { BULK_EMAILS } from './email-list-data';

/**
 * Search Result Interface
 */
interface SearchResult {
  emails: BulkEmail[];
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
  emailTypeFilter: string;
  sentToFilter: string;
  statusFilter: string;
}

/**
 * Compare function for sorting
 */
const compare = (v1: string | number | Date | undefined, v2: string | number | Date | undefined) => {
  if (v1 === undefined && v2 === undefined) return 0;
  if (v1 === undefined) return 1;
  if (v2 === undefined) return -1;
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
};

/**
 * Sort function
 */
function sort(emails: BulkEmail[], column: SortColumn, direction: string): BulkEmail[] {
  if (direction === '' || column === '') {
    return emails;
  } else {
    return [...emails].sort((a, b) => {
      const aVal = a[column as keyof BulkEmail];
      const bVal = b[column as keyof BulkEmail];
      const res = compare(aVal as string | number | Date, bVal as string | number | Date);
      return direction === 'asc' ? res : -res;
    });
  }
}

/**
 * Match function for filtering
 */
function matches(email: BulkEmail, term: string, emailTypeFilter: string, sentToFilter: string, statusFilter: string): boolean {
  const searchTerm = term.toLowerCase();

  // Email Type filter
  if (emailTypeFilter && email.emailType !== emailTypeFilter) {
    return false;
  }

  // Sent To filter
  if (sentToFilter && email.sentTo !== sentToFilter) {
    return false;
  }

  // Status filter
  if (statusFilter && email.status !== statusFilter) {
    return false;
  }

  // Search term filter
  if (term) {
    const matchesSubject = email.subject.toLowerCase().includes(searchTerm);
    const matchesSentBy = email.sentBy.toLowerCase().includes(searchTerm);
    const matchesSentTo = email.sentTo.toLowerCase().includes(searchTerm);
    const matchesContent = email.content.toLowerCase().includes(searchTerm);

    return matchesSubject || matchesSentBy || matchesSentTo || matchesContent;
  }

  return true;
}

@Injectable({ providedIn: 'root' })
export class EmailListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _emails$ = new BehaviorSubject<BulkEmail[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    emailTypeFilter: '',
    sentToFilter: '',
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
        this._emails$.next(result.emails);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  /**
   * Getters for observables
   */
  get emails$() {
    return this._emails$.asObservable();
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
  get sortColumn() {
    return this._state.sortColumn;
  }
  get sortDirection() {
    return this._state.sortDirection;
  }
  get emailTypeFilter() {
    return this._state.emailTypeFilter;
  }
  get sentToFilter() {
    return this._state.sentToFilter;
  }
  get statusFilter() {
    return this._state.statusFilter;
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
  set emailTypeFilter(emailTypeFilter: string) {
    this._set({ emailTypeFilter });
  }
  set sentToFilter(sentToFilter: string) {
    this._set({ sentToFilter });
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
    const { sortColumn, sortDirection, pageSize, page, searchTerm, emailTypeFilter, sentToFilter, statusFilter } = this._state;

    // 1. Filter
    let emails = BULK_EMAILS.filter((email) => matches(email, searchTerm, emailTypeFilter, sentToFilter, statusFilter));
    const total = emails.length;

    // 2. Sort
    emails = sort(emails, sortColumn, sortDirection);

    // 3. Paginate
    emails = emails.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ emails, total });
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this._set({
      searchTerm: '',
      emailTypeFilter: '',
      sentToFilter: '',
      statusFilter: '',
      page: 1
    });
  }

  /**
   * Get unique email types for filter dropdown
   */
  getUniqueEmailTypes(): EmailType[] {
    return ['General', 'Important', 'Marketing'];
  }

  /**
   * Get unique recipient groups for filter dropdown
   */
  getUniqueRecipientGroups(): RecipientGroup[] {
    return ['All Members', 'Riders', 'Judges', 'Clubs', 'Show Holding Bodies', 'Officials', 'SAEF Admins'];
  }

  /**
   * Get unique statuses for filter dropdown
   */
  getUniqueStatuses(): EmailStatus[] {
    return ['Sent', 'Draft', 'Archived', 'Failed'];
  }

  /**
   * Archive email
   */
  archiveEmail(id: number): Observable<boolean> {
    const email = BULK_EMAILS.find((e) => e.id === id);
    if (email) {
      email.status = 'Archived';
      this._search$.next();
      return of(true);
    }
    return of(false);
  }

  /**
   * Delete email
   */
  deleteEmail(id: number): Observable<boolean> {
    const index = BULK_EMAILS.findIndex((e) => e.id === id);
    if (index > -1) {
      BULK_EMAILS.splice(index, 1);
      this._search$.next();
      return of(true);
    }
    return of(false);
  }

  /**
   * Resend email
   */
  resendEmail(id: number): Observable<boolean> {
    const email = BULK_EMAILS.find((e) => e.id === id);
    if (email) {
      // Create a copy with new date
      const newEmail: BulkEmail = {
        ...email,
        id: Math.max(...BULK_EMAILS.map((e) => e.id)) + 1,
        dateSent: new Date(),
        dateCreated: new Date(),
        status: 'Sent'
      };
      BULK_EMAILS.unshift(newEmail);
      this._search$.next();
      return of(true);
    }
    return of(false);
  }
}


