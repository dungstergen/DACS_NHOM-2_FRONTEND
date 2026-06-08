import { useState } from "react";
import {
  Check,
  X,
  Clock,
  Eye,
  RefreshCw,
  User,
  MapPin,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  Table,
  Button,
  Select,
  Space,
  Popconfirm,
  Card,
  Spin,
  Tooltip,
  Modal,
  Input,
  Empty,
  DatePicker,
} from "antd";
import type { TableColumnsType } from "antd";
import { toast } from "sonner";
import { useAppointments, useUpdateAppointmentStatus } from "../../../hook/useAppointments";
import type { Appointment, AppointmentStatus } from "../../../interface/appointment.interface";


const { RangePicker } = DatePicker;

const STATUS_MAP: Record<
  AppointmentStatus,
  { label: string; color: string; className: string }
> = {
  pending: {
    label: "Chờ duyệt",
    color: "warning",
    className: "bg-amber-50 text-amber-700 border-0 font-medium rounded-full !inline-flex !items-center gap-1 whitespace-nowrap !py-1 !px-2.5",
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "success",
    className: "bg-emerald-50 text-emerald-700 border-0 font-medium rounded-full !inline-flex !items-center gap-1 whitespace-nowrap !py-1 !px-2.5",
  },
  cancelled: {
    label: "Đã hủy",
    color: "error",
    className: "bg-rose-50 text-rose-700 border-0 font-medium rounded-full !inline-flex !items-center gap-1 whitespace-nowrap !py-1 !px-2.5",
  },
};

