import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BillService } from "../services/bill.service";
import type { BillCreatePayload, BillStatus } from "../interface/bill.interface";

export const useBills = (params?: {
  status?: string;
  billing_month?: string;
  contract_id?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["bills", params],
    queryFn: () => BillService.getBills(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useBillDetails = (id: number) => {
  return useQuery({
    queryKey: ["bill", id],
    queryFn: () => BillService.getBillDetails(id),
    enabled: !!id,
  });
};

export const useCreateBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BillCreatePayload) => BillService.createBill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });
};

export const useUpdateBillStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: BillStatus }) =>
      BillService.updateBillStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["bill", variables.id] });
    },
  });
};
