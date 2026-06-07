import { useState } from "react";
import { Plus, FileText, Download, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { toast } from "sonner";

export function Contracts() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Hợp đồng thuê</h1>
          <p className="text-muted-foreground mt-1">Tạo và quản lý hợp đồng cho thuê phòng</p>
        </div>
        <Button onClick={() => setOpen(!open)} className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600">
          <Plus className="w-4 h-4 mr-1" /> Tạo hợp đồng mới
        </Button>
      </div>

      {open && (
        <div className="rounded-2xl bg-white border border-border p-6">
          <h3 className="mb-4">Tạo hợp đồng thuê</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Bên thuê</Label><Input placeholder="Họ tên..." /></div>
            <div><Label>CMND/CCCD</Label><Input placeholder="..." /></div>
            <div><Label>Phòng</Label><Input placeholder="Chọn phòng..." /></div>
            <div><Label>Giá thuê / tháng</Label><Input placeholder="..." /></div>
            <div><Label>Tiền cọc</Label><Input placeholder="..." /></div>
            <div><Label>Thời hạn (tháng)</Label><Input type="number" placeholder="12" /></div>
            <div><Label>Ngày bắt đầu</Label><Input type="date" /></div>
            <div><Label>Ngày kết thúc</Label><Input type="date" /></div>
          </div>
          <div className="flex gap-2 mt-5">
            <Button onClick={() => { toast.success("Đã tạo hợp đồng"); setOpen(false); }} className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600">Tạo hợp đồng</Button>
            <Button variant="outline" className="rounded-full" onClick={() => setOpen(false)}>Hủy</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { id: "HD-2026-0301", tenant: "Nguyễn Văn A", room: "Phòng studio - Q.10", start: "01/03/2026", end: "28/02/2027", status: "active" },
          { id: "HD-2026-0215", tenant: "Trần Thị B", room: "Căn hộ mini - Q.5", start: "15/02/2026", end: "14/02/2027", status: "active" },
          { id: "HD-2025-1101", tenant: "Lê Văn C", room: "Phòng giá rẻ - Q.1", start: "01/11/2025", end: "31/10/2026", status: "active" },
          { id: "HD-2025-0801", tenant: "Phạm Thị D", room: "Studio - Tân Bình", start: "01/08/2025", end: "31/07/2026", status: "expiring" },
        ].map((c) => (
          <div key={c.id} className="rounded-2xl bg-white border border-border p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div>{c.id}</div>
                  <div className="text-xs text-muted-foreground">{c.tenant}</div>
                </div>
              </div>
              <Badge className={c.status === "active" ? "bg-emerald-50 text-emerald-700 border-0" : "bg-amber-50 text-amber-700 border-0"}>
                {c.status === "active" ? "Hiệu lực" : "Sắp hết hạn"}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-3">{c.room}</div>
            <div className="text-xs text-muted-foreground mt-1">{c.start} → {c.end}</div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" className="rounded-full"><Eye className="w-3.5 h-3.5 mr-1" /> Xem</Button>
              <Button size="sm" variant="outline" className="rounded-full"><Download className="w-3.5 h-3.5 mr-1" /> PDF</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Contracts;
