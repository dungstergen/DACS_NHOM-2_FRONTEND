import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "../services/order.service";
import type { OrderUpdatePayload } from "../interface/order.interface";

export const useOrders = (params?: {
  status?: string;
  room_id?: number;
  user_id?: number;
  page?: number;
  per_page?: number;
}) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => OrderService.getOrders(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => OrderService.getOrderDetails(id),
    enabled: !!id,
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: OrderUpdatePayload;
    }) => OrderService.updateOrder(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
    },
  });
};
