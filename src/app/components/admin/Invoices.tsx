import { useState } from "react";
import { Plus, Eye, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { INVOICES, formatVND } from "../../data/mock";
import { toast } from "sonner";

export function Invoices() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Hóa đơn tháng</h1>
          <p className="text-muted-foreground mt-1">Tạo và gửi hóa đơn hàng tháng cho người thuê</p>
        </div>
        <Button onClick={() => setOpen(!open)} className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600">
          <Plus className="w-4 h-4 mr-1" /> Tạo hóa đơn
        </Button>
      </div>

      {open && (
        <div className="rounded-2xl bg-white border border-border p-6">
          <h3 className="mb-4">Tạo hóa đơn mới</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div><Label>Phòng</Label><Input placeholder="Chọn phòng..." /></div>
            <div><Label>Tháng</Label><Input type="month" /></div>
            <div><Label>Tiền phòng</Label><Input placeholder="0" /></div>
            <div><Label>Số điện (kWh)</Label><Input placeholder="0" /></div>
            <div><Label>Số nước (m³)</Label><Input placeholder="0" /></div>
            <div><Label>Internet</Label><Input placeholder="100,000" /></div>
            <div><Label>Phí rác</Label><Input placeholder="30,000" /></div>
            <div><Label>Gửi xe</Label><Input placeholder="100,000" /></div>
          </div>
          <div className="flex gap-2 mt-5">
            <Button onClick={() => { toast.success("Đã tạo & gửi hóa đơn"); setOpen(false); }} className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600">
              <Send className="w-4 h-4 mr-1" /> Tạo & gửi
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => setOpen(false)}>Hủy</Button>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Mã HĐ</TableHead>
              <TableHead>Phòng / Người thuê</TableHead>
              <TableHead>Tháng</TableHead>
              <TableHead>Chi tiết</TableHead>
              <TableHead>Tổng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICES.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell><span className="font-mono text-xs">{inv.id}</span></TableCell>
                <TableCell><div>{inv.room}</div><div className="text-xs text-muted-foreground">{inv.tenant}</div></TableCell>
                <TableCell>{inv.month}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  Phòng {formatVND(inv.rent)} • Điện {formatVND(inv.electric)} • Nước {formatVND(inv.water)}
                </TableCell>
                <TableCell><span className="text-indigo-600">{formatVND(inv.total)}</span></TableCell>
                <TableCell>
                  <Badge className={inv.status === "paid" ? "bg-emerald-50 text-emerald-700 border-0" : "bg-rose-50 text-rose-700 border-0"}>
                    {inv.status === "paid" ? "Đã thu" : "Chưa thu"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" className="rounded-full"><Eye className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" className="rounded-full"><Send className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
export default Invoices;
