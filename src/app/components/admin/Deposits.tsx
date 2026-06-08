import { useState } from "react";
import {
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  User,
  MapPin,
  AlertCircle,
  CreditCard,
  Calendar,
  Eye,
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
  Form,
  Tag,
  Descriptions,
} from "antd";
import type { TableColumnsType } from "antd";
import { toast } from "sonner";
import { useOrders, useUpdateOrder } from "../../../hook/useOrders";
import type { Order, OrderStatus } from "../../../interface/order.interface";

const STATUS_MAP: Record<
  OrderStatus,
  { label: string; color: string; className: string }
> = {
  pending: {
    label: "Chờ thanh toán",
    color: "warning",
    className: "bg-amber-50 text-amber-700 border-0 font-medium rounded-full !inline-flex !items-center gap-1 whitespace-nowrap !py-1 !px-2.5",
  },
  paid: {
    label: "Đã nhận cọc",
    color: "success",
    className: "bg-emerald-50 text-emerald-700 border-0 font-medium rounded-full !inline-flex !items-center gap-1 whitespace-nowrap !py-1 !px-2.5",
  },
  cancelled: {
    label: "Đã hủy",
    color: "error",
    className: "bg-rose-50 text-rose-700 border-0 font-medium rounded-full !inline-flex !items-center gap-1 whitespace-nowrap !py-1 !px-2.5",
  },
  refunded: {
    label: "Đã hoàn cọc",
    color: "default",
    className: "bg-slate-100 text-slate-700 border-0 font-medium rounded-full !inline-flex !items-center gap-1 whitespace-nowrap !py-1 !px-2.5",
  },
};

const PAYMENT_METHODS: Record<string, string> = {
  cash: "Tiền mặt",
  bank_transfer: "Chuyển khoản",
  momo: "Ví Momo",
  vnpay: "VNPay",
};

