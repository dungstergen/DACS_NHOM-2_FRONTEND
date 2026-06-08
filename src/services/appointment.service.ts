import { get, patch } from "../app/config/axios-configs";
import type {
  AppointmentListResponse,
  AppointmentResponse,
  AppointmentStatus,
} from "../interface/appointment.interface";

export const AppointmentService = {
  getAppointments: async (params?: {
    status?: string;
    room_id?: number;
    user_id?: number;
    scheduled_from?: string;
    scheduled_to?: string;
    page?: number;
    per_page?: number;
  }): Promise<AppointmentListResponse> => {
    return get<AppointmentListResponse>({
      url: "/api/admin/appointments",
      params: {
        page: 1,
        per_page: 50,
        ...params,
      },
    });
  },

  updateStatus: async (
    id: number,
    status: AppointmentStatus
  ): Promise<AppointmentResponse> => {
    return patch<AppointmentResponse>({
      url: `/api/admin/appointments/${id}`,
      data: { status },
    });
  },
};

export default AppointmentService;
