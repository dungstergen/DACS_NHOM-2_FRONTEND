import { useState } from "react";
import { Check, X, Eye, Edit3, Plus, Trash2, FileText, Download, Send, Search, Receipt, Wallet, Calendar, Flag } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { APPOINTMENTS, DEPOSITS, INVOICES, REPORTS, BLOG_POSTS, ROOMS, formatVND } from "../../data/mock";
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

export function BlogManage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Quản lý blog</h1>
          <p className="text-muted-foreground mt-1">Tạo, chỉnh sửa và xuất bản bài viết</p>
        </div>
        <Button className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"><Plus className="w-4 h-4 mr-1" /> Bài viết mới</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {BLOG_POSTS.map((b) => (
          <div key={b.id} className="rounded-2xl bg-white border border-border overflow-hidden">
            <img src={b.image} className="w-full aspect-[16/10] object-cover" />
            <div className="p-5 space-y-2">
              <Badge className="bg-indigo-50 text-indigo-700 border-0">{b.category}</Badge>
              <h3 className="line-clamp-2">{b.title}</h3>
              <div className="text-xs text-muted-foreground">{b.author} • {b.date}</div>
              <div className="flex gap-1 pt-2">
                <Button size="sm" variant="outline" className="rounded-full"><Edit3 className="w-3.5 h-3.5 mr-1" /> Sửa</Button>
                <Button size="sm" variant="outline" className="rounded-full text-rose-600"><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl tracking-tight">Báo cáo vi phạm</h1>
        <p className="text-muted-foreground mt-1">Duyệt các báo cáo từ người dùng và xử lý vi phạm</p>
      </div>
      <div className="space-y-3">
        {REPORTS.map((r) => (
          <div key={r.id} className="rounded-2xl bg-white border border-border p-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><Flag className="w-5 h-5" /></div>
              <div>
                <div>{r.room}</div>
                <div className="text-sm text-muted-foreground mt-0.5">"{r.reason}"</div>
                <div className="text-xs text-muted-foreground mt-1">Bởi {r.reporter} • {r.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={
                r.status === "pending" ? "bg-amber-50 text-amber-700 border-0" :
                r.status === "reviewing" ? "bg-blue-50 text-blue-700 border-0" :
                "bg-emerald-50 text-emerald-700 border-0"
              }>
                {r.status === "pending" ? "Chờ xử lý" : r.status === "reviewing" ? "Đang xem" : "Đã giải quyết"}
              </Badge>
              {r.status !== "resolved" && (
                <>
                  <Button onClick={() => toast.success("Đã ẩn tin đăng")} size="sm" variant="outline" className="rounded-full">Ẩn tin</Button>
                  <Button onClick={() => toast.success("Đã xóa tin đăng")} size="sm" className="rounded-full bg-rose-600 hover:bg-rose-700">Xóa tin</Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
