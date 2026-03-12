export interface Entry {
  id: number;
  rider: number;
  horse: number;
  competition: number;
  amount: number;
  transaction?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface EntryClass {
  id: number;
  entry: number;
  competition_class: number;
  fee: number;
  is_active: boolean;
}

export interface Transaction {
  id: number;
  entry: number;
  amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  approved_at?: string;
  approved_by?: number;
  created_at: string;
  updated_at: string;
}

export interface TransactionExtra {
  id: number;
  transaction: number;
  extra: number;
  quantity: number;
  price: number;
}

export interface RidingOrder {
  id: number;
  competition_class: number;
  entry: number;
  order_number: number;
  start_time?: string;
  is_active: boolean;
}

