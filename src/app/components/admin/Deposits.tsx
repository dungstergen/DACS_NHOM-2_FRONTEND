import { FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { DEPOSITS, formatVND } from "../../data/mock";
import { toast } from "sonner";

export function Deposits() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Quản lý đặt cọc</h1>
          <p className="text-muted-foreground mt-1">Theo dõi tiền cọc giữ phòng</p>
        </div>
        <div className="rounded-2xl px-5 py-3 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
          <div className="text-xs">Tổng tiền cọc đang giữ</div>
          <div className="text-2xl">{formatVND(DEPOSITS.reduce((s, d) => s + d.amount, 0))}</div>
        </div>
      </div>
      <div className="rounded-2xl bg-white border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Mã giao dịch</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Phòng</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Ngày</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DEPOSITS.map((d) => (
              <TableRow key={d.id}>
                <TableCell><span className="font-mono text-xs">#{d.id.toUpperCase()}</span></TableCell>
                <TableCell>{d.customer}</TableCell>
                <TableCell>{d.room}</TableCell>
                <TableCell><span className="text-indigo-600">{formatVND(d.amount)}</span></TableCell>
                <TableCell>{d.date}</TableCell>
                <TableCell>
                  <Badge className={d.status === "paid" ? "bg-emerald-50 text-emerald-700 border-0" : "bg-amber-50 text-amber-700 border-0"}>
                    {d.status === "paid" ? "Đã nhận cọc" : "Chờ thanh toán"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button onClick={() => toast.success("Đã chuyển sang tạo hợp đồng")} size="sm" variant="outline" className="rounded-full">
                    <FileText className="w-3.5 h-3.5 mr-1" /> Tạo hợp đồng
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
export default Deposits;
