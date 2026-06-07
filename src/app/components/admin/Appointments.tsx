import { Calendar, Check, Eye, X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { APPOINTMENTS } from "../../data/mock";
import { toast } from "sonner";

export function Appointments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl tracking-tight">Lịch hẹn xem phòng</h1>
        <p className="text-muted-foreground mt-1">Duyệt và quản lý lịch hẹn từ khách hàng</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { l: "Chờ duyệt", v: 12, c: "from-amber-500 to-orange-500" },
          { l: "Đã xác nhận", v: 24, c: "from-emerald-500 to-teal-500" },
          { l: "Đã hủy", v: 3, c: "from-rose-500 to-pink-500" },
        ].map((s) => (
          <div key={s.l} className="p-5 rounded-2xl bg-white border border-border">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.c} flex items-center justify-center text-white`}>
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-3xl mt-3">{s.v}</div>
            <div className="text-sm text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-white border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Khách hàng</TableHead>
              <TableHead>Phòng</TableHead>
              <TableHead>Ngày & giờ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {APPOINTMENTS.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  <div>{a.customer}</div>
                  <div className="text-xs text-muted-foreground">{a.phone}</div>
                </TableCell>
                <TableCell>{a.room}</TableCell>
                <TableCell>{a.date} • {a.time}</TableCell>
                <TableCell>
                  <Badge className={
                    a.status === "confirmed" ? "bg-emerald-50 text-emerald-700 border-0" :
                    a.status === "pending" ? "bg-amber-50 text-amber-700 border-0" :
                    "bg-rose-50 text-rose-700 border-0"
                  }>
                    {a.status === "confirmed" ? "Đã xác nhận" : a.status === "pending" ? "Chờ duyệt" : "Đã hủy"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {a.status === "pending" && (
                      <>
                        <Button onClick={() => toast.success("Đã duyệt lịch hẹn")} size="sm" className="rounded-full bg-emerald-600 hover:bg-emerald-700"><Check className="w-3.5 h-3.5 mr-1" /> Duyệt</Button>
                        <Button size="sm" variant="outline" className="rounded-full"><X className="w-3.5 h-3.5 mr-1" /> Từ chối</Button>
                      </>
                    )}
                    <Button size="icon" variant="ghost" className="rounded-full"><Eye className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
export default Appointments;
