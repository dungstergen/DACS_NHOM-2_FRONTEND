import { useState } from "react";
import {
  ArrowLeft, Heart, Share2, MapPin, Star, Maximize2, Bed, Bath,
  Calendar as CalendarIcon, Shield, Phone, MessageCircle, Flag, Check,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Calendar } from "../ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { ROOMS, formatVND } from "../../data/mock";
import { toast } from "sonner";

type Props = { roomId: string; onBack: () => void };

export function RoomDetailPage({ roomId, onBack }: Props) {
  const room = ROOMS.find((r) => r.id === roomId) || ROOMS[0];
  const [active, setActive] = useState(0);
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 4, 10));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
      </button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl tracking-tight">{room.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{room.rating}</span>
              <span className="text-muted-foreground">({room.reviews} đánh giá)</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" /> {room.address}, {room.district}
            </div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="icon" className="rounded-full"><Heart className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" className="rounded-full"><Share2 className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* GALLERY */}
      <div className="grid grid-cols-4 grid-rows-2 gap-3 rounded-3xl overflow-hidden h-[480px] mb-10">
        <div className="col-span-2 row-span-2 relative">
          <img src={room.images[active]} className="w-full h-full object-cover" />
        </div>
        {room.images.slice(0, 4).map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative overflow-hidden ${active === i ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`}
          >
            <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform" />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
        {/* LEFT */}
        <div className="space-y-10">
          {/* Host + Quick stats */}
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-14 h-14"><AvatarImage src={room.host.avatar} /><AvatarFallback>{room.host.name[0]}</AvatarFallback></Avatar>
              <div>
                <div>Chủ phòng: {room.host.name}</div>
                <div className="text-sm text-muted-foreground">Phản hồi trong 1 giờ</div>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center"><Maximize2 className="w-5 h-5 mx-auto text-indigo-600" /><div className="text-sm mt-1">{room.area}m²</div></div>
              <div className="text-center"><Bed className="w-5 h-5 mx-auto text-indigo-600" /><div className="text-sm mt-1">{room.beds} giường</div></div>
              <div className="text-center"><Bath className="w-5 h-5 mx-auto text-indigo-600" /><div className="text-sm mt-1">{room.bathrooms} WC</div></div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="mb-3">Mô tả phòng</h2>
            <p className="text-muted-foreground leading-relaxed">{room.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="mb-4">Tiện ích</h2>
            <div className="grid grid-cols-2 gap-3">
              {room.amenities.map((a) => (
                <div key={a} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div>
            <h2 className="mb-4">Vị trí</h2>
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-blue-50 to-emerald-50">
              <div className="absolute inset-0" style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 40%, rgba(99,102,241,0.2) 0, transparent 50%), radial-gradient(circle at 70% 60%, rgba(236,72,153,0.15) 0, transparent 50%)",
              }} />
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 200">
                {Array.from({ length: 12 }).map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 18} x2="400" y2={i * 18} stroke="#6366f1" strokeWidth="0.5" />
                ))}
                {Array.from({ length: 22 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="200" stroke="#6366f1" strokeWidth="0.5" />
                ))}
              </svg>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-30" />
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-xl px-4 py-2 shadow-lg">
                <div className="text-sm">{room.address}</div>
                <div className="text-xs text-muted-foreground">{room.district}</div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                {room.rating} • {room.reviews} đánh giá
              </h2>
              <Button variant="outline" className="rounded-full">Viết đánh giá</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Mai Lan", date: "T4/2026", text: "Phòng sạch sẽ, chủ thân thiện. Vị trí rất tiện lợi gần trường.", img: 22 },
                { name: "Hoài Nam", date: "T3/2026", text: "Đầy đủ tiện nghi, an ninh tốt. Sẽ giới thiệu bạn bè!", img: 33 },
              ].map((r, i) => (
                <div key={i} className="p-5 rounded-2xl border border-border">
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarImage src={`https://i.pravatar.cc/100?img=${r.img}`} /></Avatar>
                    <div>
                      <div>{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.date}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mt-3">
                    {[...Array(5)].map((_, j) => (<Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT - BOOKING CARD */}
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-4">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xl shadow-black/5">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-indigo-600">{formatVND(room.price)}</span>
              <span className="text-muted-foreground">/tháng</span>
            </div>
            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 mt-2">
              <Shield className="w-3 h-3 mr-1" /> Đặt cọc an toàn
            </Badge>

            <Tabs defaultValue="schedule" className="mt-5">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="schedule">Đặt lịch xem</TabsTrigger>
                <TabsTrigger value="deposit">Đặt cọc</TabsTrigger>
              </TabsList>
              <TabsContent value="schedule" className="space-y-4 mt-4">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-xl border border-border" />
                <div>
                  <Label className="text-sm">Khung giờ</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["09:00", "10:30", "14:00", "15:30", "17:00", "19:00"].map((t) => (
                      <button key={t} className="px-3 py-2 rounded-lg border border-border text-sm hover:border-indigo-500 hover:bg-indigo-50">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
                      <CalendarIcon className="w-4 h-4 mr-2" /> Xác nhận đặt lịch
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Xác nhận đặt lịch xem phòng</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div><Label>Họ tên</Label><Input placeholder="Nguyễn Văn A" /></div>
                      <div><Label>Số điện thoại</Label><Input placeholder="09xx xxx xxx" /></div>
                      <div><Label>Ghi chú</Label><Textarea placeholder="Thời gian linh hoạt..." /></div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => toast.success("Đặt lịch thành công! Chủ phòng sẽ liên hệ bạn.")}>Gửi yêu cầu</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsContent>
              <TabsContent value="deposit" className="space-y-3 mt-4">
                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <div className="flex justify-between text-sm"><span>Tiền cọc giữ phòng</span><span>{formatVND(room.price)}</span></div>
                  <div className="flex justify-between text-sm mt-1"><span>Phí dịch vụ</span><span>0₫</span></div>
                  <Separator className="my-3" />
                  <div className="flex justify-between"><span>Tổng cộng</span><span className="text-indigo-600">{formatVND(room.price)}</span></div>
                </div>
                <Button onClick={() => toast.success("Chuyển sang trang thanh toán")} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
                  Đặt cọc ngay
                </Button>
                <p className="text-xs text-muted-foreground text-center">Tiền cọc được giữ an toàn cho đến khi bạn ký hợp đồng.</p>
              </TabsContent>
            </Tabs>

            <Separator className="my-5" />
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="rounded-full"><Phone className="w-4 h-4 mr-1" /> Gọi</Button>
              <Button variant="outline" className="rounded-full"><MessageCircle className="w-4 h-4 mr-1" /> Chat</Button>
            </div>
          </div>

          <button className="w-full text-sm text-muted-foreground hover:text-rose-600 flex items-center justify-center gap-2 py-2">
            <Flag className="w-4 h-4" /> Báo cáo tin đăng vi phạm
          </button>
        </aside>
      </div>
    </div>
  );
}
