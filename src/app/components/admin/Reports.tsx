import { useState } from "react";
import { Flag, AlertTriangle, CheckCircle2, Clock, Eye, EyeOff, Trash2 } from "lucide-react";
import { Table, Tag, Button, Popconfirm, Dropdown, Space, Empty } from "antd";
import type { MenuProps, TableColumnsType } from "antd";
import { toast } from "sonner";
import { REPORTS } from "../../data/mock";

type ReportStatus = "pending" | "reviewing" | "resolved";

interface Report {
  id: string;
  room: string;
  reporter: string;
  reason: string;
  date: string;
  status: ReportStatus;
}

const STATUS_MAP: Record<ReportStatus, { label: string; color: string; className: string }> = {
  pending: {
    label: "Chờ xử lý",
    color: "warning",
    className: "bg-amber-50 text-amber-700 border-0 font-medium rounded-full !inline-flex !items-center gap-1 whitespace-nowrap !py-1 !px-2.5",
  },
  reviewing: {
    label: "Đang xem xét",
    color: "processing",
    className: "bg-blue-50 text-blue-700 border-0 font-medium rounded-full !inline-flex !items-center gap-1 whitespace-nowrap !py-1 !px-2.5",
  },
  resolved: {
    label: "Đã giải quyết",
    color: "success",
    className: "bg-emerald-50 text-emerald-700 border-0 font-medium rounded-full !inline-flex !items-center gap-1 whitespace-nowrap !py-1 !px-2.5",
  },
};

const STATUS_ICON: Record<ReportStatus, React.ReactNode> = {
  pending: <Clock className="w-3.5 h-3.5" />,
  reviewing: <Eye className="w-3.5 h-3.5" />,
  resolved: <CheckCircle2 className="w-3.5 h-3.5" />,
};

export function Reports() {
  const [reports, setReports] = useState<Report[]>(REPORTS as Report[]);

  const handleChangeStatus = (id: string, newStatus: ReportStatus) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    const statusLabel = STATUS_MAP[newStatus].label;
    toast.success(`Đã cập nhật trạng thái thành "${statusLabel}"`);
  };

  const handleHidePost = (id: string) => {
    toast.success("Đã ẩn tin đăng vi phạm");
    handleChangeStatus(id, "resolved");
  };

  const handleDeletePost = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast.success("Đã xóa báo cáo và tin đăng vi phạm");
  };

  const stats = [
    {
      label: "Chờ xử lý",
      value: reports.filter((r) => r.status === "pending").length,
      gradient: "from-amber-500 to-orange-500",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      label: "Đang xem xét",
      value: reports.filter((r) => r.status === "reviewing").length,
      gradient: "from-blue-500 to-indigo-500",
      icon: <Eye className="w-5 h-5" />,
    },
    {
      label: "Đã giải quyết",
      value: reports.filter((r) => r.status === "resolved").length,
      gradient: "from-emerald-500 to-teal-500",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
  ];

  const columns: TableColumnsType<Report> = [
    {
      title: "Phòng bị báo cáo",
      dataIndex: "room",
      key: "room",
      render: (text: string) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Flag className="w-4 h-4" />
          </div>
          <span className="font-medium text-slate-800">{text}</span>
        </div>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      render: (text: string) => (
        <span className="text-slate-600 italic">"{text}"</span>
      ),
    },
    {
      title: "Người báo cáo",
      dataIndex: "reporter",
      key: "reporter",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (text: string) => <span className="text-muted-foreground">{text}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: ReportStatus, record: Report) => {
        const statusInfo = STATUS_MAP[status];
        const statusIcon = STATUS_ICON[status];

        const menuItems: MenuProps["items"] = (
          Object.entries(STATUS_MAP) as [ReportStatus, typeof statusInfo][]
        ).map(([key, val]) => ({
          key,
          label: val.label,
          icon: STATUS_ICON[key as ReportStatus],
        }));

        const handleMenuClick = ({ key }: { key: string }) => {
          handleChangeStatus(record.id, key as ReportStatus);
        };

        return (
          <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={["click"]}>
            <span className="cursor-pointer select-none">
              <Tag icon={statusIcon} className={statusInfo.className}>
                {statusInfo.label}
              </Tag>
            </span>
          </Dropdown>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "right",
      render: (_: unknown, record: Report) => {
        if (record.status === "resolved") {
          return <span className="text-xs text-muted-foreground italic">Đã xử lý</span>;
        }
        return (
          <Space>
            <Button
              size="middle"
              icon={<EyeOff className="w-3.5 h-3.5" />}
              onClick={() => handleHidePost(record.id)}
              className="rounded-full"
            >
              Ẩn tin
            </Button>
            <Popconfirm
              title="Xóa báo cáo và tin đăng?"
              description="Hành động này không thể hoàn tác."
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDeletePost(record.id)}
            >
              <Button
                danger
                size="middle"
                icon={<Trash2 className="w-3.5 h-3.5" />}
                className="rounded-full"
              >
                Xóa tin
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl tracking-tight">Báo cáo vi phạm</h1>
        <p className="text-muted-foreground mt-1">
          Duyệt các báo cáo từ người dùng và xử lý vi phạm
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="p-5 rounded-2xl bg-white border border-border">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white`}
            >
              {s.icon}
            </div>
            <div className="text-3xl mt-3">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Reports Table */}
      <div className="rounded-2xl bg-white border border-border overflow-hidden">
        <Table
          dataSource={reports}
          columns={columns}
          rowKey="id"
          pagination={false}
          locale={{
            emptyText: (
              <Empty
                image={<AlertTriangle className="w-16 h-16 mx-auto text-muted-foreground opacity-40" />}
                description={
                  <span className="text-muted-foreground">Chưa có báo cáo vi phạm nào</span>
                }
              />
            ),
          }}
        />
      </div>
    </div>
  );
}

export default Reports;
