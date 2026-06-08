import { useState } from "react";
import { Plus, Search, Edit3, Trash2, Eye, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button, Input, Table, Modal, Popconfirm, Tag, Select, Checkbox, Space, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
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

interface RoomForm {
  title: string;
  description: string;
  address: string;
  district: string;
  city: string;
  price_monthly: number;
  deposit_amount: number;
  area_sqm: number;
  max_occupants: number;
  status: "available" | "occupied";
  amenities: number[];
  images: string[];
}

export function RoomsManage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialog State Management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [newImageUrl, setNewImageUrl] = useState("");

  // React-hook-form
  const { register, handleSubmit, reset, setValue, watch } = useForm<RoomForm>({
    defaultValues: {
      title: "",
      description: "",
      address: "",
      district: "",
      city: "TP.HCM",
      price_monthly: 0,
      deposit_amount: 0,
      area_sqm: 0,
      max_occupants: 1,
      status: "available",
      amenities: [],
      images: [],
    },
  });

  const watchedAmenities = watch("amenities") || [];
  const watchedImages = watch("images") || [];

  // React Query Hooks
  const { data, isLoading } = useRooms(page, {
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
    reset({
      title: "",
      description: "",
      address: "",
      district: "",
      city: "TP.HCM",
      price_monthly: 0,
      deposit_amount: 0,
      area_sqm: 0,
      max_occupants: 1,
      status: "available",
      amenities: [],
      images: [],
    });
    setNewImageUrl("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setSelectedRoom(room);
    reset({
      title: room.title,
      description: room.description || "",
      address: room.address || "",
      district: room.district || "",
      city: room.city || "TP.HCM",
      price_monthly: Number(room.price_monthly),
      deposit_amount: Number(room.deposit_amount) || 0,
      area_sqm: Number(room.area_sqm) || 0,
      max_occupants: room.max_occupants || 1,
      status: room.status,
      amenities: room.amenities?.map((am) => am.id) || [],
      images: room.images?.map((img) => img.url) || [],
    });
    setNewImageUrl("");
    setIsEditModalOpen(true);
  };

  const openViewModal = (room: Room) => {
    setSelectedRoom(room);
    setIsViewModalOpen(true);
  };

  const onAddSubmit = (formData: RoomForm) => {
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tên phòng");
      return;
    }
    if (formData.price_monthly <= 0) {
      toast.error("Giá thuê phải lớn hơn 0");
      return;
    }

    createRoom(
      {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        address: formData.address.trim() || null,
        district: formData.district.trim() || null,
        city: formData.city.trim() || null,
        price_monthly: formData.price_monthly,
        deposit_amount: formData.deposit_amount,
        area_sqm: formData.area_sqm || null,
        max_occupants: formData.max_occupants || null,
        status: formData.status,
        amenities: formData.amenities,
        images: formData.images.map((url, idx) => ({ url, sort_order: idx })),
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

  const onEditSubmit = (formData: RoomForm) => {
    if (!selectedRoom) return;
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tên phòng");
      return;
    }
    if (formData.price_monthly <= 0) {
      toast.error("Giá thuê phải lớn hơn 0");
      return;
    }

    updateRoom(
      {
        id: selectedRoom.id,
        data: {
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          address: formData.address.trim() || null,
          district: formData.district.trim() || null,
          city: formData.city.trim() || null,
          price_monthly: formData.price_monthly,
          deposit_amount: formData.deposit_amount,
          area_sqm: formData.area_sqm || null,
          max_occupants: formData.max_occupants || null,
          status: formData.status,
          amenities: formData.amenities,
          images: formData.images.map((url, idx) => ({ url, sort_order: idx })),
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

  // Antd Table columns configuration
  const columns: TableColumnsType<Room> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      render: (id) => <span className="font-mono font-medium text-slate-500">#{id}</span>,
    },
    {
      title: "Phòng",
      key: "room",
      render: (_, record) => {
        const imageUrl = record.images && record.images.length > 0 
          ? record.images[0].url 
          : "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&q=80";
        const addressText = [record.address, record.district, record.city]
          .filter(Boolean)
          .join(", ");
        return (
          <div className="flex items-center gap-3">
            <img 
              src={imageUrl} 
              alt={record.title}
              className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0 shadow-sm" 
            />
            <div className="flex flex-col">
              <span className="font-semibold text-slate-700 line-clamp-1">{record.title}</span>
              {addressText && (
                <span className="text-xs text-slate-400 mt-0.5 line-clamp-1">{addressText}</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Diện tích",
      dataIndex: "area_sqm",
      key: "area_sqm",
      width: 100,
      render: (area) => (area ? `${area} m²` : "N/A"),
    },
    {
      title: "Giá thuê",
      dataIndex: "price_monthly",
      key: "price_monthly",
      width: 140,
      render: (price) => (
        <span className="text-indigo-600 font-bold">{formatVND(Number(price))}</span>
      ),
    },
    {
      title: "Khách tối đa",
      dataIndex: "max_occupants",
      key: "max_occupants",
      width: 110,
      render: (occ) => (occ ? `${occ} người` : "N/A"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status) => {
        const isAvailable = status === "available";
        return (
          <Tag color={isAvailable ? "success" : "error"} className="border-0 rounded-full px-2.5 py-0.5 font-medium">
            {isAvailable ? "Còn trống" : "Đã thuê"}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 140,
      align: "right",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<Eye className="w-4 h-4 text-indigo-600" />}
              onClick={() => openViewModal(record)}
              className="hover:bg-indigo-50 rounded-full flex items-center justify-center p-0 w-8 h-8"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<Edit3 className="w-4 h-4 text-amber-500" />}
              onClick={() => openEditModal(record)}
              className="hover:bg-amber-50 rounded-full flex items-center justify-center p-0 w-8 h-8"
            />
          </Tooltip>
          <Popconfirm
            title="Xóa phòng trọ"
            description="Bạn có chắc chắn muốn xóa phòng trọ này?"
            onConfirm={() => handleDeleteRoom(record.id)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<Trash2 className="w-4 h-4" />}
              className="hover:bg-rose-50 rounded-full flex items-center justify-center p-0 w-8 h-8"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800">Quản lý phòng</h1>
          <p className="text-slate-500 mt-1">
            {`Tổng cộng ${meta?.total || 0} phòng đang hoạt động`}
          </p>
        </div>
        <Button
          onClick={openAddModal}
          type="primary"
          className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-10 border-0 flex items-center gap-1.5 shadow-md font-medium"
        >
          <Plus className="w-4 h-4" /> Thêm phòng mới
        </Button>
      </div>

      {/* Filter and search controls */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 min-w-[260px]">
          <Input 
            prefix={<Search className="w-4 h-4 text-slate-400 mr-1" />} 
            placeholder="Tìm theo tên, địa chỉ..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="rounded-full h-10"
            allowClear
          />
        </div>
        <Select 
          value={statusFilter} 
          onChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
          className="w-44 h-10 custom-select-rounded"
          dropdownClassName="rounded-xl"
          options={[
            { value: "all", label: "Tất cả trạng thái" },
            { value: "available", label: "Còn trống" },
            { value: "occupied", label: "Đã thuê" }
          ]}
        />
      </div>

      {/* Add / Edit Room Modal */}
      <Modal
        title={
          <span className="text-xl font-bold text-slate-800">
            {isAddModalOpen ? "Thêm phòng mới" : "Cập nhật phòng"}
          </span>
        }
        open={isAddModalOpen || isEditModalOpen}
        onOk={isAddModalOpen ? handleSubmit(onAddSubmit) : handleSubmit(onEditSubmit)}
        onCancel={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedRoom(null);
        }}
        confirmLoading={isCreating || isUpdating}
        okText={isAddModalOpen ? "Thêm mới" : "Lưu thay đổi"}
        cancelText="Hủy"
        okButtonProps={{ className: "rounded-full h-10 px-5" }}
        cancelButtonProps={{ className: "rounded-full h-10 px-5" }}
        width={750}
      >
        <form onSubmit={(e) => e.preventDefault()} className="py-4 space-y-4 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="text-sm font-semibold text-slate-600 block mb-1">Tên phòng trọ *</label>
              <Input
                placeholder="Ví dụ: Phòng studio ban công Q.10 full nội thất"
                {...register("title")}
                className="rounded-lg h-10"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Giá thuê hàng tháng (VND) *</label>
              <Input
                type="number"
                placeholder="Ví dụ: 4500000"
                {...register("price_monthly", { valueAsNumber: true })}
                className="rounded-lg h-10"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Tiền đặt cọc (VND)</label>
              <Input
                type="number"
                placeholder="Ví dụ: 4500000"
                {...register("deposit_amount", { valueAsNumber: true })}
                className="rounded-lg h-10"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Diện tích (m²)</label>
              <Input
                type="number"
                placeholder="Ví dụ: 25"
                {...register("area_sqm", { valueAsNumber: true })}
                className="rounded-lg h-10"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Số người tối đa</label>
              <Input
                type="number"
                placeholder="Ví dụ: 2"
                {...register("max_occupants", { valueAsNumber: true })}
                className="rounded-lg h-10"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Trạng thái</label>
              <Select 
                value={watch("status")} 
                onChange={(val: any) => setValue("status", val)}
                className="w-full h-10"
                options={[
                  { value: "available", label: "Còn trống" },
                  { value: "occupied", label: "Đã thuê" }
                ]}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Thành phố</label>
              <Input
                placeholder="Ví dụ: TP.HCM"
                {...register("city")}
                className="rounded-lg h-10"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">Quận / Huyện</label>
              <Input
                placeholder="Ví dụ: Quận 10"
                {...register("district")}
                className="rounded-lg h-10"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="text-sm font-semibold text-slate-600 block mb-1">Địa chỉ chi tiết (Số nhà, Tên đường...)</label>
              <Input
                placeholder="Ví dụ: 12 Lý Thường Kiệt, P.7"
                {...register("address")}
                className="rounded-lg h-10"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="text-sm font-semibold text-slate-600 block mb-1">Mô tả chi tiết</label>
              <Input.TextArea
                rows={4}
                placeholder="Mô tả thông tin chi tiết về phòng trọ, quy định, giờ giấc..."
                {...register("description")}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Amenities selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 block">Tiện ích tích hợp</label>
            {availableAmenities.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border border-slate-100 p-4 rounded-2xl max-h-40 overflow-y-auto bg-slate-50/50">
                {availableAmenities.map((am) => (
                  <Checkbox
                    key={am.id}
                    checked={watchedAmenities.includes(am.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setValue("amenities", [...watchedAmenities, am.id]);
                      } else {
                        setValue("amenities", watchedAmenities.filter((id) => id !== am.id));
                      }
                    }}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {am.name}
                  </Checkbox>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-400">Không tìm thấy tiện ích hệ thống nào. Vui lòng thêm tiện ích trước.</div>
            )}
          </div>

          {/* Image URLs input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 block">Danh sách liên kết hình ảnh (URLs)</label>
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Nhập liên kết hình ảnh (Ví dụ: https://images.unsplash.com/...)"
                className="rounded-lg h-10"
              />
              <Button
                onClick={() => {
                  if (newImageUrl.trim()) {
                    setValue("images", [...watchedImages, newImageUrl.trim()]);
                    setNewImageUrl("");
                  }
                }}
                className="rounded-lg h-10 px-4 shrink-0"
              >
                Thêm ảnh
              </Button>
            </div>

            {watchedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border border-slate-100 p-3 rounded-2xl bg-slate-50/50 mt-2">
                {watchedImages.map((url, idx) => (
                  <div key={idx} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-white">
                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setValue("images", watchedImages.filter((_, i) => i !== idx))}
                      className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </Modal>

      {/* View Room Modal */}
      <Modal
        title={<span className="text-xl font-bold text-slate-800">Chi tiết phòng trọ</span>}
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalOpen(false)} className="rounded-full h-10 px-5">
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
                  <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                    <img src={img.url} alt={`Detail ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 border border-dashed rounded-2xl text-slate-400 text-sm">
                Chưa có hình ảnh nào cho phòng trọ này.
              </div>
            )}

            {/* Room Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Tên phòng</span>
                <span className="font-semibold text-slate-800 text-lg">{selectedRoom.title}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium mb-1">Trạng thái</span>
                <Tag color={selectedRoom.status === "available" ? "success" : "error"} className="border-0 rounded-full px-2.5 py-0.5 font-medium">
                  {selectedRoom.status === "available" ? "Còn trống" : "Đã thuê"}
                </Tag>
              </div>

              <div>
                <span className="text-xs text-slate-400 block font-medium">Giá thuê</span>
                <span className="font-bold text-indigo-600 text-lg">{formatVND(Number(selectedRoom.price_monthly))}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Tiền đặt cọc</span>
                <span className="font-semibold text-slate-800 text-lg">{formatVND(Number(selectedRoom.deposit_amount) || 0)}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block font-medium">Diện tích</span>
                <span className="font-semibold text-slate-800 text-lg">{selectedRoom.area_sqm || 0} m²</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Số người tối đa</span>
                <span className="font-semibold text-slate-800 text-lg">{selectedRoom.max_occupants || 1} người</span>
              </div>

              <div className="col-span-1 md:col-span-2">
                <span className="text-xs text-slate-400 block font-medium">Địa chỉ</span>
                <span className="font-semibold text-slate-800">
                  {selectedRoom.address ? `${selectedRoom.address}, ` : ""}
                  {selectedRoom.district ? `${selectedRoom.district}, ` : ""}
                  {selectedRoom.city || ""}
                </span>
              </div>

              {selectedRoom.description && (
                <div className="col-span-1 md:col-span-2">
                  <span className="text-xs text-slate-400 block font-medium">Mô tả</span>
                  <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed">{selectedRoom.description}</p>
                </div>
              )}
            </div>

            {/* Amenities Tag List */}
            <div>
              <span className="text-xs text-slate-400 block font-medium mb-2">Tiện ích tích hợp</span>
              {selectedRoom.amenities && selectedRoom.amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.amenities.map((am) => (
                    <Tag key={am.id} className="rounded-full bg-slate-50 text-slate-600 px-3.5 py-1 font-normal border-slate-200">
                      {am.name}
                    </Tag>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-slate-400">Không có tiện ích nào được gán.</span>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Main Table representation */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={rooms}
          rowKey="id"
          loading={isLoading}
          pagination={
            meta && meta.last_page > 1
              ? {
                  current: page,
                  total: meta.total,
                  pageSize: meta.per_page,
                  onChange: (p) => setPage(p),
                  showTotal: (total) => `Hiển thị từ ${meta.from || 0} - ${meta.to || 0} trong tổng số ${total} phòng`,
                }
              : false
          }
          className="custom-table"
        />
      </div>
    </div>
  );
}

export default RoomsManage;
