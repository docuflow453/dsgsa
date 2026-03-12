export interface Rider {
  id: number;
  user: number;
  saef_number?: string;
  id_number?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  ethnicity?: string;
  passport_number?: string;
  passport_expiry?: string;
  nationality?: string;
  address_line_1?: string;
  address_line_2?: string;
  province?: number;
  suburb?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  account_type?: string;
  account_name?: string;
  branch_code?: string;
  account_number?: string;
  bank_name?: string;
  is_active: boolean;
  is_international: boolean;
  is_test: boolean;
}

export interface Classification {
  id: number;
  name: string;
  is_pony: boolean;
  is_recreational: boolean;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SaefMembership {
  id: number;
  rider: number;
  year: number;
  approved_at?: string;
  approved_by?: number;
  created_at: string;
  updated_at: string;
}

