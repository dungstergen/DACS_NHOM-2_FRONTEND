export interface BillingConfig {
  id?: number;
  electricity_price: number;
  water_price: number;
  internet_price: number;
  trash_price: number;
  parking_price: number;
  created_at?: string;
  updated_at?: string;
}

export interface BillingConfigUpdateResponse {
  message: string;
  config: BillingConfig;
}
