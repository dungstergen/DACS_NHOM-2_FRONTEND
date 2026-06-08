import type { RentalContract } from "./contract.interface";

export type BillStatus = "unpaid" | "paid";

export interface MonthlyBill {
  id: number;
  contract_id: number;
  billing_month: string; // Y-m format, e.g. "2026-06"
  room_rent: number;
  electricity_old: number;
  electricity_new: number;
  electricity_cost: number;
  water_old: number;
  water_new: number;
  water_cost: number;
  internet_cost: number;
  trash_cost: number;
  parking_cost: number;
  total_amount: number;
  status: BillStatus;
  contract?: RentalContract;
  created_at?: string;
  updated_at?: string;
}

export interface BillListResponse {
  data: MonthlyBill[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

export interface BillCreatePayload {
  contract_id: number;
  billing_month: string; // Y-m format, e.g. "2026-06"
  electricity_old: number;
  electricity_new: number;
  water_old: number;
  water_new: number;
}

export interface BillResponse {
  message: string;
  bill: MonthlyBill;
}
