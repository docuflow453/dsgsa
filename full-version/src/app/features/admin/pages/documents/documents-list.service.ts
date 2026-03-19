/**
 * Documents List Service
 * Manages state and operations for the Documents List feature
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, debounceTime, delay, of, switchMap, tap } from 'rxjs';
import { Document, SortColumn, SortDirection } from './documents-list-type';
import { DOCUMENTS } from './documents-list-data';

/**
 * Search State Interface
 */
interface SearchResult {
  documents: Document[];
  total: number;
}

/**
 * Sort Event Interface
 */
interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

/**
 * Compare function for sorting
 */
const compare = (v1: string | number | Date, v2: string | number | Date) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

/**
 * Sort function
 */
function sort(documents: Document[], column: SortColumn, direction: string): Document[] {
  if (direction === '' || column === '') {
    return documents;
  } else {
    return [...documents].sort((a, b) => {
      const res = compare(a[column] as any, b[column] as any);
      return direction === 'asc' ? res : -res;
    });
  }
}

/**
 * Match function for filtering
 */
function matches(document: Document, term: string, statusFilter: string, typeFilter: string): boolean {
  const searchTerm = term.toLowerCase();
  
  // Status filter
  if (statusFilter && document.status !== statusFilter) {
    return false;
  }
  
  // Type filter
  if (typeFilter && document.type !== typeFilter) {
    return false;
  }
  
  // Search term filter
  if (term) {
    const matchesName = document.name.toLowerCase().includes(searchTerm);
    const matchesDescription = document.description?.toLowerCase().includes(searchTerm) || false;
    const matchesFileName = document.fileName.toLowerCase().includes(searchTerm);
    const matchesCategory = document.category?.toLowerCase().includes(searchTerm) || false;
    const matchesTags = document.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) || false;

    return matchesName || matchesDescription || matchesFileName || matchesCategory || matchesTags;
  }
  
  return true;
}

@Injectable()
export class DocumentsListService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _documents$ = new BehaviorSubject<Document[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '' as SortColumn,
    sortDirection: '' as SortDirection,
    statusFilter: '',
    typeFilter: ''
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
        this._documents$.next(result.documents);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  // Observables
  get documents$(): Observable<Document[]> {
    return this._documents$.asObservable();
  }
  get total$(): Observable<number> {
    return this._total$.asObservable();
  }
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  // Getters and Setters
  get page() {
    return this._state.page;
  }
  set page(page: number) {
    this._set({ page });
  }

  get pageSize() {
    return this._state.pageSize;
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }

  get searchTerm() {
    return this._state.searchTerm;
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }

  get sortColumn() {
    return this._state.sortColumn;
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }

  get sortDirection() {
    return this._state.sortDirection;
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  get statusFilter() {
    return this._state.statusFilter;
  }
  set statusFilter(statusFilter: string) {
    this._set({ statusFilter });
  }

  get typeFilter() {
    return this._state.typeFilter;
  }
  set typeFilter(typeFilter: string) {
    this._set({ typeFilter });
  }

  /**
   * Set state and trigger search
   */
  private _set(patch: Partial<typeof this._state>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  /**
   * Perform search with current state
   */
  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm, statusFilter, typeFilter } = this._state;

    // 1. Filter
    let documents = DOCUMENTS.filter((document) => matches(document, searchTerm, statusFilter, typeFilter));
    const total = documents.length;

    // 2. Sort
    documents = sort(documents, sortColumn, sortDirection);

    // 3. Paginate
    documents = documents.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({ documents, total });
  }

  /**
   * Sort documents
   */
  onSort({ column, direction }: SortEvent) {
    // Reset other columns
    this._state.sortColumn = column;
    this._state.sortDirection = direction;
    this._search$.next();
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this._state.searchTerm = '';
    this._state.statusFilter = '';
    this._state.typeFilter = '';
    this._state.page = 1;
    this._search$.next();
  }

  /**
   * Get unique statuses from documents
   */
  getUniqueStatuses(): string[] {
    return [...new Set(DOCUMENTS.map((doc) => doc.status))].sort();
  }

  /**
   * Get unique types from documents
   */
  getUniqueTypes(): string[] {
    return [...new Set(DOCUMENTS.map((doc) => doc.type))].sort();
  }

  /**
   * Delete a document
   */
  deleteDocument(id: number): Observable<boolean> {
    // In a real app, this would call an API
    const index = DOCUMENTS.findIndex((doc) => doc.id === id);
    if (index > -1) {
      DOCUMENTS.splice(index, 1);
      this._search$.next();
      return of(true);
    }
    return of(false);
  }

  /**
   * Get document by ID
   */
  getDocumentById(id: number): Document | undefined {
    return DOCUMENTS.find((doc) => doc.id === id);
  }

  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

