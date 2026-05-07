import { Search, MapPin, TrendingUp, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RoomCard } from "../RoomCard";
import { ROOMS, BLOG_POSTS } from "../../data/mock";

type Props = { onOpenRoom: (id: string) => void; onNavigate: (p: string) => void };

export function HomePage({ onOpenRoom, onNavigate }: Props) {
  return (
    <div className="space-y-20 pb-20">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur border border-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm">Hơn 10.000+ phòng trọ chất lượng cao</span>
            </div>
            <h1 className="text-5xl md:text-6xl tracking-tight leading-tight">
              Tìm phòng trọ <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">trong mơ</span><br />
              chỉ trong 5 phút
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Nền tảng cho thuê phòng minh bạch, an toàn, kết nối trực tiếp giữa người thuê và chủ nhà.
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="max-w-4xl mx-auto mt-10">
            <div className="bg-white rounded-2xl shadow-2xl shadow-indigo-500/10 border border-border p-2 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_auto] gap-2">
              <div className="flex items-center gap-3 px-4 py-3">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Khu vực</div>
                  <Input className="border-0 p-0 h-auto shadow-none focus-visible:ring-0" placeholder="Quận, đường..." />
                </div>
              </div>
              <Select>
                <SelectTrigger className="border-0 shadow-none h-full px-4">
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">Giá thuê</div>
                    <SelectValue placeholder="Mọi mức giá" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Dưới 3 triệu</SelectItem>
                  <SelectItem value="2">3 - 5 triệu</SelectItem>
                  <SelectItem value="3">5 - 8 triệu</SelectItem>
                  <SelectItem value="4">Trên 8 triệu</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="border-0 shadow-none h-full px-4">
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">Diện tích</div>
                    <SelectValue placeholder="Mọi diện tích" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Dưới 20m²</SelectItem>
                  <SelectItem value="2">20 - 30m²</SelectItem>
                  <SelectItem value="3">Trên 30m²</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => onNavigate("rooms")}
                size="lg"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 px-6 h-full"
              >
                <Search className="w-5 h-5 mr-2" />
                Tìm kiếm
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
              <span>Phổ biến:</span>
              {["Quận 1", "Quận 10", "Phú Nhuận", "Bình Thạnh", "Dưới 5 triệu"].map((t) => (
                <button key={t} className="px-3 py-1 rounded-full bg-white/70 backdrop-blur hover:bg-white border border-border">
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: TrendingUp, label: "Phòng đang cho thuê", value: "10.5K+", color: "from-indigo-500 to-purple-500" },
            { icon: Shield, label: "Hợp đồng minh bạch", value: "100%", color: "from-emerald-500 to-teal-500" },
            { icon: Sparkles, label: "Khách hàng hài lòng", value: "98%", color: "from-pink-500 to-rose-500" },
            { icon: MapPin, label: "Quận / Huyện", value: "24+", color: "from-amber-500 to-orange-500" },
          ].map((s, i) => (
            <div key={i} className="p-6 rounded-2xl border border-border bg-white">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-4`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl tracking-tight">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED ROOMS */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-sm text-indigo-600 mb-2">Đề xuất cho bạn</div>
            <h2 className="text-3xl tracking-tight">Phòng nổi bật tuần này</h2>
          </div>
          <Button variant="ghost" onClick={() => onNavigate("rooms")} className="hidden md:inline-flex">
            Xem tất cả <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROOMS.slice(0, 6).map((r) => (
            <RoomCard key={r.id} room={r} onClick={() => onOpenRoom(r.id)} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-sm text-indigo-600 mb-2">Quy trình đơn giản</div>
          <h2 className="text-3xl tracking-tight">Thuê phòng chỉ với 4 bước</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Tìm kiếm", desc: "Lọc phòng theo khu vực, giá, diện tích phù hợp." },
            { step: "02", title: "Đặt lịch xem", desc: "Chọn khung giờ, hệ thống tự động xác nhận." },
            { step: "03", title: "Đặt cọc giữ phòng", desc: "Thanh toán an toàn, hợp đồng minh bạch." },
            { step: "04", title: "Dọn vào ở", desc: "Quản lý hợp đồng & hóa đơn ngay trên app." },
          ].map((s, i) => (
            <div key={i} className="relative p-6 rounded-2xl bg-gradient-to-br from-white to-indigo-50/50 border border-border">
              <div className="text-4xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{s.step}</div>
              <h3 className="mt-4">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-sm text-indigo-600 mb-2">Cẩm nang</div>
            <h2 className="text-3xl tracking-tight">Bài viết mới nhất</h2>
          </div>
          <Button variant="ghost" onClick={() => onNavigate("blog")} className="hidden md:inline-flex">
            Xem tất cả <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.slice(0, 3).map((b) => (
            <article key={b.id} className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-border hover:shadow-xl transition-all">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={b.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">{b.category}</span>
                  <span className="text-muted-foreground">{b.readTime}</span>
                </div>
                <h3 className="line-clamp-2 group-hover:text-indigo-600 transition-colors">{b.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{b.excerpt}</p>
                <div className="text-xs text-muted-foreground">{b.author} • {b.date}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 md:p-16 text-white">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-4xl tracking-tight">Bạn là chủ phòng trọ?</h2>
            <p className="mt-4 text-white/80">
              Đăng tin miễn phí, tiếp cận hàng nghìn người thuê tiềm năng và quản lý phòng dễ dàng với TroHub.
            </p>
            <Button size="lg" className="mt-8 bg-white text-indigo-700 hover:bg-white/90 rounded-full">
              Đăng tin ngay <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
