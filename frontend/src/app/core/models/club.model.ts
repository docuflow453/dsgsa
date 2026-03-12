export interface Club {
  id: number;
  user: number;
  name: string;
  saef_number?: string;
  address_line_1: string;
  address_line_2?: string;
  province?: number;
  suburb?: string;
  city: string;
  postal_code: string;
  country: string;
  is_active: boolean;
  is_test: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShowHoldingBody {
  id: number;
  user: number;
  name: string;
  saef_number?: string;
  established_at?: string;
  website?: string;
  address_line_1: string;
  address_line_2?: string;
  province?: number;
  suburb?: string;
  city: string;
  postal_code: string;
  country: string;
  account_type?: string;
  account_name?: string;
  branch_code?: string;
  account_number?: string;
  bank_name?: string;
  is_active: boolean;
  is_test: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface Levy {
  id: number;
  name: string;
  description?: string;
  fee_exclusive: number;
  fee: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Extra {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity_available?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

