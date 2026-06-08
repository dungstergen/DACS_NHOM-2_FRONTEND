import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "../services/dashboard.service";

export const useDashboardSummary = (month?: string) => {
  return useQuery({
    queryKey: ["dashboard_summary", month],
    queryFn: () => DashboardService.getSummary(month),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
