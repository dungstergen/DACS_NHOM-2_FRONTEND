import { get, patch } from "../app/config/axios-configs";
import type {
  OrderListResponse,
  OrderResponse,
  OrderUpdatePayload,
} from "../interface/order.interface";

export const OrderService = {
  getOrders: async (params?: {
    status?: string;
    room_id?: number;
    user_id?: number;
    page?: number;
    per_page?: number;
  }): Promise<OrderListResponse> => {
    return get<OrderListResponse>({
      url: "/api/admin/orders",
      params: {
        page: 1,
        per_page: 50,
        ...params,
      },
    });
  },

  getOrderDetails: async (id: number): Promise<OrderResponse> => {
    return get<OrderResponse>({
      url: `/api/admin/orders/${id}`,
    });
  },

  updateOrder: async (
    id: number,
    data: OrderUpdatePayload
  ): Promise<OrderResponse> => {
    return patch<OrderResponse>({
      url: `/api/admin/orders/${id}`,
      data,
    });
  },
};

export default OrderService;
