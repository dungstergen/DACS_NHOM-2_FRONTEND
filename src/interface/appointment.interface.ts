import type { Room } from "./room.interface";
import type { User } from "./auth.interface";

export type AppointmentStatus = "pending" | "confirmed" | "cancelled";

export interface Appointment {
  id: number;
  room_id: number;
  user_id: number;
  scheduled_at: string;
  status: AppointmentStatus;
  note: string | null;
  room?: Room;
  user?: User;
  created_at?: string;
  updated_at?: string;
}

export interface AppointmentListResponse {
  data: Appointment[];
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

export interface AppointmentResponse {
  data: Appointment;
}
