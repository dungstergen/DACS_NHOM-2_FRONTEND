import type { Room } from "./room.interface";
import type { User } from "./auth.interface";

export type ContractStatus = "draft" | "active" | "expired" | "terminated";

export interface RentalContract {
  id: number;
  room_id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit_amount: number;
  status: ContractStatus;
  room?: Room;
  user?: User;
  created_at?: string;
  updated_at?: string;
}

export interface ContractListResponse {
  data: RentalContract[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

export interface ContractCreatePayload {
  room_id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit_amount: number;
  status?: ContractStatus;
}

export interface ContractMutationResponse {
  message: string;
  contract: RentalContract;
}
