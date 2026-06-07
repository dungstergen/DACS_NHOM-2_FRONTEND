import { Edit3 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";

export function SystemCosts() {
  const items = [
    { k: "electric", label: "Điện", unit: "đ/kWh", val: 3500, icon: "⚡" },
    { k: "water", label: "Nước", unit: "đ/m³", val: 25000, icon: "💧" },
    { k: "internet", label: "Internet", unit: "đ/tháng", val: 100000, icon: "📶" },
    { k: "trash", label: "Phí rác", unit: "đ/tháng", val: 30000, icon: "🗑️" },
    { k: "parking-bike", label: "Gửi xe máy", unit: "đ/xe/tháng", val: 100000, icon: "🛵" },
    { k: "parking-car", label: "Gửi xe ô tô", unit: "đ/xe/tháng", val: 1500000, icon: "🚗" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl tracking-tight">Chi phí hệ thống</h1>
        <p className="text-muted-foreground mt-1">Cấu hình giá điện, nước và các chi phí dịch vụ áp dụng cho toàn hệ thống</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.k} className="rounded-2xl bg-white border border-border p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-2xl">{it.icon}</div>
                <div>
                  <div>{it.label}</div>
                  <div className="text-xs text-muted-foreground">{it.unit}</div>
                </div>
              </div>
              <Edit3 className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="mt-4">
              <Input defaultValue={it.val.toLocaleString()} className="text-lg" />
            </div>
          </div>
        ))}
      </div>
      <Button onClick={() => toast.success("Đã lưu cấu hình chi phí")} className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600">
        Lưu thay đổi
      </Button>
    </div>
  );
}
export default SystemCosts;
