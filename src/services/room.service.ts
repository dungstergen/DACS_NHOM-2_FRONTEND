import { get, post, update, remove } from "../app/config/axios-configs";
import type { RoomResponse, RoomListResponse, RoomCreatePayload, RoomUpdatePayload } from "../interface/room.interface";

export const RoomService = {
  getRooms: async (
    page: number = 1,
    filters?: { status?: string; q?: string; perPage?: number }
  ): Promise<RoomListResponse> => {
    return get<RoomListResponse>({
      url: "/api/admin/rooms",
      params: {
        page,
        per_page: filters?.perPage || 15,
        status: filters?.status === "all" ? undefined : filters?.status,
        q: filters?.q || undefined,
      },
    });
  },

  getRoom: async (id: number): Promise<RoomResponse> => {
    return get<RoomResponse>({
      url: `/api/admin/rooms/${id}`,
    });
  },

  createRoom: async (
    data: RoomCreatePayload
  ): Promise<RoomResponse> => {
    return post<RoomResponse>({
      url: "/api/admin/rooms",
      data,
    });
  },

  updateRoom: async (
    id: number,
    data: RoomUpdatePayload
  ): Promise<RoomResponse> => {
    return update<RoomResponse>({
      url: `/api/admin/rooms/${id}`,
      data,
    });
  },

  deleteRoom: async (id: number): Promise<{ message: string }> => {
    return remove<{ message: string }>({
      url: `/api/admin/rooms/${id}`,
    });
  },

  updateRoomStatus: async (id: number, status: "available" | "occupied"): Promise<RoomResponse> => {
    return update<RoomResponse>({
      url: `/api/admin/rooms/${id}/status`,
      data: { status },
    });
  },
};

export default RoomService;
