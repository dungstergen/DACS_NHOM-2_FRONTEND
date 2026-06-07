import { useState } from "react";
import { Plus, Search, Edit3, Trash2, Eye, X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Modal, Popconfirm } from "antd";
import { toast } from "sonner";
import { 
  useRooms, 
  useCreateRoom, 
  useUpdateRoom, 
  useDeleteRoom 
} from "../../../hook/useRooms";
import { useAmenities } from "../../../hook/useAmenities";
import type { Room } from "../../../interface/room.interface";
import { formatVND } from "../../data/mock";

export function RoomsManage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialog State Management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Form Field States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("TP.HCM");
  const [priceMonthly, setPriceMonthly] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [areaSqm, setAreaSqm] = useState<number>(0);
  const [maxOccupants, setMaxOccupants] = useState<number>(1);
  const [status, setStatus] = useState<"available" | "occupied">("available");
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // React Query Hooks
  const { data, isLoading, isError, error } = useRooms(page, {
    status: statusFilter,
    q: search || undefined,
  });

  const { data: amenitiesData } = useAmenities(1, 100);
  const availableAmenities = amenitiesData?.data || [];

  const { mutate: createRoom, isPending: isCreating } = useCreateRoom();
  const { mutate: updateRoom, isPending: isUpdating } = useUpdateRoom();
  const { mutate: deleteRoom } = useDeleteRoom();

  const rooms = data?.data || [];
  const meta = data?.meta;

  const openAddModal = () => {
    setTitle("");
    setDescription("");
    setAddress("");
    setDistrict("");
    setCity("TP.HCM");
    setPriceMonthly(0);
    setDepositAmount(0);
    setAreaSqm(0);
    setMaxOccupants(1);
    setStatus("available");
    setSelectedAmenities([]);
    setImageUrls([]);
    setIsAddModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setSelectedRoom(room);
    setTitle(room.title);
    setDescription(room.description || "");
    setAddress(room.address || "");
    setDistrict(room.district || "");
    setCity(room.city || "TP.HCM");
    setPriceMonthly(Number(room.price_monthly));
    setDepositAmount(Number(room.deposit_amount) || 0);
    setAreaSqm(Number(room.area_sqm) || 0);
    setMaxOccupants(room.max_occupants || 1);
    setStatus(room.status);
    setSelectedAmenities(room.amenities?.map((am) => am.id) || []);
    setImageUrls(room.images?.map((img) => img.url) || []);
    setIsEditModalOpen(true);
  };

  const openViewModal = (room: Room) => {
    setSelectedRoom(room);
    setIsViewModalOpen(true);
  };

  const handleAddRoom = () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên phòng");
      return;
    }
    if (priceMonthly <= 0) {
      toast.error("Giá thuê phải lớn hơn 0");
      return;
    }

    createRoom(
      {
        title: title.trim(),
        description: description.trim() || null,
        address: address.trim() || null,
        district: district.trim() || null,
        city: city.trim() || null,
        price_monthly: priceMonthly,
        deposit_amount: depositAmount,
        area_sqm: areaSqm || null,
        max_occupants: maxOccupants || null,
        status,
        amenities: selectedAmenities,
        images: imageUrls.map((url, idx) => ({ url, sort_order: idx })),
      },
      {
        onSuccess: () => {
          setIsAddModalOpen(false);
          toast.success("Thêm phòng mới thành công");
        },
        onError: (err: any) => {
          const msg = err.response?.data?.message || "Thêm phòng thất bại";
          toast.error(msg);
        },
      }
    );
  };

  const handleSaveEditRoom = () => {
    if (!selectedRoom) return;
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên phòng");
      return;
    }
    if (priceMonthly <= 0) {
      toast.error("Giá thuê phải lớn hơn 0");
      return;
    }

    updateRoom(
      {
        id: selectedRoom.id,
        data: {
          title: title.trim(),
          description: description.trim() || null,
          address: address.trim() || null,
          district: district.trim() || null,
          city: city.trim() || null,
          price_monthly: priceMonthly,
          deposit_amount: depositAmount,
          area_sqm: areaSqm || null,
          max_occupants: maxOccupants || null,
          status,
          amenities: selectedAmenities,
          images: imageUrls.map((url, idx) => ({ url, sort_order: idx })),
        },
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setSelectedRoom(null);
          toast.success("Cập nhật phòng thành công");
        },
        onError: (err: any) => {
          const msg = err.response?.data?.message || "Cập nhật phòng thất bại";
          toast.error(msg);
        },
      }
    );
  };

  const handleDeleteRoom = (id: number) => {
    deleteRoom(id, {
      onSuccess: () => {
        toast.success("Xóa phòng thành công");
      },
      onError: (err: any) => {
        const msg = err.response?.data?.message || "Xóa phòng thất bại";
        toast.error(msg);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Quản lý phòng</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? "Đang tải số lượng phòng..." : `Tổng cộng ${meta?.total || 0} phòng đang hoạt động`}
          </p>
        </div>
        <Button onClick={openAddModal} className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
          <Plus className="w-4 h-4 mr-1" /> Thêm phòng mới
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-9 rounded-full bg-white" 
            placeholder="Tìm theo tên, địa chỉ..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select value={statusFilter} onValueChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}>
          <SelectTrigger className="w-44 rounded-full bg-white">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="available">Còn trống</SelectItem>
            <SelectItem value="occupied">Đã thuê</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Add / Edit Room Modal */}
      <Modal
        title={<span className="text-xl font-bold text-slate-800">{isAddModalOpen ? "Thêm phòng mới" : "Cập nhật phòng"}</span>}
        open={isAddModalOpen || isEditModalOpen}
        onOk={isAddModalOpen ? handleAddRoom : handleSaveEditRoom}
        onCancel={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedRoom(null);
        }}
        confirmLoading={isCreating || isUpdating}
        okText={isAddModalOpen ? "Thêm mới" : "Lưu thay đổi"}
        cancelText="Hủy"
        width={750}
      >
        <div className="py-4 space-y-4 max-h-[65vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="room-title">Tên phòng trọ *</Label>
              <Input
                id="room-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Phòng studio ban công Q.10 full nội thất"
              />
            </div>

            <div>
              <Label htmlFor="room-price">Giá thuê hàng tháng (VND) *</Label>
              <Input
                id="room-price"
                type="number"
                value={priceMonthly || ""}
                onChange={(e) => setPriceMonthly(Number(e.target.value))}
                placeholder="Ví dụ: 4500000"
              />
            </div>

            <div>
              <Label htmlFor="room-deposit">Tiền đặt cọc (VND)</Label>
              <Input
                id="room-deposit"
                type="number"
                value={depositAmount || ""}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                placeholder="Ví dụ: 4500000"
              />
            </div>

            <div>
              <Label htmlFor="room-area">Diện tích (m²)</Label>
              <Input
                id="room-area"
                type="number"
                value={areaSqm || ""}
                onChange={(e) => setAreaSqm(Number(e.target.value))}
                placeholder="Ví dụ: 25"
              />
            </div>

            <div>
              <Label htmlFor="room-occupants">Số người tối đa</Label>
              <Input
                id="room-occupants"
                type="number"
                value={maxOccupants || ""}
                onChange={(e) => setMaxOccupants(Number(e.target.value))}
                placeholder="Ví dụ: 2"
              />
            </div>

            <div>
              <Label htmlFor="room-status">Trạng thái</Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger className="w-full rounded-lg bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Còn trống</SelectItem>
                  <SelectItem value="occupied">Đã thuê</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="room-city">Thành phố</Label>
              <Input
                id="room-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ví dụ: TP.HCM"
              />
            </div>

            <div>
              <Label htmlFor="room-district">Quận / Huyện</Label>
              <Input
                id="room-district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Ví dụ: Quận 10"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="room-address">Địa chỉ chi tiết (Số nhà, Tên đường...)</Label>
              <Input
                id="room-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ví dụ: 12 Lý Thường Kiệt, P.7"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="room-desc">Mô tả chi tiết</Label>
              <textarea
                id="room-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Mô tả thông tin chi tiết về phòng trọ, quy định, giờ giấc..."
              />
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="space-y-2">
            <Label>Tiện ích tích hợp</Label>
            {availableAmenities.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border border-border p-3 rounded-xl max-h-40 overflow-y-auto">
                {availableAmenities.map((am) => (
                  <label key={am.id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-indigo-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(am.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAmenities([...selectedAmenities, am.id]);
                        } else {
                          setSelectedAmenities(selectedAmenities.filter((id) => id !== am.id));
                        }
                      }}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300"
                    />
                    <span>{am.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Không tìm thấy tiện ích hệ thống nào. Vui lòng thêm tiện ích trước.</div>
            )}
          </div>

          {/* Image Upload Input */}
          <div className="space-y-2">
            <Label>Danh sách liên kết hình ảnh (URLs)</Label>
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Nhập liên kết hình ảnh (Ví dụ: https://images.unsplash.com/...)"
              />
              <Button
                type="button"
                onClick={() => {
                  if (newImageUrl.trim()) {
                    setImageUrls([...imageUrls, newImageUrl.trim()]);
                    setNewImageUrl("");
                  }
                }}
                variant="outline"
                className="rounded-lg shrink-0"
              >
                Thêm ảnh
              </Button>
            </div>

            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border border-border p-2 rounded-xl">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-border">
                    <img src={url} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* View Room Modal */}
      <Modal
        title={<span className="text-xl font-bold text-slate-800">Chi tiết phòng trọ</span>}
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)} className="rounded-full">
            Đóng
          </Button>
        ]}
        width={700}
      >
        {selectedRoom && (
          <div className="py-4 space-y-6">
            {/* Image Grid */}
            {selectedRoom.images && selectedRoom.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {selectedRoom.images.map((img, idx) => (
                  <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden border border-border">
                    <img src={img.url} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 border border-dashed rounded-xl text-muted-foreground text-sm">
                Chưa có hình ảnh nào cho phòng trọ này.
              </div>
            )}

            {/* Room Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <span className="text-xs text-muted-foreground block">Tên phòng</span>
                <span className="font-semibold text-slate-800 text-lg">{selectedRoom.title}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Trạng thái</span>
                <Badge className={
                  selectedRoom.status === "available"
                    ? "bg-emerald-50 text-emerald-700 border-0"
                    : "bg-rose-50 text-rose-700 border-0"
                }>
                  {selectedRoom.status === "available" ? "Còn trống" : "Đã thuê"}
                </Badge>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block">Giá thuê</span>
                <span className="font-semibold text-indigo-600 text-lg">{formatVND(Number(selectedRoom.price_monthly))}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Tiền đặt cọc</span>
                <span className="font-semibold text-slate-800">{formatVND(Number(selectedRoom.deposit_amount) || 0)}</span>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block">Diện tích</span>
                <span className="font-semibold text-slate-800">{selectedRoom.area_sqm || 0} m²</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Số người tối đa</span>
                <span className="font-semibold text-slate-800">{selectedRoom.max_occupants || 1} người</span>
              </div>

              <div className="col-span-1 md:col-span-2">
                <span className="text-xs text-muted-foreground block">Địa chỉ</span>
                <span className="font-semibold text-slate-800">
                  {selectedRoom.address ? `${selectedRoom.address}, ` : ""}
                  {selectedRoom.district ? `${selectedRoom.district}, ` : ""}
                  {selectedRoom.city || ""}
                </span>
              </div>

              {selectedRoom.description && (
                <div className="col-span-1 md:col-span-2">
                  <span className="text-xs text-muted-foreground block">Mô tả</span>
                  <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{selectedRoom.description}</p>
                </div>
              )}
            </div>

            {/* Amenities */}
            <div>
              <span className="text-xs text-muted-foreground block mb-2">Tiện ích tích hợp</span>
              {selectedRoom.amenities && selectedRoom.amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.amenities.map((am) => (
                    <Badge key={am.id} variant="outline" className="rounded-full bg-slate-50 text-slate-700 px-3 py-1 font-normal border-slate-200">
                      {am.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Không có tiện ích nào.</span>
              )}
            </div>
          </div>
        )}
      </Modal>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-border">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-muted-foreground text-sm mt-3">Đang tải danh sách phòng trọ...</p>
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-border text-rose-600">
          Có lỗi xảy ra khi tải dữ liệu: {(error as any)?.message || "Lỗi không xác định"}
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-16">ID</TableHead>
                <TableHead className="w-[45%]">Phòng</TableHead>
                <TableHead>Diện tích</TableHead>
                <TableHead>Giá thuê</TableHead>
                <TableHead>Khách tối đa</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center p-6 text-muted-foreground">
                    Chưa có phòng trọ nào được tạo trên hệ thống.
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map((r) => (
                  <TableRow key={r.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-mono">{r.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={r.images && r.images.length > 0 ? r.images[0].url : "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&q=80"} 
                          className="w-14 h-14 rounded-xl object-cover border border-border shrink-0" 
                        />
                        <div>
                          <div className="font-semibold text-slate-800 line-clamp-1">{r.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {r.address ? `${r.address}, ` : ""}
                            {r.district ? `${r.district}, ` : ""}
                            {r.city || ""}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{r.area_sqm ? `${Number(r.area_sqm)}m²` : "N/A"}</TableCell>
                    <TableCell><span className="text-indigo-600 font-semibold">{formatVND(Number(r.price_monthly))}</span></TableCell>
                    <TableCell>{r.max_occupants ? `${r.max_occupants} người` : "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          r.status === "available"
                            ? "bg-emerald-50 text-emerald-700 border-0"
                            : "bg-rose-50 text-rose-700 border-0"
                        }
                      >
                        {r.status === "available" ? "Còn trống" : "Đã thuê"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button onClick={() => openViewModal(r)} variant="ghost" size="icon" className="rounded-full">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => openEditModal(r)} variant="ghost" size="icon" className="rounded-full">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Popconfirm
                          title="Xóa phòng trọ"
                          description="Bạn có chắc chắn muốn xóa phòng trọ này?"
                          onConfirm={() => handleDeleteRoom(r.id)}
                          okText="Có"
                          cancelText="Không"
                          okButtonProps={{ danger: true }}
                        >
                          <span className="inline-block">
                            <Button variant="ghost" size="icon" className="rounded-full text-rose-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </span>
                        </Popconfirm>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination UI */}
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border bg-slate-50">
              <div className="text-sm text-muted-foreground">
                Hiển thị {meta.from || 0} - {meta.to || 0} trong tổng số {meta.total} phòng
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-full"
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                  disabled={page === meta.last_page}
                  className="rounded-full"
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RoomsManage;
