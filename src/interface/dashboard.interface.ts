export interface OperationsStats {
  total_rooms: number;
  available_rooms: number;
  occupied_rooms: number;
  total_users: number;
}

export interface FinanceStats {
  period: string; // 'all_time' or 'YYYY-MM'
  total_revenue: number;
  pending_bills: number;
  total_deposits: number;
}

export interface DashboardSummaryResponse {
  operations: OperationsStats;
  finance: FinanceStats;
}
