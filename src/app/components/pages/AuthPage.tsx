import { useState } from "react";
import { Mail, Lock, User, Phone, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";

export function AuthPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT - illustration panel */}
      <div className="relative hidden lg:flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden p-12">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="relative text-white max-w-md">
          <Sparkles className="w-10 h-10" />
          <h2 className="text-4xl mt-6 tracking-tight">Chào mừng đến với TroHub</h2>
          <p className="mt-4 text-white/80">
            Hơn 10.000 phòng trọ chất lượng, hợp đồng minh bạch, đặt cọc an toàn — tất cả trong một nền tảng.
          </p>
          <div className="mt-10 space-y-4">
            {[
              "Tìm phòng nhanh chỉ trong 5 phút",
              "Quản lý hợp đồng & hóa đơn online",
              "Hỗ trợ 24/7 từ đội ngũ chuyên nghiệp",
            ].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white" /> <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full rounded-full">
              <TabsTrigger value="signin" className="rounded-full">Đăng nhập</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full">Đăng ký</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-8 space-y-5">
              <div>
                <h2 className="text-2xl tracking-tight">Đăng nhập tài khoản</h2>
                <p className="text-muted-foreground text-sm mt-1">Tiếp tục hành trình tìm phòng của bạn</p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label>Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="ban@email.com" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between"><Label>Mật khẩu</Label><a className="text-xs text-indigo-600">Quên?</a></div>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="password" className="pl-9" placeholder="••••••••" />
                  </div>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">Đăng nhập</Button>
              <div className="flex items-center gap-3"><Separator className="flex-1" /><span className="text-xs text-muted-foreground">hoặc</span><Separator className="flex-1" /></div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="rounded-full">Google</Button>
                <Button variant="outline" className="rounded-full">Facebook</Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="mt-8 space-y-5">
              <div>
                <h2 className="text-2xl tracking-tight">Tạo tài khoản mới</h2>
                <p className="text-muted-foreground text-sm mt-1">Miễn phí, không mất phí ẩn</p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label>Họ tên</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="Nguyễn Văn A" />
                  </div>
                </div>
                <div>
                  <Label>Số điện thoại</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="09xx xxx xxx" />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="ban@email.com" />
                  </div>
                </div>
                <div>
                  <Label>Mật khẩu</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="password" className="pl-9" placeholder="Tối thiểu 8 ký tự" />
                  </div>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">Tạo tài khoản</Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
