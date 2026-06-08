import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppointmentService } from "../services/appointment.service";
import type { AppointmentStatus } from "../interface/appointment.interface";

export const useAppointments = (params?: {
  status?: string;
  room_id?: number;
  user_id?: number;
  scheduled_from?: string;
  scheduled_to?: string;
  page?: number;
  per_page?: number;
}) => {
  return useQuery({
    queryKey: ["appointments", params],
    queryFn: () => AppointmentService.getAppointments(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: AppointmentStatus;
    }) => AppointmentService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};
