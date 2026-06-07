import { TrendingUp, TrendingDown, Home, Calendar, Wallet, Users, ArrowUpRight } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { DASHBOARD_REVENUE, OCCUPANCY_DATA, APPOINTMENTS } from "../../data/mock";

export function Dashboard() {
  const stats = [
    { label: "Doanh thu tháng", value: "276M ₫", change: "+12.4%", up: true, icon: Wallet, color: "from-indigo-500 to-purple-500" },
    { label: "Phòng đang quản lý", value: "66", change: "+3", up: true, icon: Home, color: "from-emerald-500 to-teal-500" },
    { label: "Lịch hẹn tuần này", value: "28", change: "+8", up: true, icon: Calendar, color: "from-amber-500 to-orange-500" },
    { label: "Tỷ lệ lấp đầy", value: "78%", change: "-2.1%", up: false, icon: Users, color: "from-pink-500 to-rose-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-muted-foreground mt-1">Cập nhật tới hôm nay, 06/05/2026</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="relative overflow-hidden p-5 rounded-2xl bg-white border border-border">
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${s.color} opacity-10`} />
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">{s.label}</div>
            <div className="text-2xl tracking-tight mt-1">{s.value}</div>
            <div className={`flex items-center gap-1 text-xs mt-2 ${s.up ? "text-emerald-600" : "text-rose-600"}`}>
              {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {s.change}
              <span className="text-muted-foreground">so với tháng trước</span>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3>Doanh thu 7 tháng</h3>
              <p className="text-sm text-muted-foreground">Đơn vị: triệu đồng</p>
            </div>
            <Badge className="bg-emerald-50 text-emerald-700 border-0">↑ 12.4%</Badge>
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
          <p className="text-sm text-muted-foreground mb-4">Tổng 66 phòng</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={OCCUPANCY_DATA} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={4}>
                {OCCUPANCY_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {OCCUPANCY_DATA.map((d) => (
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
                  <Badge
                    className={
                      a.status === "confirmed"
                        ? "bg-emerald-50 text-emerald-700 border-0"
                        : a.status === "pending"
                        ? "bg-amber-50 text-amber-700 border-0"
                        : "bg-rose-50 text-rose-700 border-0"
                    }
                  >
                    {a.status === "confirmed" ? "Đã xác nhận" : a.status === "pending" ? "Chờ duyệt" : "Đã hủy"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
