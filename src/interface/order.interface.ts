import type { Room } from "./room.interface";
import type { User } from "./auth.interface";

export type OrderStatus = "pending" | "paid" | "cancelled" | "refunded";

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  status: string;
  provider: string | null;
  transaction_id: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface Order {
  id: number;
  room_id: number;
  user_id: number;
  amount: number;
  status: OrderStatus;
  payment_method: string | null;
  payment_ref: string | null;
  room?: Room;
  user?: User;
  payments?: Payment[];
  created_at?: string;
  updated_at?: string;
}

export interface OrderListResponse {
  data: Order[];
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface OrderResponse {
  data: Order;
}

export interface OrderUpdatePayload {
  status: OrderStatus;
  payment_method?: string;
  payment_ref?: string;
}
