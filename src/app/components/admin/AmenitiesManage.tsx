import { useState } from "react";
import { Plus, Trash2, Edit3, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { toast } from "sonner";
import { Modal, Popconfirm } from "antd";
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
  const { data, isLoading, isError, error } = useAmenities(page);
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

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">1. Quản lý tiện ích</h1>
          <p className="text-muted-foreground mt-1">Cấu hình danh sách tiện ích của phòng trọ trên hệ thống</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600">
          <Plus className="w-4 h-4 mr-1" /> Thêm tiện ích mới
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
      >
        <div className="py-4 space-y-2">
          <Label htmlFor="new-amenity-name">Tên tiện ích</Label>
          <Input
            id="new-amenity-name"
            placeholder="Ví dụ: Thang máy, Máy sấy tóc..."
            disabled={isCreating}
            {...registerAdd("newName")}
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
      >
        <div className="py-4 space-y-2">
          <Label htmlFor="edit-amenity-name">Tên tiện ích</Label>
          <Input
            id="edit-amenity-name"
            placeholder="Tên tiện ích..."
            disabled={isUpdating}
            {...registerEdit("editingName")}
          />
        </div>
      </Modal>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-border">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-muted-foreground text-sm mt-3">Đang tải danh sách tiện ích...</p>
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
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Tên tiện ích</TableHead>
                <TableHead className="text-right w-40">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {amenities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center p-6 text-muted-foreground">
                    Chưa có tiện ích nào được tạo.
                  </TableCell>
                </TableRow>
              ) : (
                amenities.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono">{a.id}</TableCell>
                    <TableCell>
                      <span>{a.name}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button onClick={() => handleStartEdit(a)} size="icon" variant="ghost" className="rounded-full">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Popconfirm
                          title="Xóa tiện ích"
                          description="Bạn có chắc chắn muốn xóa tiện ích này?"
                          onConfirm={() => handleDelete(a.id)}
                          okText="Có"
                          cancelText="Không"
                          okButtonProps={{ danger: true }}
                        >
                          <span className="inline-block">
                            <Button size="icon" variant="ghost" className="rounded-full text-rose-600">
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
                Hiển thị {meta.from || 0} - {meta.to || 0} trong tổng số {meta.total} tiện ích
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

export default AmenitiesManage;
