import { get } from "../app/config/axios-configs";
import type { DashboardSummaryResponse } from "../interface/dashboard.interface";

export const DashboardService = {
  getSummary: async (month?: string): Promise<DashboardSummaryResponse> => {
    let url = "/api/admin/dashboard/summary";
    if (month) {
      url += `?month=${month}`;
    }
    return await get<DashboardSummaryResponse>({ url });
  },
};
