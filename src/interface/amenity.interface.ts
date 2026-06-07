export interface Amenity {
  id: number;
  name: string;
}

export interface AmenityResponse {
  data: Amenity;
}

export interface AmenityListResponse {
  data: Amenity[];
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
