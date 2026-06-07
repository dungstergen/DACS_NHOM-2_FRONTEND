import type { Amenity } from "./amenity.interface";

export interface RoomImage {
  id?: number;
  url: string;
  sort_order: number;
}

export interface Room {
  id: number;
  title: string;
  description: string | null;
  address: string | null;
  district: string | null;
  city: string | null;
  price_monthly: number;
  deposit_amount: number;
  area_sqm: number | null;
  max_occupants: number | null;
  status: "available" | "occupied";
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  amenities?: Amenity[];
  images?: RoomImage[];
}

export interface RoomResponse {
  data: Room;
}

export interface RoomCreatePayload {
  title: string;
  description: string | null;
  address: string | null;
  district: string | null;
  city: string | null;
  price_monthly: number;
  deposit_amount: number;
  area_sqm: number | null;
  max_occupants: number | null;
  status: "available" | "occupied";
  amenities?: number[];
  images?: { url: string; sort_order: number }[];
}

export interface RoomUpdatePayload extends Partial<RoomCreatePayload> {}

export interface RoomListResponse {
  data: Room[];
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
