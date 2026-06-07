import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RoomService } from "../services/room.service";
import type { RoomCreatePayload, RoomUpdatePayload } from "../interface/room.interface";

export const useRooms = (
  page: number = 1,
  filters?: { status?: string; q?: string; perPage?: number }
) => {
  return useQuery({
    queryKey: ["rooms", page, filters],
    queryFn: () => RoomService.getRooms(page, filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useRoom = (id: number) => {
  return useQuery({
    queryKey: ["room", id],
    queryFn: () => RoomService.getRoom(id),
    enabled: !!id,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RoomCreatePayload) => RoomService.createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: RoomUpdatePayload;
    }) => RoomService.updateRoom(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room", variables.id] });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => RoomService.deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};

export const useUpdateRoomStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: "available" | "occupied" }) =>
      RoomService.updateRoomStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room", variables.id] });
    },
  });
};
