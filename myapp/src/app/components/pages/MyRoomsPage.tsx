import { FileText, Receipt, Home, Download, Calendar, MapPin, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { ROOMS, INVOICES, formatVND } from "../../data/mock";

export function MyRoomsPage() {
  const room = ROOMS[0];
  const invoices = INVOICES.filter((i) => i.room.includes("Q.10"));

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl tracking-tight">Phòng của tôi</h1>
      <p className="text-muted-foreground mt-1">Quản lý phòng đang thuê, hợp đồng và hóa đơn của bạn</p>

      <Tabs defaultValue="current" className="mt-6">
        <TabsList className="rounded-full">
          <TabsTrigger value="current" className="rounded-full">Đang thuê</TabsTrigger>
          <TabsTrigger value="contract" className="rounded-full">Hợp đồng</TabsTrigger>
          <TabsTrigger value="invoice" className="rounded-full">Hóa đơn</TabsTrigger>
          <TabsTrigger value="history" className="rounded-full">Lịch sử</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-6">
          <div className="rounded-3xl overflow-hidden border border-border bg-white">
            <div className="grid grid-cols-1 md:grid-cols-[400px_1fr]">
              <img src={room.images[0]} className="w-full h-full object-cover" />
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Đang thuê
                    </Badge>
                    <h2 className="mt-2">{room.title}</h2>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-3.5 h-3.5" /> {room.address}, {room.district}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Tiền thuê hàng tháng</div>
                    <div className="text-indigo-600 text-xl">{formatVND(room.price)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                  <div>
                    <div className="text-xs text-muted-foreground">Bắt đầu</div>
                    <div className="text-sm">01/03/2026</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Kết thúc</div>
                    <div className="text-sm">28/02/2027</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Tiền cọc</div>
                    <div className="text-sm">{formatVND(room.price)}</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Tiến độ hợp đồng</span>
                    <span className="text-muted-foreground">2/12 tháng</span>
                  </div>
                  <Progress value={(2 / 12) * 100} />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="rounded-full"><FileText className="w-4 h-4 mr-1" /> Xem hợp đồng</Button>
                  <Button variant="outline" className="rounded-full"><Receipt className="w-4 h-4 mr-1" /> Hóa đơn tháng này</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contract" className="mt-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h3>Hợp đồng số HD-2026-0301</h3>
                <p className="text-sm text-muted-foreground mt-1">Ký ngày 01/03/2026 • Hiệu lực 12 tháng</p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-0">Còn hiệu lực</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {[
                { label: "Bên cho thuê", value: room.host.name },
                { label: "Bên thuê", value: "Nguyễn Văn A" },
                { label: "Phòng", value: room.title },
                { label: "Tiền thuê / tháng", value: formatVND(room.price) },
                { label: "Tiền cọc", value: formatVND(room.price) },
                { label: "Thời hạn", value: "12 tháng" },
                { label: "Ngày bắt đầu", value: "01/03/2026" },
                { label: "Ngày kết thúc", value: "28/02/2027" },
              ].map((d) => (
                <div key={d.label} className="p-4 rounded-xl bg-muted/50">
                  <div className="text-xs text-muted-foreground">{d.label}</div>
                  <div className="mt-1">{d.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <h4 className="text-sm">Điều khoản thanh toán</h4>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                <li>Tiền thuê thanh toán trước ngày 05 hàng tháng.</li>
                <li>Điện: 3.500₫/kWh. Nước: 25.000₫/m³. Internet: 100.000₫/tháng.</li>
                <li>Phí rác: 30.000₫/tháng. Gửi xe máy: 100.000₫/xe.</li>
              </ul>
            </div>

            <div className="mt-6 flex gap-2">
              <Button className="rounded-full"><Download className="w-4 h-4 mr-1" /> Tải PDF</Button>
              <Button variant="outline" className="rounded-full">Yêu cầu gia hạn</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="invoice" className="mt-6 space-y-4">
          {invoices.map((inv) => (
            <div key={inv.id} className="rounded-2xl border border-border bg-white p-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3>Hóa đơn {inv.month}</h3>
                    {inv.status === "paid" ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" /> Đã thanh toán</Badge>
                    ) : (
                      <Badge className="bg-amber-50 text-amber-700 border-0"><Clock className="w-3 h-3 mr-1" /> Chưa thanh toán</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{inv.id} • {inv.tenant}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Tổng cộng</div>
                  <div className="text-xl text-indigo-600">{formatVND(inv.total)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
                {[
                  { l: "Tiền phòng", v: inv.rent },
                  { l: "Điện", v: inv.electric },
                  { l: "Nước", v: inv.water },
                  { l: "Internet", v: inv.internet },
                  { l: "Khác", v: inv.trash + inv.parking },
                ].map((x) => (
                  <div key={x.l} className="p-3 rounded-xl bg-muted/50">
                    <div className="text-xs text-muted-foreground">{x.l}</div>
                    <div className="text-sm mt-1">{formatVND(x.v)}</div>
                  </div>
                ))}
              </div>

              {inv.status === "unpaid" && (
                <div className="mt-5 flex gap-2">
                  <Button className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600">Thanh toán ngay</Button>
                  <Button variant="outline" className="rounded-full"><Download className="w-4 h-4 mr-1" /> Tải hóa đơn</Button>
                </div>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="rounded-2xl border border-border bg-white p-12 text-center">
            <Home className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Bạn chưa có lịch sử thuê phòng nào trước đây.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
