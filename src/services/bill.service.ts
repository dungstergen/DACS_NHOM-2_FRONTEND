import { get, post, patch } from "../app/config/axios-configs";
import type {
  BillListResponse,
  MonthlyBill,
  BillCreatePayload,
  BillResponse,
  BillStatus,
} from "../interface/bill.interface";

export const BillService = {
  getBills: async (params?: {
    status?: string;
    billing_month?: string;
    contract_id?: number;
    page?: number;
  }): Promise<BillListResponse> => {
    return get<BillListResponse>({
      url: "/api/admin/bills",
      params: {
        page: 1,
        ...params,
      },
    });
  },

  createBill: async (data: BillCreatePayload): Promise<BillResponse> => {
    return post<BillResponse>({
      url: "/api/admin/bills",
      data,
    });
  },

  getBillDetails: async (id: number): Promise<MonthlyBill> => {
    return get<MonthlyBill>({
      url: `/api/admin/bills/${id}`,
    });
  },

  updateBillStatus: async (
    id: number,
    status: BillStatus
  ): Promise<BillResponse> => {
    return patch<BillResponse>({
      url: `/api/admin/bills/${id}/status`,
      data: { status },
    });
  },
};

export default BillService;