export function Appointments() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  
  // Note modal state
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  // Fetch appointments using react-query
  const {
    data: appointmentsRes,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useAppointments({
    status: statusFilter === "all" ? undefined : statusFilter,
    scheduled_from: dateRange?.[0] ? `${dateRange[0]} 00:00:00` : undefined,
    scheduled_to: dateRange?.[1] ? `${dateRange[1]} 23:59:59` : undefined,
  });

  const updateStatusMutation = useUpdateAppointmentStatus();

  const handleUpdateStatus = (id: number, status: AppointmentStatus) => {
    updateStatusMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          const statusLabel = STATUS_MAP[status].label;
          toast.success(`Đã cập nhật trạng thái lịch hẹn thành "${statusLabel}"`);
        },
        onError: (err: any) => {
          const errMsg = err.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.";
          toast.error(errMsg);
        },
      }
    );
  };

  const handleOpenNote = (note: string | null) => {
    setSelectedNote(note || "Không có ghi chú nào.");
    setIsNoteOpen(true);
  };

  // Get raw list from Response
  const appointmentsList = appointmentsRes?.data || [];

  // Filter clientside by search text (customer name or room title)
  const filteredAppointments = appointmentsList.filter((item) => {
    const customerName = item.user?.full_name?.toLowerCase() || "";
    const customerEmail = item.user?.email?.toLowerCase() || "";
    const roomTitle = item.room?.title?.toLowerCase() || "";
    const searchLower = searchText.toLowerCase();

    return (
      customerName.includes(searchLower) ||
      customerEmail.includes(searchLower) ||
      roomTitle.includes(searchLower)
    );
  });

  // Calculate statistics (from all items returned or filtered)
  const pendingCount = appointmentsList.filter((a) => a.status === "pending").length;
  const confirmedCount = appointmentsList.filter((a) => a.status === "confirmed").length;
  const cancelledCount = appointmentsList.filter((a) => a.status === "cancelled").length;

  const stats = [
    {
      label: "Chờ duyệt",
      value: pendingCount,
      gradient: "from-amber-500 to-orange-500",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      label: "Đã xác nhận",
      value: confirmedCount,
      gradient: "from-emerald-500 to-teal-500",
      icon: <Check className="w-5 h-5" />,
    },
    {
      label: "Đã hủy",
      value: cancelledCount,
      gradient: "from-rose-500 to-pink-500",
      icon: <X className="w-5 h-5" />,
    },
  ];

  const columns: TableColumnsType<Appointment> = [
    {
      title: "Khách hàng",
      key: "customer",
      render: (_, record) => {
        const name = record.user?.full_name || `Khách hàng #${record.user_id}`;
        const email = record.user?.email || "Chưa cập nhật email";
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">{name}</div>
              <div className="text-xs text-slate-500">{email}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Phòng trọ",
      key: "room",
      render: (_, record) => {
        const title = record.room?.title || `Phòng #${record.room_id}`;
        const address =
          [record.room?.district, record.room?.city].filter(Boolean).join(", ") ||
          "Chưa cập nhật địa chỉ";
        return (
          <div>
            <div className="font-medium text-slate-700 max-w-[250px] truncate" title={title}>
              {title}
            </div>
            {address && (
              <div className="text-xs text-muted-foreground flex items-center gap-0.5 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate max-w-[200px]">{address}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Ngày & giờ hẹn",
      dataIndex: "scheduled_at",
      key: "scheduled_at",
      render: (val: string) => {
        if (!val) return "---";
        const dateObj = new Date(val);
        const dateStr = dateObj.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        const timeStr = dateObj.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <div className="flex flex-col">
            <span className="font-medium text-slate-800">{dateStr}</span>
            <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {timeStr}
            </span>
          </div>
        );
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (val: string | null) => {
        if (!val) return <span className="text-slate-400 italic text-xs">Không có</span>;
        return (
          <div className="flex items-center gap-1.5">
            <Tooltip title="Xem chi tiết ghi chú">
              <Button
                type="text"
                size="small"
                className="!px-1 hover:bg-slate-100 text-slate-500 flex items-center gap-1"
                onClick={() => handleOpenNote(val)}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="text-xs truncate max-w-[120px]">{val}</span>
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: AppointmentStatus, record) => {
        return (
          <Select
            value={status}
            onChange={(val) => handleUpdateStatus(record.id, val)}
            className="w-36 rounded-full custom-antd-select"
            options={[
              {
                value: "pending",
                label: (
                  <span className="flex items-center gap-1 text-amber-700">
                    <Clock className="w-3.5 h-3.5" /> Chờ duyệt
                  </span>
                ),
              },
              {
                value: "confirmed",
                label: (
                  <span className="flex items-center gap-1 text-emerald-700">
                    <Check className="w-3.5 h-3.5" /> Đã xác nhận
                  </span>
                ),
              },
              {
                value: "cancelled",
                label: (
                  <span className="flex items-center gap-1 text-rose-700">
                    <X className="w-3.5 h-3.5" /> Đã hủy
                  </span>
                ),
              },
            ]}
            dropdownStyle={{ borderRadius: "12px" }}
          />
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right",
      render: (_, record) => {
        const isPending = record.status === "pending";
        return (
          <Space size="small">
            {isPending && (
              <>
                <Button
                  onClick={() => handleUpdateStatus(record.id, "confirmed")}
                  type="primary"
                  size="middle"
                  className="bg-emerald-600 hover:bg-emerald-700 border-0 rounded-full flex items-center gap-1 shadow-sm text-xs"
                >
                  <Check className="w-3.5 h-3.5" /> Duyệt
                </Button>
                <Popconfirm
                  title="Từ chối lịch hẹn?"
                  description="Bạn có chắc chắn muốn hủy lịch hẹn này?"
                  okText="Hủy lịch"
                  cancelText="Hủy bỏ"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => handleUpdateStatus(record.id, "cancelled")}
                >
                  <Button
                    danger
                    size="middle"
                    className="rounded-full flex items-center gap-1 text-xs"
                  >
                    <X className="w-3.5 h-3.5" /> Từ chối
                  </Button>
                </Popconfirm>
              </>
            )}
            <Tooltip title="Xem chi tiết ghi chú">
              <Button
                shape="circle"
                icon={<Eye className="w-4 h-4" />}
                onClick={() => handleOpenNote(record.note)}
                className="flex items-center justify-center"
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  if (isError) {
    return (
      <div className="p-8 text-center bg-white border border-border rounded-2xl space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-semibold text-slate-800">Lỗi tải dữ liệu</h3>
        <p className="text-slate-500">
          Không thể lấy danh sách lịch hẹn từ máy chủ. Vui lòng kiểm tra lại kết nối.
        </p>
        <Button
          onClick={() => refetch()}
          icon={<RefreshCw className="w-4 h-4 mr-1" />}
          className="rounded-full"
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Lịch hẹn xem phòng</h1>
          <p className="text-muted-foreground mt-1">
            Duyệt và quản lý lịch hẹn xem phòng từ khách hàng gửi đến
          </p>
        </div>
        <div>
          <Button
            onClick={() => refetch()}
            loading={isRefetching}
            icon={<RefreshCw className="w-4 h-4" />}
            className="rounded-full flex items-center justify-center"
          >
            Làm mới
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="p-5 rounded-2xl bg-white border border-border">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white`}
            >
              {s.icon}
            </div>
            <div className="text-3xl mt-3 font-semibold text-slate-800">
              {isLoading ? <Spin size="small" /> : s.value}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter panel */}
      <Card className="rounded-2xl border border-border" bodyStyle={{ padding: "16px" }}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="text-sm font-medium text-slate-600">Lọc theo:</div>
            
            <Select
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              className="w-40 rounded-full"
              options={[
                { value: "all", label: "Tất cả trạng thái" },
                { value: "pending", label: "Chờ duyệt" },
                { value: "confirmed", label: "Đã xác nhận" },
                { value: "cancelled", label: "Đã hủy" },
              ]}
              dropdownStyle={{ borderRadius: "8px" }}
            />

            <RangePicker
              onChange={(dates) => {
                if (dates) {
                  setDateRange([
                    dates[0]?.format("YYYY-MM-DD") || "",
                    dates[1]?.format("YYYY-MM-DD") || "",
                  ]);
                } else {
                  setDateRange(null);
                }
              }}
              placeholder={["Từ ngày", "Đến ngày"]}
              className="rounded-full"
            />
          </div>

          <div className="w-full md:w-80">
            <Input.Search
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Tìm theo khách hàng, phòng..."
              className="rounded-full"
              allowClear
            />
          </div>
        </div>
      </Card>

      {/* Appointments Table */}
      <div className="rounded-2xl bg-white border border-border overflow-hidden shadow-sm">
        <Table
          dataSource={filteredAppointments}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            className: "pr-4 pb-2",
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-muted-foreground">Không tìm thấy lịch hẹn nào</span>
                }
              />
            ),
          }}
        />
      </div>

      {/* Note details modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-indigo-600 font-semibold">
            <FileText className="w-5 h-5" />
            <span>Chi tiết ghi chú lịch hẹn</span>
          </div>
        }
        open={isNoteOpen}
        onCancel={() => setIsNoteOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsNoteOpen(false)} className="rounded-full">
            Đóng
          </Button>,
        ]}
        width={450}
        bodyStyle={{ paddingTop: "12px", paddingBottom: "12px" }}
      >
        <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
          {selectedNote}
        </p>
      </Modal>
    </div>
  );
}

export default Appointments;