export function Deposits() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");

  // Payment confirmation modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [form] = Form.useForm();

  // Details modal state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);

  // Fetch orders using TanStack React Query hook
  const {
    data: ordersRes,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useOrders({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const updateOrderMutation = useUpdateOrder();

  const handleOpenPaymentModal = (order: Order) => {
    setSelectedOrder(order);
    form.setFieldsValue({
      payment_method: "bank_transfer",
      payment_ref: "",
    });
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = (values: { payment_method: string; payment_ref: string }) => {
    if (!selectedOrder) return;

    updateOrderMutation.mutate(
      {
        id: selectedOrder.id,
        data: {
          status: "paid",
          payment_method: values.payment_method,
          payment_ref: values.payment_ref || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Xác nhận thanh toán đặt cọc thành công!");
          setPaymentModalOpen(false);
          setSelectedOrder(null);
        },
        onError: (err: any) => {
          const errMsg = err.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.";
          toast.error(errMsg);
        },
      }
    );
  };

  const handleUpdateStatus = (id: number, status: OrderStatus) => {
    updateOrderMutation.mutate(
      {
        id,
        data: { status },
      },
      {
        onSuccess: () => {
          const statusLabel = STATUS_MAP[status].label;
          toast.success(`Đã cập nhật trạng thái đơn thành "${statusLabel}"`);
        },
        onError: (err: any) => {
          const errMsg = err.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.";
          toast.error(errMsg);
        },
      }
    );
  };

  const handleOpenDetails = (order: Order) => {
    setDetailsOrder(order);
    setDetailsModalOpen(true);
  };

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const ordersList = ordersRes?.data || [];

  // Clientside search filter
  const filteredOrders = ordersList.filter((item) => {
    const customerName = item.user?.full_name?.toLowerCase() || "";
    const customerEmail = item.user?.email?.toLowerCase() || "";
    const roomTitle = item.room?.title?.toLowerCase() || "";
    const idStr = `#ord-${item.id}`.toLowerCase();
    const searchLower = searchText.toLowerCase();

    return (
      customerName.includes(searchLower) ||
      customerEmail.includes(searchLower) ||
      roomTitle.includes(searchLower) ||
      idStr.includes(searchLower)
    );
  });

  // Calculate dashboard summary statistics
  const totalPaidAmount = ordersList
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.amount, 0);

  const pendingCount = ordersList.filter((o) => o.status === "pending").length;
  const paidCount = ordersList.filter((o) => o.status === "paid").length;

  const columns: TableColumnsType<Order> = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      render: (id: number) => <span className="font-mono font-medium text-indigo-600">#ORD-{id}</span>,
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (_, record) => {
        const name = record.user?.full_name || `Hội viên #${record.user_id}`;
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
        const location =
          [record.room?.district, record.room?.city].filter(Boolean).join(", ") ||
          "Chưa cập nhật địa chỉ";
        return (
          <div>
            <div className="font-medium text-slate-700 max-w-[220px] truncate" title={title}>
              {title}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-0.5 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate max-w-[180px]">{location}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Tiền đặt cọc",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => (
        <span className="font-semibold text-slate-800">{formatVND(amount)}</span>
      ),
    },
    {
      title: "Hình thức",
      key: "payment",
      render: (_, record) => {
        if (record.status === "pending") {
          return <span className="text-slate-400 text-xs italic">Chờ thanh toán</span>;
        }
        const method = record.payment_method
          ? PAYMENT_METHODS[record.payment_method] || record.payment_method
          : "Chưa rõ";
        const ref = record.payment_ref || "";
        return (
          <div>
            <div className="text-xs text-slate-700 font-medium flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-slate-400" />
              {method}
            </div>
            {ref && <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{ref}</div>}
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: OrderStatus, record) => {
        return (
          <Select
            value={status}
            onChange={(val) => {
              if (val === "paid") {
                handleOpenPaymentModal(record);
              } else {
                handleUpdateStatus(record.id, val as OrderStatus);
              }
            }}
            className="w-36 custom-antd-select"
            options={[
              {
                value: "pending",
                label: <span className="text-amber-700">Chờ thanh toán</span>,
              },
              {
                value: "paid",
                label: <span className="text-emerald-700">Đã nhận cọc</span>,
              },
              {
                value: "cancelled",
                label: <span className="text-rose-700">Đã hủy</span>,
              },
              {
                value: "refunded",
                label: <span className="text-slate-700">Đã hoàn cọc</span>,
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
        const isPaid = record.status === "paid";
        return (
          <Space size="small">
            {isPending && (
              <>
                <Button
                  onClick={() => handleOpenPaymentModal(record)}
                  type="primary"
                  size="middle"
                  className="bg-emerald-600 hover:bg-emerald-700 border-0 rounded-full flex items-center gap-1 shadow-sm text-xs"
                >
                  <DollarSign className="w-3.5 h-3.5" /> Xác nhận cọc
                </Button>
                <Popconfirm
                  title="Hủy đơn đăng ký?"
                  description="Bạn có chắc chắn muốn hủy đơn đăng ký thuê này?"
                  okText="Hủy đơn"
                  cancelText="Quay lại"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => handleUpdateStatus(record.id, "cancelled")}
                >
                  <Button
                    danger
                    size="middle"
                    className="rounded-full flex items-center gap-1 text-xs"
                  >
                    Hủy
                  </Button>
                </Popconfirm>
              </>
            )}

            {isPaid && (
              <Popconfirm
                title="Hoàn cọc cho khách?"
                description="Bạn có chắc chắn muốn hoàn cọc cho đơn thuê này?"
                okText="Hoàn cọc"
                cancelText="Quay lại"
                onConfirm={() => handleUpdateStatus(record.id, "refunded")}
              >
                <Button
                  size="middle"
                  className="rounded-full border-slate-300 hover:border-slate-400 text-xs"
                >
                  Hoàn cọc
                </Button>
              </Popconfirm>
            )}

            <Tooltip title="Xem chi tiết đơn">
              <Button
                shape="circle"
                icon={<Eye className="w-4 h-4" />}
                onClick={() => handleOpenDetails(record)}
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
          Không thể lấy danh sách đơn đăng ký từ máy chủ. Vui lòng kiểm tra kết nối.
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
          <h1 className="text-3xl tracking-tight">Quản lý đặt cọc & Đơn đăng ký thuê</h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi đơn đăng ký thuê phòng, duyệt nhận đặt cọc và quản lý tài chính phòng trọ
          </p>
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

          {/* Quick total statistic box */}
          <div className="rounded-2xl px-5 py-3 bg-gradient-to-br from-indigo-600 to-purple-600 text-white min-w-[200px] shadow-md">
            <div className="text-xs opacity-90">Tổng tiền cọc đang giữ</div>
            <div className="text-xl font-bold mt-0.5">
              {isLoading ? <Spin size="small" className="text-white" /> : formatVND(totalPaidAmount)}
            </div>
          </div>
        </div>
      </div>

      {/* Counter Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-slate-800">
                {isLoading ? <Spin size="small" /> : pendingCount}
              </div>
              <div className="text-sm text-muted-foreground">Chờ thanh toán</div>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-slate-800">
                {isLoading ? <Spin size="small" /> : paidCount}
              </div>
              <div className="text-sm text-muted-foreground">Đã nhận cọc</div>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-slate-800">
                {isLoading ? (
                  <Spin size="small" />
                ) : (
                  ordersList.filter((o) => o.status === "cancelled" || o.status === "refunded").length
                )}
              </div>
              <div className="text-sm text-muted-foreground">Đã hủy / Hoàn cọc</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter panel */}
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
                { value: "pending", label: "Chờ thanh toán" },
                { value: "paid", label: "Đã nhận cọc" },
                { value: "cancelled", label: "Đã hủy" },
                { value: "refunded", label: "Đã hoàn cọc" },
              ]}
              dropdownStyle={{ borderRadius: "8px" }}
            />
          </div>

          <div className="w-full md:w-80">
            <Input.Search
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Tìm theo mã đơn, khách hàng, phòng..."
              className="rounded-full"
              allowClear
            />
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white border border-border overflow-hidden shadow-sm mt-3">
        <Table
          dataSource={filteredOrders}
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
                  <span className="text-muted-foreground">Không tìm thấy đơn đăng ký nào</span>
                }
              />
            ),
          }}
        />
      </div>

      {/* Payment confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-emerald-600 font-semibold">
            <DollarSign className="w-5 h-5" />
            <span>Xác nhận thanh toán đặt cọc</span>
          </div>
        }
        visible={paymentModalOpen}
        onCancel={() => {
          setPaymentModalOpen(false);
          setSelectedOrder(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setPaymentModalOpen(false);
              setSelectedOrder(null);
            }}
            className="rounded-full"
          >
            Hủy bỏ
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="bg-emerald-600 hover:bg-emerald-700 border-0 rounded-full"
            loading={updateOrderMutation.isPending}
            onClick={() => form.submit()}
          >
            Duyệt & Nhận cọc
          </Button>,
        ]}
        width={450}
      >
        {selectedOrder && (
          <div className="space-y-4 py-2">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Mã đơn hàng:</span>
                <span className="font-semibold text-slate-800">#ORD-{selectedOrder.id}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Khách hàng:</span>
                <span className="font-semibold text-slate-800">{selectedOrder.user?.full_name}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Số tiền đặt cọc:</span>
                <span className="font-bold text-slate-950 text-indigo-600">
                  {formatVND(selectedOrder.amount)}
                </span>
              </div>
            </div>

            <Form form={form} layout="vertical" onFinish={handleConfirmPayment}>
              <Form.Item
                name="payment_method"
                label="Phương thức thanh toán"
                rules={[{ required: true, message: "Vui lòng chọn phương thức!" }]}
              >
                <Select
                  options={[
                    { value: "bank_transfer", label: "Chuyển khoản ngân hàng" },
                    { value: "cash", label: "Tiền mặt" },
                    { value: "momo", label: "Ví MOMO" },
                    { value: "vnpay", label: "VNPay" },
                  ]}
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="payment_ref"
                label="Mã giao dịch / Mã tham chiếu"
                tooltip="Mã biên lai, mã chuyển khoản ngân hàng hoặc số chứng từ tiền mặt nếu có."
              >
                <Input placeholder="Nhập mã giao dịch để dễ đối chiếu..." className="rounded-lg" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* Details modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-indigo-600 font-semibold">
            <FileText className="w-5 h-5" />
            <span>Chi tiết đơn đăng ký thuê phòng</span>
          </div>
        }
        visible={detailsModalOpen}
        onCancel={() => {
          setDetailsModalOpen(false);
          setDetailsOrder(null);
        }}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setDetailsModalOpen(false);
              setDetailsOrder(null);
            }}
            className="rounded-full"
          >
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {detailsOrder && (
          <div className="space-y-6 py-2">
            <Descriptions bordered column={1} size="small" className="rounded-xl overflow-hidden">
              <Descriptions.Item label="Mã đơn hàng">
                <span className="font-mono font-semibold text-indigo-600">#ORD-{detailsOrder.id}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">
                <div>
                  <div className="font-semibold">{detailsOrder.user?.full_name}</div>
                  <div className="text-xs text-slate-500">{detailsOrder.user?.email}</div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Phòng đăng ký">
                <div>
                  <div className="font-semibold">{detailsOrder.room?.title}</div>
                  <div className="text-xs text-slate-500">
                    {[detailsOrder.room?.district, detailsOrder.room?.city].filter(Boolean).join(", ")}
                  </div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền cọc giữ phòng">
                <span className="font-bold text-slate-800">{formatVND(detailsOrder.amount)}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái đơn">
                <Tag className={STATUS_MAP[detailsOrder.status]?.className}>
                  {STATUS_MAP[detailsOrder.status]?.label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đăng ký">
                <span className="flex items-center gap-1.5 text-xs text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {detailsOrder.created_at
                    ? new Date(detailsOrder.created_at).toLocaleString("vi-VN")
                    : "---"}
                </span>
              </Descriptions.Item>
            </Descriptions>

            {detailsOrder.payments && detailsOrder.payments.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  Lịch sử thanh toán giao dịch
                </h4>
                <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50">
                  {detailsOrder.payments.map((p, index) => (
                    <div
                      key={p.id}
                      className={`p-3 text-xs flex justify-between items-center ${index > 0 ? "border-t border-slate-100" : ""
                        }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-800">
                          {p.provider ? PAYMENT_METHODS[p.provider] || p.provider : "Tiền mặt"}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Mã GD: {p.transaction_id || "Không có"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-800">{formatVND(p.amount)}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {p.paid_at ? new Date(p.paid_at).toLocaleString("vi-VN") : "---"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Deposits;
