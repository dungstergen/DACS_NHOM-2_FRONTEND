import { useState } from "react";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  User,
  MapPin,
  Calendar,
  Eye,
  Download,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import {
  Table,
  Button,
  Select,
  Space,
  Card,
  Spin,
  Tooltip,
  Modal,
  Input,
  Empty,
  Form,
  Tag,
  Descriptions,
  DatePicker,
} from "antd";
import type { TableColumnsType } from "antd";
import { toast } from "sonner";
import { useContracts, useCreateContract, useUpdateContractStatus } from "../../../hook/useContracts";
import { useRooms } from "../../../hook/useRooms";
import { useOrders } from "../../../hook/useOrders";
import { useAppointments } from "../../../hook/useAppointments";
import type { RentalContract, ContractStatus } from "../../../interface/contract.interface";

const formatDate = (val?: string) => {
  if (!val) return "---";
  const dateObj = new Date(val);
  if (isNaN(dateObj.getTime())) return val;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateTime = (val?: string) => {
  if (!val) return "---";
  const dateObj = new Date(val);
  if (isNaN(dateObj.getTime())) return val;
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};


const STATUS_MAP: Record<
  ContractStatus,
  { label: string; color: string; className: string }
> = {
  draft: {
    label: "Bản nháp",
    color: "default",
    className: "bg-slate-100 text-slate-700 border-0 font-medium rounded-full !inline-flex !items-center gap-1 whitespace-nowrap !py-1 !px-2.5",
  },
  active: {
    label: "Đang hiệu lực",
    color: "success",
    className: "bg-emerald-50 text-emerald-700 border-0 font-medium rounded-full !inline-flex !items-center gap-1 whitespace-nowrap !py-1 !px-2.5",
  },
  expired: {
    label: "Hết hạn",
    color: "warning",
    className: "bg-amber-50 text-amber-700 border-0 font-medium rounded-full !inline-flex !items-center gap-1 whitespace-nowrap !py-1 !px-2.5",
  },
  terminated: {
    label: "Đã thanh lý",
    color: "error",
    className: "bg-rose-50 text-rose-700 border-0 font-medium rounded-full !inline-flex !items-center gap-1 whitespace-nowrap !py-1 !px-2.5",
  },
};

export function Contracts() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<RentalContract | null>(null);

  const [form] = Form.useForm();

  // Fetch contracts
  const {
    data: contractsRes,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useContracts({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  // Fetch available rooms for creation
  const { data: roomsRes, isLoading: isLoadingRooms } = useRooms(1, {
    status: "available",
    perPage: 100,
  });

  // Fetch orders & appointments to populate tenant dropdown
  const { data: ordersRes } = useOrders({ per_page: 100 });
  const { data: appointmentsRes } = useAppointments({ per_page: 100 });

  const createContractMutation = useCreateContract();
  const updateStatusMutation = useUpdateContractStatus();

  // Extract candidate users from orders and appointments
  const usersMap = new Map();
  ordersRes?.data?.forEach((o) => {
    if (o.user) {
      usersMap.set(o.user.id, o.user);
    }
  });
  appointmentsRes?.data?.forEach((a) => {
    if (a.user) {
      usersMap.set(a.user.id, a.user);
    }
  });
  const candidateTenants = Array.from(usersMap.values());

  const handleCreateContract = (values: any) => {
    const payload = {
      room_id: values.room_id,
      user_id: values.user_id,
      start_date: values.start_date.format("YYYY-MM-DD"),
      end_date: values.end_date.format("YYYY-MM-DD"),
      monthly_rent: Number(values.monthly_rent),
      deposit_amount: Number(values.deposit_amount),
      status: values.status || "active",
    };

    createContractMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Tạo hợp đồng thuê phòng thành công!");
        setCreateModalOpen(false);
        form.resetFields();
      },
      onError: (err: any) => {
        const errMsg = err.response?.data?.message || "Tạo hợp đồng thất bại. Vui lòng thử lại.";
        toast.error(errMsg);
      },
    });
  };

  const handleUpdateStatus = (id: number, status: ContractStatus) => {
    updateStatusMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          const statusLabel = STATUS_MAP[status].label;
          toast.success(`Đã cập nhật trạng thái hợp đồng thành "${statusLabel}"`);
        },
        onError: (err: any) => {
          const errMsg = err.response?.data?.message || "Cập nhật trạng thái thất bại.";
          toast.error(errMsg);
        },
      }
    );
  };

  const handleRoomChange = (roomId: number) => {
    const selectedRoom = roomsRes?.data?.find((r) => r.id === roomId);
    if (selectedRoom) {
      form.setFieldsValue({
        monthly_rent: selectedRoom.price_monthly,
        deposit_amount: selectedRoom.deposit_amount || selectedRoom.price_monthly,
      });
    }
  };

  const handleOpenDetails = (contract: RentalContract) => {
    setSelectedContract(contract);
    setDetailsModalOpen(true);
  };

  const handlePrintPDF = (contract: RentalContract) => {
    toast.success(`Đang tải tệp PDF hợp đồng #HD-${contract.id}...`);
    // Mock print/download
  };

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Get contracts list (Note: response is pagination direct object)
  const contractsList = contractsRes?.data || [];

  // Clientside search filter
  const filteredContracts = contractsList.filter((item) => {
    const tenantName = item.user?.full_name?.toLowerCase() || "";
    const tenantEmail = item.user?.email?.toLowerCase() || "";
    const roomTitle = item.room?.title?.toLowerCase() || "";
    const idStr = `#hd-${item.id}`.toLowerCase();
    const searchLower = searchText.toLowerCase();

    return (
      tenantName.includes(searchLower) ||
      tenantEmail.includes(searchLower) ||
      roomTitle.includes(searchLower) ||
      idStr.includes(searchLower)
    );
  });

  // Calculate statistics from loaded list
  const activeCount = contractsList.filter((c) => c.status === "active").length;
  const draftCount = contractsList.filter((c) => c.status === "draft").length;
  const expiredCount = contractsList.filter(
    (c) => c.status === "expired" || c.status === "terminated"
  ).length;

  const stats = [
    {
      label: "Đang hiệu lực",
      value: activeCount,
      gradient: "from-emerald-500 to-teal-500",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      label: "Bản nháp",
      value: draftCount,
      gradient: "from-slate-500 to-slate-700",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      label: "Hết hạn / Thanh lý",
      value: expiredCount,
      gradient: "from-amber-500 to-rose-500",
      icon: <XCircle className="w-5 h-5" />,
    },
  ];

  const columns: TableColumnsType<RentalContract> = [
    {
      title: "Mã HĐ",
      dataIndex: "id",
      key: "id",
      render: (id: number) => <span className="font-mono font-medium text-slate-800">#HD-{id}</span>,
    },
    {
      title: "Khách thuê",
      key: "tenant",
      render: (_, record) => {
        const name = record.user?.full_name || `Khách thuê #${record.user_id}`;
        const email = record.user?.email || "Chưa cập nhật email";
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
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
      title: "Phòng thuê",
      key: "room",
      render: (_, record) => {
        const title = record.room?.title || `Phòng #${record.room_id}`;
        const address =
          [record.room?.district, record.room?.city].filter(Boolean).join(", ") ||
          "Chưa cập nhật địa chỉ";
        return (
          <div>
            <div className="font-medium text-slate-700 max-w-[200px] truncate" title={title}>
              {title}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-0.5 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate max-w-[170px]">{address}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Giá thuê/Tháng",
      dataIndex: "monthly_rent",
      key: "monthly_rent",
      render: (rent: number) => <span className="font-semibold text-slate-800">{formatVND(rent)}</span>,
    },
    {
      title: "Thời hạn hợp đồng",
      key: "duration",
      render: (_, record) => {
        const start = formatDate(record.start_date);
        const end = formatDate(record.end_date);
        return (
          <div className="text-xs text-slate-700 font-medium flex items-center gap-1">
            <span>{start}</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span>{end}</span>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: ContractStatus, record) => {
        return (
          <Select
            value={status}
            onChange={(val) => handleUpdateStatus(record.id, val as ContractStatus)}
            className="w-36 custom-antd-select"
            options={[
              { value: "draft", label: <span className="text-slate-600">Bản nháp</span> },
              { value: "active", label: <span className="text-emerald-700">Đang hiệu lực</span> },
              { value: "expired", label: <span className="text-amber-700">Hết hạn</span> },
              { value: "terminated", label: <span className="text-rose-700">Đã thanh lý</span> },
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
        return (
          <Space size="small">
            <Tooltip title="Xem chi tiết hợp đồng">
              <Button
                shape="circle"
                icon={<Eye className="w-4 h-4" />}
                onClick={() => handleOpenDetails(record)}
                className="flex items-center justify-center"
              />
            </Tooltip>
            <Tooltip title="Tải PDF">
              <Button
                shape="circle"
                icon={<Download className="w-4 h-4" />}
                onClick={() => handlePrintPDF(record)}
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
        <h3 className="text-lg font-semibold text-slate-800">Lỗi tải hợp đồng</h3>
        <p className="text-slate-500">
          Không thể lấy danh sách hợp đồng từ máy chủ. Vui lòng kiểm tra lại kết nối.
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
          <h1 className="text-3xl tracking-tight">Hợp đồng thuê</h1>
          <p className="text-muted-foreground mt-1">Tạo và quản lý hợp đồng cho thuê phòng trọ</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => refetch()}
            loading={isRefetching}
            icon={<RefreshCw className="w-4 h-4" />}
            className="rounded-full flex items-center justify-center"
          >
            Làm mới
          </Button>

          <Button
            onClick={() => setCreateModalOpen(true)}
            type="primary"
            className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 border-0 flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tạo hợp đồng mới
          </Button>
        </div>
      </div>

      {/* Stats counter */}
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

      {/* Filter row */}
      <Card className="rounded-2xl border border-border shadow-sm" bodyStyle={{ padding: "16px" }}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="text-sm font-medium text-slate-600">Lọc theo:</div>

            <Select
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              className="w-44 rounded-full"
              options={[
                { value: "all", label: "Tất cả trạng thái" },
                { value: "draft", label: "Bản nháp" },
                { value: "active", label: "Đang hiệu lực" },
                { value: "expired", label: "Hết hạn" },
                { value: "terminated", label: "Đã thanh lý" },
              ]}
              dropdownStyle={{ borderRadius: "8px" }}
            />
          </div>

          <div className="w-full md:w-80">
            <Input.Search
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Tìm theo mã HĐ, khách hàng, phòng..."
              className="rounded-full"
              allowClear
            />
          </div>
        </div>
      </Card>

      {/* Contracts Table */}
      <div className="rounded-2xl bg-white border border-border overflow-hidden shadow-sm mt-3">
        <Table
          dataSource={filteredContracts}
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
                description={<span className="text-muted-foreground">Không tìm thấy hợp đồng nào</span>}
              />
            ),
          }}
        />
      </div>

      {/* Create contract modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-indigo-600 font-semibold">
            <Plus className="w-5 h-5" />
            <span>Tạo hợp đồng thuê mới</span>
          </div>
        }
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          form.resetFields();
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setCreateModalOpen(false);
              form.resetFields();
            }}
            className="rounded-full"
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="bg-indigo-600 hover:bg-indigo-700 border-0 rounded-full"
            loading={createContractMutation.isPending}
            onClick={() => form.submit()}
          >
            Tạo hợp đồng
          </Button>,
        ]}
        width={650}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateContract} className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item
              name="user_id"
              label="Khách hàng thuê phòng (Bên thuê)"
              rules={[{ required: true, message: "Vui lòng chọn khách hàng!" }]}
            >
              <Select
                showSearch
                placeholder="Chọn khách hàng từ lịch sử đặt/hẹn"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={candidateTenants.map((u) => ({
                  value: u.id,
                  label: `${u.full_name} (${u.email})`,
                }))}
                dropdownStyle={{ borderRadius: "8px" }}
              />
            </Form.Item>

            <Form.Item
              name="room_id"
              label="Phòng trọ cho thuê"
              rules={[{ required: true, message: "Vui lòng chọn phòng trọ!" }]}
            >
              <Select
                showSearch
                placeholder="Chọn phòng còn trống..."
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                onChange={handleRoomChange}
                loading={isLoadingRooms}
                options={roomsRes?.data?.map((r) => ({
                  value: r.id,
                  label: `${r.title} - ${formatVND(r.price_monthly)}/tháng`,
                }))}
                dropdownStyle={{ borderRadius: "8px" }}
              />
            </Form.Item>

            <Form.Item
              name="monthly_rent"
              label="Giá thuê phòng (VND / Tháng)"
              rules={[{ required: true, message: "Vui lòng nhập giá thuê!" }]}
            >
              <Input type="number" placeholder="Ví dụ: 3500000" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="deposit_amount"
              label="Tiền cọc giữ phòng (VND)"
              rules={[{ required: true, message: "Vui lòng nhập tiền cọc!" }]}
            >
              <Input type="number" placeholder="Ví dụ: 3500000" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="start_date"
              label="Ngày bắt đầu hợp đồng"
              rules={[{ required: true, message: "Chọn ngày bắt đầu!" }]}
            >
              <DatePicker className="w-full rounded-lg" format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item
              name="end_date"
              label="Ngày hết hạn hợp đồng"
              rules={[{ required: true, message: "Chọn ngày kết thúc!" }]}
            >
              <DatePicker className="w-full rounded-lg" format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item name="status" label="Trạng thái khởi tạo">
              <Select
                defaultValue="active"
                options={[
                  { value: "active", label: "Kích hoạt hiệu lực ngay (Active)" },
                  { value: "draft", label: "Lưu làm bản nháp (Draft)" },
                ]}
                className="rounded-lg"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* View contract details modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-indigo-600 font-semibold">
            <FileText className="w-5 h-5" />
            <span>Chi tiết hợp đồng thuê phòng</span>
          </div>
        }
        open={detailsModalOpen}
        onCancel={() => {
          setDetailsModalOpen(false);
          setSelectedContract(null);
        }}
        footer={[
          <Button
            key="print"
            onClick={() => selectedContract && handlePrintPDF(selectedContract)}
            icon={<Download className="w-4 h-4" />}
            className="rounded-full"
          >
            Tải PDF
          </Button>,
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setDetailsModalOpen(false);
              setSelectedContract(null);
            }}
            className="rounded-full"
          >
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {selectedContract && (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <div>
                <span className="text-xs text-slate-500">Mã số hợp đồng</span>
                <div className="font-mono font-bold text-slate-800 text-base">#HD-{selectedContract.id}</div>
              </div>
              <Tag className={STATUS_MAP[selectedContract.status]?.className}>
                {STATUS_MAP[selectedContract.status]?.label}
              </Tag>
            </div>

            <Descriptions bordered column={1} size="small" className="rounded-xl overflow-hidden">
              <Descriptions.Item label="Bên cho thuê">
                <strong>Hệ thống quản lý TroHub</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Bên thuê (Khách hàng)">
                <div>
                  <div className="font-semibold text-slate-800">
                    {selectedContract.user?.full_name || `Khách hàng #${selectedContract.user_id}`}
                  </div>
                  <div className="text-xs text-slate-500">
                    Email: {selectedContract.user?.email || "Chưa cập nhật"}
                  </div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Thông tin phòng thuê">
                <div>
                  <div className="font-semibold text-slate-800">
                    {selectedContract.room?.title || `Phòng #${selectedContract.room_id}`}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-0.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {[selectedContract.room?.district, selectedContract.room?.city]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Giá thuê phòng">
                <span className="font-bold text-indigo-600">
                  {formatVND(selectedContract.monthly_rent)} / Tháng
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Tiền đặt cọc giữ phòng">
                <span className="font-bold text-slate-800">
                  {formatVND(selectedContract.deposit_amount)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Thời hạn hợp đồng">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>
                    Từ {formatDate(selectedContract.start_date)} đến{" "}
                    {formatDate(selectedContract.end_date)}
                  </span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo hợp đồng">
                {formatDateTime(selectedContract.created_at)}
              </Descriptions.Item>
            </Descriptions>

            {selectedContract.status === "active" && (
              <div className="p-3 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  Hợp đồng đang có hiệu lực. Bạn có thể thay đổi trạng thái sang "Hết hạn" hoặc "Đã thanh lý" bằng ô điều chỉnh trạng thái ở bảng quản lý.
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Contracts;
