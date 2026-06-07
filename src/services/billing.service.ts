import { get, update } from "../app/config/axios-configs";
import type { BillingConfig, BillingConfigUpdateResponse } from "../interface/billing.interface";

export const BillingConfigService = {
  getBillingConfig: async (): Promise<BillingConfig> => {
    return get<BillingConfig>({
      url: "/api/admin/settings/billing",
    });
  },

  updateBillingConfig: async (data: BillingConfig): Promise<BillingConfigUpdateResponse> => {
    return update<BillingConfigUpdateResponse>({
      url: "/api/admin/settings/billing",
      data,
    });
  },
};

export default BillingConfigService;
