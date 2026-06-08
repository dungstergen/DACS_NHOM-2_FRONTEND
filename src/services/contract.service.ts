import { get, post, patch } from "../app/config/axios-configs";
import type {
  ContractListResponse,
  RentalContract,
  ContractCreatePayload,
  ContractMutationResponse,
  ContractStatus,
} from "../interface/contract.interface";

export const ContractService = {
  getContracts: async (params?: {
    status?: string;
    room_id?: number;
    user_id?: number;
    page?: number;
  }): Promise<ContractListResponse> => {
    return get<ContractListResponse>({
      url: "/api/admin/contracts",
      params: {
        page: 1,
        ...params,
      },
    });
  },

  createContract: async (
    data: ContractCreatePayload
  ): Promise<ContractMutationResponse> => {
    return post<ContractMutationResponse>({
      url: "/api/admin/contracts",
      data,
    });
  },

  getContractDetails: async (id: number): Promise<RentalContract> => {
    return get<RentalContract>({
      url: `/api/admin/contracts/${id}`,
    });
  },

  updateContractStatus: async (
    id: number,
    status: ContractStatus
  ): Promise<ContractMutationResponse> => {
    return patch<ContractMutationResponse>({
      url: `/api/admin/contracts/${id}/status`,
      data: { status },
    });
  },
};

export default ContractService;
