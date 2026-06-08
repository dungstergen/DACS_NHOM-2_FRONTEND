import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractService } from "../services/contract.service";
import type { ContractCreatePayload, ContractStatus } from "../interface/contract.interface";

export const useContracts = (params?: {
  status?: string;
  room_id?: number;
  user_id?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["contracts", params],
    queryFn: () => ContractService.getContracts(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useContractDetails = (id: number) => {
  return useQuery({
    queryKey: ["contract", id],
    queryFn: () => ContractService.getContractDetails(id),
    enabled: !!id,
  });
};

export const useCreateContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ContractCreatePayload) => ContractService.createContract(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] }); // Invalidate rooms since room status changes
    },
  });
};

export const useUpdateContractStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: ContractStatus;
    }) => ContractService.updateContractStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] }); // Invalidate rooms since room status can change back to available
      queryClient.invalidateQueries({ queryKey: ["contract", variables.id] });
    },
  });
};
