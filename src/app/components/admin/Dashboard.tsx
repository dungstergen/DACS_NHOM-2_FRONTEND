import { useState } from "react";
import { Home, Wallet, Users, ArrowUpRight } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { DatePicker, Spin, Tag, Card } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Avatar, AvatarImage } from "../ui/avatar";
import { DASHBOARD_REVENUE, APPOINTMENTS } from "../../data/mock";
import { useDashboardSummary } from "../../../hook/useDashboard";

export function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(undefined);
  const { data, isLoading } = useDashboardSummary(selectedMonth);

  const handleMonthChange = (_date: Dayjs | null, dateString: string | null) => {
    setSelectedMonth(dateString as string || undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  const summary = data;

  const totalRevenue = summary?.finance.total_revenue || 0;
  const pendingBills = summary?.finance.pending_bills || 0;
  const totalRooms = summary?.operations.total_rooms || 0;
  const occupiedRooms = summary?.operations.occupied_rooms || 0;
  const availableRooms = summary?.operations.available_rooms || 0;
  const totalUsers = summary?.operations.total_users || 0;

  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const pieData = [
    { name: "Đã thuê", value: occupiedRooms, color: "#6366f1" },
    { name: "Trống", value: availableRooms, color: "#e2e8f0" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-muted-foreground mt-1">
            {selectedMonth ? `Dữ liệu tháng ${selectedMonth}` : "Dữ liệu toàn thời gian"}
          </p>
        </div>
        <div>
          <DatePicker
            picker="month"
            placeholder="Chọn tháng..."
            onChange={handleMonthChange}
            value={selectedMonth ? dayjs(selectedMonth, "YYYY-MM") : null}
            className="h-10"
          />
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border shadow-none overflow-hidden relative" bodyStyle={{ padding: "20px" }}>
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 opacity-10" />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="mt-4 text-sm text-muted-foreground">Doanh thu {selectedMonth ? "tháng" : "tổng"}</div>
          <div className="text-2xl tracking-tight mt-1">{formatCurrency(totalRevenue)}</div>
        </Card>

        <Card className="rounded-2xl border-border shadow-none overflow-hidden relative" bodyStyle={{ padding: "20px" }}>
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 opacity-10" />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="mt-4 text-sm text-muted-foreground">Chưa thu (Nợ)</div>
          <div className="text-2xl tracking-tight mt-1">{formatCurrency(pendingBills)}</div>
        </Card>

        <Card className="rounded-2xl border-border shadow-none overflow-hidden relative" bodyStyle={{ padding: "20px" }}>
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 opacity-10" />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
            <Home className="w-5 h-5" />
          </div>
          <div className="mt-4 text-sm text-muted-foreground">Phòng đang quản lý</div>
          <div className="text-2xl tracking-tight mt-1">{totalRooms}</div>
          <div className="flex items-center gap-1 text-xs mt-2 text-emerald-600">
            Tỷ lệ lấp đầy: {occupancyRate}%
          </div>
        </Card>

        <Card className="rounded-2xl border-border shadow-none overflow-hidden relative" bodyStyle={{ padding: "20px" }}>
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 opacity-10" />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
            <Users className="w-5 h-5" />
          </div>
          <div className="mt-4 text-sm text-muted-foreground">Khách thuê hệ thống</div>
          <div className="text-2xl tracking-tight mt-1">{totalUsers}</div>
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3>Doanh thu 7 tháng</h3>
              <p className="text-sm text-muted-foreground">Đơn vị: triệu đồng</p>
            </div>
            <Tag color="success" className="border-0 bg-emerald-50 text-emerald-700">↑ 12.4%</Tag>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={DASHBOARD_REVENUE}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white border border-border p-6">
          <h3 className="mb-1">Trạng thái phòng</h3>
          <p className="text-sm text-muted-foreground mb-4">Tổng {totalRooms} phòng</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={4}>
                {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: d.color }} /> {d.name}</div>
                <span>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOOKINGS BAR + RECENT APPTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border border-border p-6">
          <h3 className="mb-4">Số lượng đặt cọc / tháng</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DASHBOARD_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#a855f7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-white border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Lịch hẹn sắp tới</h3>
            <button className="text-sm text-indigo-600 flex items-center gap-1">Xem tất cả <ArrowUpRight className="w-3 h-3" /></button>
          </div>
          <div className="divide-y divide-border">
            {APPOINTMENTS.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Avatar><AvatarImage src={`https://i.pravatar.cc/100?u=${a.id}`} /></Avatar>
                  <div>
                    <div className="text-sm">{a.customer}</div>
                    <div className="text-xs text-muted-foreground">{a.room}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{a.date} • {a.time}</div>
                  <Tag
                    color={a.status === "confirmed" ? "success" : a.status === "pending" ? "warning" : "error"}
                    className="border-0 mt-1"
                  >
                    {a.status === "confirmed" ? "Đã xác nhận" : a.status === "pending" ? "Chờ duyệt" : "Đã hủy"}
                  </Tag>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
