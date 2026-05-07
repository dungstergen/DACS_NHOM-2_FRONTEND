import { Heart, MapPin, Star, Maximize2, Bed, Bath } from "lucide-react";
import { Badge } from "./ui/badge";
import { Room, formatVND } from "../data/mock";

type Props = {
  room: Room;
  onClick?: () => void;
};

export function RoomCard({ room, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-border hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={room.images[0]}
          alt={room.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart className="w-4 h-4" />
        </button>
        <div className="absolute top-3 left-3 flex gap-2">
          {room.status === "available" && (
            <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white border-0">Còn trống</Badge>
          )}
          {room.status === "occupied" && (
            <Badge className="bg-rose-500 hover:bg-rose-500 text-white border-0">Đã thuê</Badge>
          )}
          {room.status === "pending" && (
            <Badge className="bg-amber-500 hover:bg-amber-500 text-white border-0">Đang giữ</Badge>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1">{room.title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm">{room.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          <span className="line-clamp-1">{room.district}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" />{room.area}m²</span>
          <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{room.beds}</span>
          <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{room.bathrooms}</span>
        </div>
        <div className="pt-2 border-t border-border flex items-end justify-between">
          <div>
            <span className="text-indigo-600">{formatVND(room.price)}</span>
            <span className="text-sm text-muted-foreground">/tháng</span>
          </div>
          <span className="text-xs text-muted-foreground">{room.reviews} đánh giá</span>
        </div>
      </div>
    </div>
  );
}
