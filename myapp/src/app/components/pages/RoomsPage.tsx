import { useState } from "react";
import { SlidersHorizontal, MapPin, Grid3x3, List } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { RoomCard } from "../RoomCard";
import { ROOMS, AMENITIES, formatVND } from "../../data/mock";

type Props = { onOpenRoom: (id: string) => void };

export function RoomsPage({ onOpenRoom }: Props) {
  const [price, setPrice] = useState<number[]>([2000000, 8000000]);
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl tracking-tight">Tìm phòng phù hợp</h1>
          <p className="text-muted-foreground mt-1">{ROOMS.length} phòng đang được hiển thị</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Select defaultValue="newest">
            <SelectTrigger className="w-48 rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="price-asc">Giá tăng dần</SelectItem>
              <SelectItem value="price-desc">Giá giảm dần</SelectItem>
              <SelectItem value="rating">Đánh giá cao</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex p-1 rounded-full border border-border bg-white">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-full ${view === "grid" ? "bg-indigo-600 text-white" : "text-muted-foreground"}`}
            ><Grid3x3 className="w-4 h-4" /></button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-full ${view === "list" ? "bg-indigo-600 text-white" : "text-muted-foreground"}`}
            ><List className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* FILTERS */}
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-white p-5 space-y-5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <h3>Bộ lọc</h3>
            </div>
            <Separator />

            <div>
              <label className="text-sm">Khu vực</label>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Quận, đường..." />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm">
                <label>Giá thuê</label>
                <span className="text-xs text-muted-foreground">
                  {formatVND(price[0])} - {formatVND(price[1])}
                </span>
              </div>
              <Slider value={price} onValueChange={setPrice} min={1000000} max={15000000} step={500000} className="mt-3" />
            </div>

            <div>
              <label className="text-sm">Diện tích</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["<20m²", "20-30m²", "30-40m²", ">40m²"].map((s) => (
                  <button key={s} className="px-3 py-2 rounded-lg border border-border hover:border-indigo-500 hover:bg-indigo-50 text-sm">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm">Tiện ích</label>
              <div className="space-y-2 mt-3 max-h-56 overflow-y-auto pr-1">
                {AMENITIES.map((a) => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox /> <span className="text-sm">{a}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">Áp dụng bộ lọc</Button>
          </div>
        </aside>

        {/* RESULTS */}
        <div>
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" : "space-y-4"}>
            {ROOMS.map((r) =>
              view === "grid" ? (
                <RoomCard key={r.id} room={r} onClick={() => onOpenRoom(r.id)} />
              ) : (
                <div
                  key={r.id}
                  onClick={() => onOpenRoom(r.id)}
                  className="cursor-pointer rounded-2xl overflow-hidden bg-white border border-border hover:shadow-lg transition-all flex flex-col sm:flex-row"
                >
                  <img src={r.images[0]} className="w-full sm:w-72 h-48 object-cover" />
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3>{r.title}</h3>
                      <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />{r.address}, {r.district}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{r.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-indigo-600">{formatVND(r.price)}<span className="text-sm text-muted-foreground">/tháng</span></div>
                      <Button size="sm" className="rounded-full">Xem chi tiết</Button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
