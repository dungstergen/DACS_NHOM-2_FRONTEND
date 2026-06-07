import { Home, Heart, Bell, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { id: "/", label: "Trang chủ" },
    { id: "/rooms", label: "Tìm phòng" },
    { id: "/myrooms", label: "Phòng của tôi" },
    { id: "/blog", label: "Blog" },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-lg tracking-tight">
              Tro<span className="text-indigo-600">Hub</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {items.map((it) => (
              <Link
                key={it.id}
                to={it.id}
                className={`px-4 py-2 rounded-full transition-colors ${
                  (it.id === "/" ? location.pathname === "/" : location.pathname.startsWith(it.id))
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {it.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full hidden sm:inline-flex">
            <Heart className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hidden sm:inline-flex relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 bg-pink-500 text-white border-0">3</Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 pl-2 pr-1 py-1 border border-border rounded-full hover:shadow-md transition-shadow">
                <Menu className="w-4 h-4 text-muted-foreground" />
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://i.pravatar.cc/100?img=8" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/auth")}>Đăng nhập / Đăng ký</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/myrooms")}>Phòng của tôi</DropdownMenuItem>
              <DropdownMenuItem>Yêu thích</DropdownMenuItem>
              <DropdownMenuItem>Cài đặt</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/admin")} className="text-indigo-600">
                Chuyển sang Admin
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
