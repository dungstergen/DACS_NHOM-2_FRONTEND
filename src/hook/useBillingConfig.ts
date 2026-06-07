import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BillingConfigService } from "../services/billing.service";
import type { BillingConfig } from "../interface/billing.interface";

export const useBillingConfig = () => {
  return useQuery({
    queryKey: ["billingConfig"],
    queryFn: () => BillingConfigService.getBillingConfig(),
  });
};

export const useUpdateBillingConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BillingConfig) => BillingConfigService.updateBillingConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billingConfig"] });
    },
  });
};
