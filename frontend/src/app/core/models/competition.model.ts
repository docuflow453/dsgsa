export interface Competition {
  id: number;
  name: string;
  slug?: string;
  competition_type?: string;
  entry_close: string;
  show_holding_body?: number;
  course_designer?: string;
  late_entry_fee?: number;
  terms_and_conditions?: string;
  entry_message?: string;
  close_message?: string;
  ground_message?: string;
  programme?: string;
  venue?: string;
  enquiries?: string;
  catering?: string;
  vet_inspections?: string;
  account_type?: string;
  account_name?: string;
  branch_code?: string;
  account_number?: string;
  bank_name?: string;
  payment_reference_prefix?: string;
  is_active: boolean;
  is_test: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompetitionDate {
  id: number;
  competition: number;
  start_date: string;
  start_time?: string;
  is_active: boolean;
}

export interface CompetitionClass {
  id: number;
  competition: number;
  grade?: number;
  class_type?: string;
  fee?: number;
  class_rule?: string;
  category?: string;
  approximate_start_time?: string;
  is_active: boolean;
}

export interface CompetitionExtra {
  id: number;
  competition: number;
  name: string;
  quantity?: number;
  price: number;
  is_stable: boolean;
  is_active: boolean;
}

export interface Grade {
  id: number;
  name: string;
  code?: string;
  description?: string;
  is_active: boolean;
}

export interface ClassType {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface ClassRule {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

