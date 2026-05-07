import {
  LayoutDashboard, Home, Calendar, Wallet, FileText, Receipt,
  Settings2, BookOpen, Flag, LogOut, Search, Bell, ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

type Props = {
  current: string;
  onNavigate: (k: string) => void;
  onSwitchUser: () => void;
  children: React.ReactNode;
};

export function AdminLayout({ current, onNavigate, onSwitchUser, children }: Props) {
  const groups = [
    {
      label: "Tổng quan",
      items: [{ k: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
    },
    {
      label: "Quản lý phòng",
      items: [
        { k: "rooms", label: "Danh sách phòng", icon: Home },
        { k: "appointments", label: "Lịch hẹn xem phòng", icon: Calendar },
        { k: "deposits", label: "Đặt cọc", icon: Wallet },
        { k: "contracts", label: "Hợp đồng thuê", icon: FileText },
        { k: "invoices", label: "Hóa đơn tháng", icon: Receipt },
      ],
    },
    {
      label: "Hệ thống",
      items: [
        { k: "costs", label: "Chi phí hệ thống", icon: Settings2 },
        { k: "blog", label: "Quản lý blog", icon: BookOpen },
        { k: "reports", label: "Báo cáo vi phạm", icon: Flag },
      ],
    },
  ];

  const flat = groups.flatMap((g) => g.items);
  const currentLabel = flat.find((i) => i.k === current)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid grid-cols-[260px_1fr] min-h-screen">
        {/* SIDEBAR */}
        <aside className="bg-white border-r border-border flex flex-col">
          <div className="px-6 h-16 flex items-center border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm tracking-tight">TroHub</div>
                <div className="text-xs text-muted-foreground">Admin Console</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            {groups.map((g) => (
              <div key={g.label}>
                <div className="px-3 text-xs uppercase tracking-wider text-muted-foreground mb-2">{g.label}</div>
                <div className="space-y-1">
                  {g.items.map((it) => {
                    const Icon = it.icon;
                    const active = current === it.k;
                    return (
                      <button
                        key={it.k}
                        onClick={() => onNavigate(it.k)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                          active
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{it.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-3 border-t border-border space-y-1">
            <button
              onClick={onSwitchUser}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LogOut className="w-4 h-4" /> Về trang người dùng
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="flex flex-col">
          <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Admin</span><ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground">{currentLabel}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9 rounded-full bg-slate-50 border-0" placeholder="Tìm kiếm..." />
              </div>
              <button className="relative p-2 rounded-full hover:bg-muted">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 bg-pink-500 border-0">5</Badge>
              </button>
              <Avatar className="w-9 h-9">
                <AvatarImage src="https://i.pravatar.cc/100?img=8" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </div>
  );
}
