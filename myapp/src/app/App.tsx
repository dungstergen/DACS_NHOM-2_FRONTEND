import { useState } from "react";
import { Toaster } from "./components/ui/sonner";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/pages/HomePage";
import { RoomsPage } from "./components/pages/RoomsPage";
import { RoomDetailPage } from "./components/pages/RoomDetailPage";
import { MyRoomsPage } from "./components/pages/MyRoomsPage";
import { BlogPage } from "./components/pages/BlogPage";
import { AuthPage } from "./components/pages/AuthPage";
import { AdminLayout } from "./components/admin/AdminLayout";
import { Dashboard } from "./components/admin/Dashboard";
import { RoomsManage } from "./components/admin/RoomsManage";
import {
  Appointments, Deposits, Contracts, Invoices, SystemCosts, BlogManage, Reports,
} from "./components/admin/Other";

export default function App() {
  const [mode, setMode] = useState<"user" | "admin">("user");
  const [page, setPage] = useState("home");
  const [adminPage, setAdminPage] = useState("dashboard");
  const [roomId, setRoomId] = useState<string | null>(null);

  const handleNavigate = (p: string) => {
    setRoomId(null);
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleOpenRoom = (id: string) => {
    setRoomId(id);
    setPage("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (mode === "admin") {
    return (
      <>
        <AdminLayout
          current={adminPage}
          onNavigate={(k) => setAdminPage(k)}
          onSwitchUser={() => setMode("user")}
        >
          {adminPage === "dashboard" && <Dashboard />}
          {adminPage === "rooms" && <RoomsManage />}
          {adminPage === "appointments" && <Appointments />}
          {adminPage === "deposits" && <Deposits />}
          {adminPage === "contracts" && <Contracts />}
          {adminPage === "invoices" && <Invoices />}
          {adminPage === "costs" && <SystemCosts />}
          {adminPage === "blog" && <BlogManage />}
          {adminPage === "reports" && <Reports />}
        </AdminLayout>
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header current={page} onNavigate={handleNavigate} onSwitchAdmin={() => setMode("admin")} />
      <main>
        {page === "home" && <HomePage onOpenRoom={handleOpenRoom} onNavigate={handleNavigate} />}
        {page === "rooms" && <RoomsPage onOpenRoom={handleOpenRoom} />}
        {page === "detail" && roomId && <RoomDetailPage roomId={roomId} onBack={() => handleNavigate("rooms")} />}
        {page === "myrooms" && <MyRoomsPage />}
        {page === "blog" && <BlogPage />}
        {page === "auth" && <AuthPage />}
      </main>
      {page !== "auth" && <Footer />}
      <Toaster position="top-right" />
    </div>
  );
}
