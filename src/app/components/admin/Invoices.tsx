import { useState, useMemo } from "react";
import {
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  RefreshCw,
  Printer,
  FileText,
  User,
  Home,
  Zap,
  Droplet,
  Info,
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
  InputNumber,
  DatePicker,
  Form,
  Row,
  Col,
  Empty,
  Tag,
  Alert,
} from "antd";
import type { TableColumnsType } from "antd";
import { toast } from "sonner";
import { useBills, useCreateBill, useUpdateBillStatus } from "../../../hook/useBills";
import { useContracts } from "../../../hook/useContracts";
import { useBillingConfig } from "../../../hook/useBillingConfig";
import type { MonthlyBill, BillStatus } from "../../../interface/bill.interface";
import dayjs from "dayjs";

const formatVND = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export function Invoices() {
  const [form] = Form.useForm();

  // States for filters
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [monthFilter, setMonthFilter] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<MonthlyBill | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null);

  // Queries
  const {
    data: billsData,
    isLoading: isBillsLoading,
    refetch: refetchBills,
    isFetching: isBillsFetching,
  } = useBills({
    status: statusFilter,
    billing_month: monthFilter,
    page: currentPage,
  });

  const { data: contractsData, isLoading: isContractsLoading } = useContracts({
    status: "active",
  });

  const { data: billingConfig, isLoading: isConfigLoading } = useBillingConfig();

  // Mutations
  const createBillMutation = useCreateBill();
  const updateStatusMutation = useUpdateBillStatus();

  // Selected Contract computed value for form display
  const activeContracts = useMemo(() => {
    return contractsData?.data || [];
  }, [contractsData]);

  const selectedContract = useMemo(() => {
    if (!selectedContractId) return null;
    return activeContracts.find((c) => c.id === selectedContractId) || null;
  }, [selectedContractId, activeContracts]);

  // Totals calculations based on loaded items
  const stats = useMemo(() => {
    const list = billsData?.data || [];
    let totalRevenuePaid = 0;
    let totalUnpaidAmount = 0;
    let paidCount = 0;
    let unpaidCount = 0;

    list.forEach((bill) => {
      if (bill.status === "paid") {
        totalRevenuePaid += Number(bill.total_amount);
        paidCount++;
      } else {
        totalUnpaidAmount += Number(bill.total_amount);
        unpaidCount++;
      }
    });

    return {
      totalRevenuePaid,
      totalUnpaidAmount,
      paidCount,
      unpaidCount,
      totalCount: list.length,
    };
  }, [billsData]);

  // Handle Form change
  const handleContractChange = (value: number) => {
    setSelectedContractId(value);
  };

  // Submit new bill creation
  const handleCreateBillSubmit = async (values: any) => {
    try {
      const payload = {
        contract_id: values.contract_id,
        billing_month: values.billing_month.format("YYYY-MM"),
        electricity_old: values.electricity_old,
        electricity_new: values.electricity_new,
        water_old: values.water_old,
        water_new: values.water_new,
      };

      await createBillMutation.mutateAsync(payload);
      toast.success("Tạo hóa đơn tháng thành công!");
      setIsCreateOpen(false);
      form.resetFields();
      setSelectedContractId(null);
      refetchBills();
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Có lỗi xảy ra khi tạo hóa đơn";
      toast.error(errorMsg);
    }
  };

  // Toggle status (paid <-> unpaid)
  const handleToggleStatus = async (bill: MonthlyBill) => {
    try {
      const nextStatus: BillStatus = bill.status === "paid" ? "unpaid" : "paid";
      await updateStatusMutation.mutateAsync({
        id: bill.id,
        status: nextStatus,
      });
      toast.success(
        `Đã cập nhật trạng thái hóa đơn sang: ${nextStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"
        }`
      );
      refetchBills();
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Không thể cập nhật trạng thái";
      toast.error(errorMsg);
    }
  };

  const resetFilters = () => {
    setStatusFilter(undefined);
    setMonthFilter(undefined);
    setCurrentPage(1);
  };

  // Print function
  const handlePrint = () => {
    const printContent = document.getElementById("invoice-print-area");
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Hoa_don_thang_${selectedBill?.billing_month || ""}</title>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
              .header { text-align: center; margin-bottom: 30px; }
              .header h2 { margin: 0; color: #4f46e5; font-size: 24px; text-transform: uppercase; }
              .header p { margin: 5px 0 0; color: #64748b; font-size: 14px; }
              .info-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 30px; border-bottom: 2px dashed #e2e8f0; padding-bottom: 20px; }
              .info-item { font-size: 14px; }
              .info-item span { font-weight: bold; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
              th { background-color: #f8fafc; color: #475569; font-weight: 600; }
              .total-row { font-size: 18px; font-weight: bold; color: #4f46e5; }
              .total-row td { border-top: 2px solid #e2e8f0; border-bottom: none; }
              .footer { display: flex; justify-content: space-between; margin-top: 60px; font-size: 14px; }
              .footer-col { text-align: center; width: 45%; }
              .footer-col .signature { margin-top: 80px; font-style: italic; color: #94a3b8; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Define table columns
  const columns: TableColumnsType<MonthlyBill> = [
    {
      title: "Mã HĐ",
      dataIndex: "id",
      key: "id",
      width: 90,
      render: (id) => <span className="font-mono font-medium text-slate-500">#HĐ-{id}</span>,
    },
    {
      title: "Phòng / Người thuê",
      key: "room_tenant",
      render: (_, record) => {
        const roomTitle = record.contract?.room?.title || `Phòng #${record.contract?.room_id}`;
        const tenantName = record.contract?.user?.full_name || "Chưa cập nhật tên";
        const tenantEmail = record.contract?.user?.email;
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-indigo-500" /> {roomTitle}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <User className="w-3 h-3 text-slate-400" /> {tenantName} {tenantEmail && `(${tenantEmail})`}
            </span>
          </div>
        );
      },
    },
    {
      title: "Tháng",
      dataIndex: "billing_month",
      key: "billing_month",
      width: 100,
      render: (month) => (
        <span className="font-medium text-slate-600 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" /> {month}
        </span>
      ),
    },
    {
      title: "Điện (kWh)",
      key: "electricity",
      render: (_, record) => {
        const usage = record.electricity_new - record.electricity_old;
        return (
          <div className="text-xs text-slate-600">
            <div>Cũ: <span className="font-semibold">{record.electricity_old}</span></div>
            <div>Mới: <span className="font-semibold">{record.electricity_new}</span></div>
            <div className="text-amber-600 font-medium">Sử dụng: <strong>{usage}</strong> kWh</div>
          </div>
        );
      },
    },
    {
      title: "Nước (m³)",
      key: "water",
      render: (_, record) => {
        const usage = record.water_new - record.water_old;
        return (
          <div className="text-xs text-slate-600">
            <div>Cũ: <span className="font-semibold">{record.water_old}</span></div>
            <div>Mới: <span className="font-semibold">{record.water_new}</span></div>
            <div className="text-blue-600 font-medium">Sử dụng: <strong>{usage}</strong> m³</div>
          </div>
        );
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (total) => (
        <span className="font-bold text-indigo-600 text-[15px]">
          {formatVND(Number(total))}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: BillStatus) => {
        const isPaid = status === "paid";
        return (
          <Tag
            color={isPaid ? "success" : "warning"}
            className="px-2.5 py-0.5 rounded-full font-medium border-0 !inline-flex items-center gap-1"
          >
            {isPaid ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" /> Đã thu
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5" /> Chưa thu
              </>
            )}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 140,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết phiếu thu">
            <Button
              type="text"
              icon={<Eye className="w-4 h-4 text-indigo-600" />}
              onClick={() => {
                setSelectedBill(record);
                setIsDetailOpen(true);
              }}
              className="hover:bg-indigo-50 rounded-full flex items-center justify-center p-0 w-8 h-8"
            />
          </Tooltip>

          <Tooltip title={record.status === "paid" ? "Đổi sang Chưa thu" : "Xác nhận Đã thu tiền"}>
            <Popconfirm
              title={`Xác nhận hóa đơn này ${record.status === "paid" ? "chưa được thanh toán?" : "đã được thanh toán?"}`}
              onConfirm={() => handleToggleStatus(record)}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Button
                type="text"
                icon={
                  record.status === "paid" ? (
                    <XCircle className="w-4 h-4 text-amber-500" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )
                }
                className="hover:bg-slate-100 rounded-full flex items-center justify-center p-0 w-8 h-8"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800">Hóa đơn hàng tháng</h1>
          <p className="text-slate-500 mt-1">
            Ghi nhận số điện/nước và tự động tạo hóa đơn thanh toán cho người thuê hàng tháng.
          </p>
        </div>
        <Button
          onClick={() => {
            setIsCreateOpen(true);
            setSelectedContractId(null);
            form.resetFields();
          }}
          type="primary"
          className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-10 border-0 flex items-center gap-1.5 shadow-md font-medium"
        >
          <Plus className="w-4 h-4" /> Tạo hóa đơn mới
        </Button>
      </div>

      {/* Stats Cards Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng đã thu tiền</p>
                <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                  {formatVND(stats.totalRevenuePaid)}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Dựa trên {stats.paidCount} hóa đơn trang này
                </p>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-2xl">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng chưa thu tiền</p>
                <h3 className="text-2xl font-bold text-amber-600 mt-1">
                  {formatVND(stats.totalUnpaidAmount)}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Dựa trên {stats.unpaidCount} hóa đơn trang này
                </p>
              </div>
              <div className="p-3.5 bg-amber-50 rounded-2xl">
                <AlertCircle className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng số hóa đơn</p>
                <h3 className="text-2xl font-bold text-indigo-600 mt-1">
                  {stats.totalCount}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Tính theo danh sách hiện tại</p>
              </div>
              <div className="p-3.5 bg-indigo-50 rounded-2xl">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filter and Table Card */}
      <Card className="rounded-2xl border-slate-100 shadow-sm">
        {/* Filters bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500">Trạng thái</span>
              <Select
                placeholder="Tất cả trạng thái"
                allowClear
                value={statusFilter}
                onChange={(val) => {
                  setStatusFilter(val);
                  setCurrentPage(1);
                }}
                className="w-44"
                options={[
                  { value: "paid", label: "Đã thu tiền" },
                  { value: "unpaid", label: "Chưa thu tiền" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500">Tháng hóa đơn</span>
              <DatePicker
                picker="month"
                placeholder="Chọn tháng"
                value={monthFilter ? dayjs(monthFilter, "YYYY-MM") : null}
                onChange={(val) => {
                  setMonthFilter(val ? val.format("YYYY-MM") : undefined);
                  setCurrentPage(1);
                }}
                className="w-40"
              />
            </div>

            {(statusFilter || monthFilter) && (
              <Button
                onClick={resetFilters}
                className="rounded-full mt-5 flex items-center justify-center text-xs border-dashed text-slate-500 hover:text-indigo-600"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 mt-5">
            <Button
              type="text"
              onClick={() => refetchBills()}
              icon={<RefreshCw className={`w-4 h-4 text-slate-500 ${isBillsFetching ? "animate-spin" : ""}`} />}
              className="rounded-full flex items-center justify-center p-0 w-9 h-9"
            />
          </div>
        </div>

        {/* Table representation */}
        {isBillsLoading ? (
          <div className="py-20 text-center">
            <Spin tip="Đang tải danh sách hóa đơn..." size="large" />
          </div>
        ) : billsData?.data && billsData.data.length > 0 ? (
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={billsData.data}
              rowKey="id"
              pagination={{
                current: currentPage,
                total: billsData.total,
                pageSize: 10,
                onChange: (page) => setCurrentPage(page),
                showTotal: (total) => `Tổng cộng ${total} hóa đơn`,
              }}
              className="custom-table"
            />
          </div>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không tìm thấy hóa đơn tháng nào phù hợp bộ lọc."
          />
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-indigo-600">
            <FileText className="w-5 h-5" />
            <span>Chi Tiết Phiếu Thu Tiền Nhà</span>
          </div>
        }
        open={isDetailOpen}
        onCancel={() => {
          setIsDetailOpen(false);
          setSelectedBill(null);
        }}
        footer={[
          <Button key="close" className="rounded-full" onClick={() => setIsDetailOpen(false)}>
            Đóng
          </Button>,
          <Button
            key="print"
            type="primary"
            icon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
            className="rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1 border-0"
          >
            In hóa đơn
          </Button>,
        ]}
        width={650}
        className="rounded-2xl overflow-hidden"
      >
        {selectedBill && (
          <div className="py-4 px-2">
            <div id="invoice-print-area" className="bg-white rounded-lg p-3">
              {/* Receipt Title */}
              <div className="text-center border-b-2 border-slate-100 pb-5 mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-indigo-600 uppercase">
                  Phiếu Thu Tiền Nhà & Điện Nước
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  Mã hóa đơn: <span className="font-mono font-semibold">#HĐ-{selectedBill.id}</span> • Tháng: <span className="font-semibold">{selectedBill.billing_month}</span>
                </p>
              </div>

              {/* Grid Information */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm text-slate-600 mb-6 border-b-2 border-dashed border-slate-100 pb-5">
                <div>
                  <p className="text-xs text-slate-400">Khách hàng thuê phòng:</p>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {selectedBill.contract?.user?.full_name || "Chưa cập nhật tên"}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Email: {selectedBill.contract?.user?.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Phòng thuê trọ:</p>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {selectedBill.contract?.room?.title || `Phòng #${selectedBill.contract?.room_id}`}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Địa chỉ: {selectedBill.contract?.room?.address || "Chưa cập nhật địa chỉ"}
                  </p>
                </div>
              </div>

              {/* Bill Details Breakdown Table */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left font-semibold text-slate-500 pb-2">Hạng mục dịch vụ</th>
                    <th className="text-right font-semibold text-slate-500 pb-2">Chỉ số sử dụng / Chi tiết</th>
                    <th className="text-right font-semibold text-slate-500 pb-2">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Fixed Rent */}
                  <tr>
                    <td className="py-3 font-medium text-slate-800">Tiền phòng cố định</td>
                    <td className="py-3 text-right text-slate-500">Tháng cố định</td>
                    <td className="py-3 text-right font-medium text-slate-800">
                      {formatVND(selectedBill.room_rent)}
                    </td>
                  </tr>

                  {/* Electricity Usage */}
                  <tr>
                    <td className="py-3 font-medium text-slate-800">Tiền điện tiêu dùng</td>
                    <td className="py-3 text-right text-slate-500">
                      {selectedBill.electricity_new - selectedBill.electricity_old} kWh
                      <span className="text-xs text-slate-400 block mt-0.5">
                        (Mới: {selectedBill.electricity_new} - Cũ: {selectedBill.electricity_old})
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium text-slate-800">
                      {formatVND(selectedBill.electricity_cost)}
                    </td>
                  </tr>

                  {/* Water Usage */}
                  <tr>
                    <td className="py-3 font-medium text-slate-800">Tiền nước sinh hoạt</td>
                    <td className="py-3 text-right text-slate-500">
                      {selectedBill.water_new - selectedBill.water_old} m³
                      <span className="text-xs text-slate-400 block mt-0.5">
                        (Mới: {selectedBill.water_new} - Cũ: {selectedBill.water_old})
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium text-slate-800">
                      {formatVND(selectedBill.water_cost)}
                    </td>
                  </tr>

                  {/* Internet */}
                  <tr>
                    <td className="py-3 font-medium text-slate-800">Phí mạng Internet</td>
                    <td className="py-3 text-right text-slate-500">Trọn gói tháng</td>
                    <td className="py-3 text-right font-medium text-slate-800">
                      {formatVND(selectedBill.internet_cost)}
                    </td>
                  </tr>

                  {/* Trash */}
                  <tr>
                    <td className="py-3 font-medium text-slate-800">Phí vệ sinh & rác thải</td>
                    <td className="py-3 text-right text-slate-500">Trọn gói tháng</td>
                    <td className="py-3 text-right font-medium text-slate-800">
                      {formatVND(selectedBill.trash_cost)}
                    </td>
                  </tr>

                  {/* Parking */}
                  <tr>
                    <td className="py-3 font-medium text-slate-800">Phí dịch vụ gửi xe</td>
                    <td className="py-3 text-right text-slate-500">Trọn gói tháng</td>
                    <td className="py-3 text-right font-medium text-slate-800">
                      {formatVND(selectedBill.parking_cost)}
                    </td>
                  </tr>

                  {/* Total Amount Row */}
                  <tr className="font-semibold text-indigo-600 bg-indigo-50/30">
                    <td className="py-4 px-2 text-base">Tổng cộng thanh toán</td>
                    <td className="py-4 text-right text-xs text-slate-500">
                      (Đã bao gồm VAT & dịch vụ)
                    </td>
                    <td className="py-4 px-2 text-right text-lg font-bold text-indigo-600">
                      {formatVND(Number(selectedBill.total_amount))}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Footer Stamp Mockup */}
              <div className="flex justify-between items-center mt-8 pt-5 border-t border-slate-100">
                <div className="text-xs text-slate-400">
                  <p>Trạng thái hóa đơn:</p>
                  <p className={`text-sm font-semibold mt-1 ${selectedBill.status === "paid" ? "text-emerald-600" : "text-rose-500"}`}>
                    {selectedBill.status === "paid" ? "✓ ĐÃ THANH TOÁN" : "⚠ CHƯA THANH TOÁN"}
                  </p>
                </div>
                <div className="text-center w-48 text-xs text-slate-500">
                  <p>Ngày lập phiếu: {dayjs(selectedBill.created_at).format("DD/MM/YYYY")}</p>
                  <div className="mt-8 font-medium italic text-slate-400">Người lập phiếu ký tên</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Creation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-indigo-600">
            <Plus className="w-5 h-5" />
            <span>Lập Hóa Đơn Hàng Tháng Mới</span>
          </div>
        }
        open={isCreateOpen}
        onCancel={() => {
          setIsCreateOpen(false);
          setSelectedContractId(null);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Spin spinning={isContractsLoading || isConfigLoading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateBillSubmit}
            initialValues={{
              electricity_old: 0,
              water_old: 0,
            }}
            className="pt-4"
          >
            <Row gutter={[16, 16]}>
              {/* Contract selector */}
              <Col xs={24} md={16}>
                <Form.Item
                  name="contract_id"
                  label="Hợp đồng thuê phòng hoạt động"
                  rules={[{ required: true, message: "Vui lòng chọn hợp đồng thuê phòng!" }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn hợp đồng thuê phòng..."
                    optionFilterProp="children"
                    onChange={handleContractChange}
                    options={activeContracts.map((contract) => ({
                      value: contract.id,
                      label: `Phòng ${contract.room?.title || contract.room_id} - ${contract.user?.full_name || contract.user?.email || `KH #${contract.user_id}`
                        } (Mã HĐ: ${contract.id})`,
                    }))}
                  />
                </Form.Item>
              </Col>

              {/* Billing Month */}
              <Col xs={24} md={8}>
                <Form.Item
                  name="billing_month"
                  label="Tháng xuất hóa đơn"
                  rules={[{ required: true, message: "Vui lòng chọn tháng!" }]}
                >
                  <DatePicker picker="month" className="w-full" placeholder="Chọn tháng..." />
                </Form.Item>
              </Col>
            </Row>

            {/* Contract Fixed Info Widget */}
            {selectedContract && (
              <Alert
                message={
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-slate-700">Thông tin tiền phòng cố định từ hợp đồng:</p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>Tiền thuê mỗi tháng: <strong>{formatVND(selectedContract.monthly_rent)}</strong></div>
                      <div>Khách thuê: <strong>{selectedContract.user?.full_name} ({selectedContract.user?.email})</strong></div>
                    </div>
                  </div>
                }
                type="info"
                showIcon
                className="mb-4 rounded-xl"
              />
            )}

            {/* BillingConfig Price Display Widget */}
            {billingConfig && (
              <Alert
                message={
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-slate-700">Bảng giá dịch vụ hiện hành đang áp dụng:</p>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <div className="flex items-center gap-1 text-slate-600"><Zap className="w-3.5 h-3.5 text-amber-500" /> Điện: <strong>{formatVND(billingConfig.electricity_price)} / kWh</strong></div>
                      <div className="flex items-center gap-1 text-slate-600"><Droplet className="w-3.5 h-3.5 text-blue-500" /> Nước: <strong>{formatVND(billingConfig.water_price)} / m³</strong></div>
                      <div className="flex items-center gap-1 text-slate-600"><Info className="w-3.5 h-3.5 text-indigo-500" /> Internet: <strong>{formatVND(billingConfig.internet_price)} / tháng</strong></div>
                      <div className="flex items-center gap-1 text-slate-600"> Rác: <strong>{formatVND(billingConfig.trash_price)} / tháng</strong></div>
                      <div className="flex items-center gap-1 text-slate-600"> Xe: <strong>{formatVND(billingConfig.parking_price)} / xe / tháng</strong></div>
                    </div>
                  </div>
                }
                type="warning"
                showIcon
                className="mb-4 rounded-xl border-amber-100 bg-amber-50/40"
              />
            )}

            <div className="bg-slate-50 p-4 rounded-2xl mb-4 space-y-4 border border-slate-100">
              <h4 className="font-semibold text-slate-700 text-sm flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> Chỉ số điện tiêu thụ
              </h4>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="electricity_old"
                    label="Chỉ số điện cũ (kWh)"
                    rules={[{ required: true, message: "Vui lòng điền số điện cũ!" }]}
                  >
                    <InputNumber min={0} className="w-full" placeholder="0" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="electricity_new"
                    label="Chỉ số điện mới (kWh)"
                    dependencies={["electricity_old"]}
                    rules={[
                      { required: true, message: "Vui lòng điền số điện mới!" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("electricity_old") <= value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("Số điện mới phải lớn hơn hoặc bằng số điện cũ!"));
                        },
                      }),
                    ]}
                  >
                    <InputNumber min={0} className="w-full" placeholder="0" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl mb-6 space-y-4 border border-slate-100">
              <h4 className="font-semibold text-slate-700 text-sm flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-blue-500" /> Chỉ số nước tiêu thụ
              </h4>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="water_old"
                    label="Chỉ số nước cũ (m³)"
                    rules={[{ required: true, message: "Vui lòng điền số nước cũ!" }]}
                  >
                    <InputNumber min={0} className="w-full" placeholder="0" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="water_new"
                    label="Chỉ số nước mới (m³)"
                    dependencies={["water_old"]}
                    rules={[
                      { required: true, message: "Vui lòng điền số nước mới!" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("water_old") <= value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("Số nước mới phải lớn hơn hoặc bằng số nước cũ!"));
                        },
                      }),
                    ]}
                  >
                    <InputNumber min={0} className="w-full" placeholder="0" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button
                className="rounded-full"
                onClick={() => {
                  setIsCreateOpen(false);
                  setSelectedContractId(null);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createBillMutation.isPending}
                className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 border-0 flex items-center gap-1"
              >
                Lập & xuất hóa đơn
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}

export default Invoices;
