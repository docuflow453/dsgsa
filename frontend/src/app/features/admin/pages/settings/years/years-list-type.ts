/**
 * Years List Type Definitions
 * Interfaces and types for the Years List feature
 */

/**
 * Year Status Types - matching Django backend
 */
export type YearStatus = 'PENDING' | 'ACTIVE' | 'COMPLETE' | 'ARCHIVED';

/**
 * Year Interface
 * Represents a competition year/season in the system
 * Maps to Django Year model
 */
export interface Year {
  id: string; // UUID from backend
  name: string;
  year: number;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  is_registration_open: boolean;
  status: YearStatus;
  notes: string;
  is_active: boolean;
  is_current: boolean;
  days_remaining: number;
  duration_days: number;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}

/**
 * Year Create/Update Payload
 */
export interface YearCreatePayload {
  name: string;
  year: number;
  start_date: string;
  end_date: string;
  is_registration_open?: boolean;
  status?: YearStatus;
  notes?: string;
}

export interface YearUpdatePayload {
  name?: string;
  year?: number;
  start_date?: string;
  end_date?: string;
  is_registration_open?: boolean;
  status?: YearStatus;
  notes?: string;
}

/**
 * Year List Response from API
 */
export interface YearListResponse {
  count: number;
  results: Year[];
}

