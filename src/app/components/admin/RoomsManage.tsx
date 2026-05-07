import { Plus, Search, Edit3, Trash2, Eye, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ROOMS, formatVND } from "../../data/mock";

export function RoomsManage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Quản lý phòng</h1>
          <p className="text-muted-foreground mt-1">Tổng cộng {ROOMS.length} phòng đang hoạt động</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
          <Plus className="w-4 h-4 mr-1" /> Thêm phòng mới
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9 rounded-full bg-white" placeholder="Tìm theo tên, địa chỉ..." />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-44 rounded-full bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="available">Còn trống</SelectItem>
            <SelectItem value="occupied">Đã thuê</SelectItem>
            <SelectItem value="pending">Đang giữ</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="rounded-full"><Filter className="w-4 h-4 mr-1" /> Bộ lọc</Button>
      </div>

      <div className="rounded-2xl bg-white border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[40%]">Phòng</TableHead>
              <TableHead>Diện tích</TableHead>
              <TableHead>Giá thuê</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Đánh giá</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROOMS.map((r) => (
              <TableRow key={r.id} className="hover:bg-slate-50/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={r.images[0]} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <div className="line-clamp-1">{r.title}</div>
                      <div className="text-xs text-muted-foreground">{r.address}, {r.district}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{r.area}m²</TableCell>
                <TableCell><span className="text-indigo-600">{formatVND(r.price)}</span></TableCell>
                <TableCell>
                  <Badge
                    className={
                      r.status === "available"
                        ? "bg-emerald-50 text-emerald-700 border-0"
                        : r.status === "occupied"
                        ? "bg-rose-50 text-rose-700 border-0"
                        : "bg-amber-50 text-amber-700 border-0"
                    }
                  >
                    {r.status === "available" ? "Còn trống" : r.status === "occupied" ? "Đã thuê" : "Đang giữ"}
                  </Badge>
                </TableCell>
                <TableCell>★ {r.rating} ({r.reviews})</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="rounded-full"><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full"><Edit3 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="rounded-full text-rose-600"><Trash2 className="w-4 h-4" /></Button>
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
