import { useState } from "react";
import { Plus, Trash2, Edit3 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button, Input, Table, Modal, Popconfirm, Space } from "antd";
import type { TableColumnsType } from "antd";
import { toast } from "sonner";
import { 
  useAmenities, 
  useCreateAmenity, 
  useUpdateAmenity, 
  useDeleteAmenity 
} from "../../../hook/useAmenities";
import type { Amenity } from "../../../interface/amenity.interface";

interface AddAmenityForm {
  newName: string;
}

interface EditAmenityForm {
  editingName: string;
}

export function AmenitiesManage() {
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // React-hook-form
  const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd } = useForm<AddAmenityForm>({
    defaultValues: { newName: "" },
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit } = useForm<EditAmenityForm>({
    defaultValues: { editingName: "" },
  });

  // React Query Hooks
  const { data, isLoading } = useAmenities(page);
  const { mutate: createAmenity, isPending: isCreating } = useCreateAmenity();
  const { mutate: updateAmenity, isPending: isUpdating } = useUpdateAmenity();
  const { mutate: deleteAmenity } = useDeleteAmenity();

  const amenities = data?.data || [];
  const meta = data?.meta;

  const onAddSubmit = (formData: AddAmenityForm) => {
    if (!formData.newName.trim()) {
      toast.error("Vui lòng nhập tên tiện ích");
      return;
    }
    createAmenity(formData.newName.trim(), {
      onSuccess: () => {
        resetAdd({ newName: "" });
        setIsAddModalOpen(false);
        toast.success("Đã thêm tiện ích mới");
      },
      onError: (err: any) => {
        const message = err.response?.data?.message || "Thêm tiện ích thất bại";
        toast.error(message);
      }
    });
  };

  const handleStartEdit = (amenity: Amenity) => {
    setEditingId(amenity.id);
    resetEdit({ editingName: amenity.name });
    setIsEditModalOpen(true);
  };

  const onEditSubmit = (formData: EditAmenityForm) => {
    if (!formData.editingName.trim()) {
      toast.error("Tên tiện ích không được để trống");
      return;
    }
    if (editingId === null) return;

    updateAmenity(
      { id: editingId, name: formData.editingName.trim() },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setEditingId(null);
          resetEdit({ editingName: "" });
          toast.success("Cập nhật tiện ích thành công");
        },
        onError: (err: any) => {
          const message = err.response?.data?.message || "Cập nhật tiện ích thất bại";
          toast.error(message);
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteAmenity(id, {
      onSuccess: () => {
        toast.success("Đã xóa tiện ích");
      },
      onError: (err: any) => {
        const message = err.response?.data?.message || "Xóa tiện ích thất bại";
        toast.error(message);
      }
    });
  };

  // Antd Table columns
  const columns: TableColumnsType<Amenity> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id) => <span className="font-mono font-medium text-slate-500">#{id}</span>,
    },
    {
      title: "Tên tiện ích",
      dataIndex: "name",
      key: "name",
      render: (name) => <span className="font-semibold text-slate-700">{name}</span>,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      align: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<Edit3 className="w-4 h-4 text-indigo-600" />}
            onClick={() => handleStartEdit(record)}
            className="hover:bg-indigo-50 rounded-full flex items-center justify-center p-0 w-8 h-8"
          />
          <Popconfirm
            title="Xóa tiện ích"
            description="Bạn có chắc chắn muốn xóa tiện ích này?"
            onConfirm={() => handleDelete(record.id)}
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800">Quản lý tiện ích</h1>
          <p className="text-slate-500 mt-1">Cấu hình danh sách tiện ích của phòng trọ trên hệ thống</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          type="primary"
          className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-10 border-0 flex items-center gap-1.5 shadow-md font-medium"
        >
          <Plus className="w-4 h-4" /> Thêm tiện ích mới
        </Button>
      </div>

      {/* Add Amenity Modal */}
      <Modal
        title={<span className="text-lg font-semibold text-slate-800">Thêm tiện ích mới</span>}
        open={isAddModalOpen}
        onOk={handleSubmitAdd(onAddSubmit)}
        onCancel={() => {
          resetAdd({ newName: "" });
          setIsAddModalOpen(false);
        }}
        confirmLoading={isCreating}
        okText="Thêm mới"
        cancelText="Hủy"
        okButtonProps={{ className: "rounded-full" }}
        cancelButtonProps={{ className: "rounded-full" }}
      >
        <div className="py-4 space-y-2">
          <label className="text-sm font-semibold text-slate-600">Tên tiện ích</label>
          <Input
            placeholder="Ví dụ: Thang máy, Máy sấy tóc..."
            disabled={isCreating}
            {...registerAdd("newName")}
            className="rounded-lg h-10"
          />
        </div>
      </Modal>

      {/* Edit Amenity Modal */}
      <Modal
        title={<span className="text-lg font-semibold text-slate-800">Cập nhật tiện ích</span>}
        open={isEditModalOpen}
        onOk={handleSubmitEdit(onEditSubmit)}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingId(null);
          resetEdit({ editingName: "" });
        }}
        confirmLoading={isUpdating}
        okText="Cập nhật"
        cancelText="Hủy"
        okButtonProps={{ className: "rounded-full" }}
        cancelButtonProps={{ className: "rounded-full" }}
      >
        <div className="py-4 space-y-2">
          <label className="text-sm font-semibold text-slate-600">Tên tiện ích</label>
          <Input
            placeholder="Tên tiện ích..."
            disabled={isUpdating}
            {...registerEdit("editingName")}
            className="rounded-lg h-10"
          />
        </div>
      </Modal>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={amenities}
          rowKey="id"
          loading={isLoading}
          pagination={
            meta && meta.last_page > 1
              ? {
                  current: page,
                  total: meta.total,
                  pageSize: meta.per_page,
                  onChange: (p) => setPage(p),
                  showTotal: (total) => `Hiển thị từ ${meta.from || 0} - ${meta.to || 0} trong tổng số ${total} tiện ích`,
                }
              : false
          }
          className="custom-table"
        />
      </div>
    </div>
  );
}

export default AmenitiesManage;
