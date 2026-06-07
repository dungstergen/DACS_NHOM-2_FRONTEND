import { get, post, update, remove } from "../app/config/axios-configs";
import type { AmenityResponse, AmenityListResponse } from "../interface/amenity.interface";

export const AmenityService = {
  getAmenities: async (page: number = 1, perPage: number = 50): Promise<AmenityListResponse> => {
    return get<AmenityListResponse>({
      url: "/api/admin/amenities",
      params: { page, per_page: perPage },
    });
  },

  createAmenity: async (name: string): Promise<AmenityResponse> => {
    return post<AmenityResponse>({
      url: "/api/admin/amenities",
      data: { name },
    });
  },

  updateAmenity: async (id: number, name: string): Promise<AmenityResponse> => {
    return update<AmenityResponse>({
      url: `/api/admin/amenities/${id}`,
      data: { name },
    });
  },

  deleteAmenity: async (id: number): Promise<{ message: string }> => {
    return remove<{ message: string }>({
      url: `/api/admin/amenities/${id}`,
    });
  },
};
export default AmenityService;
