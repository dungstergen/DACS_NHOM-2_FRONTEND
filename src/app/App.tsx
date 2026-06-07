import { Routes, Route } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { PublicLayout } from "./layouts/PublicLayout";
import { HomePage } from "./components/pages/HomePage";
import { RoomsPage } from "./components/pages/RoomsPage";
import { RoomDetailPage } from "./components/pages/RoomDetailPage";
import { MyRoomsPage } from "./components/pages/MyRoomsPage";
import { BlogPage } from "./components/pages/BlogPage";
import { AuthPage } from "./components/pages/AuthPage";
import { AdminLayout } from "./components/admin/AdminLayout";
import { Dashboard } from "./components/admin/Dashboard";
import { RoomsManage } from "./components/admin/RoomsManage";
import { AmenitiesManage } from "./components/admin/AmenitiesManage";
import { Appointments } from "./components/admin/Appointments";
import { Deposits } from "./components/admin/Deposits";
import { Contracts } from "./components/admin/Contracts";
import { Invoices } from "./components/admin/Invoices";
import { SystemCosts } from "./components/admin/SystemCosts";
import { BlogManage } from "./components/admin/BlogManage";
import { Reports } from "./components/admin/Reports";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/myrooms" element={<MyRoomsPage />} />
          <Route path="/blog" element={<BlogPage />} />
        </Route>

        {/* Auth Route without Header/Footer */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="amenities" element={<AmenitiesManage />} />
          <Route path="rooms" element={<RoomsManage />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="deposits" element={<Deposits />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="costs" element={<SystemCosts />} />
          <Route path="blog" element={<BlogManage />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}
