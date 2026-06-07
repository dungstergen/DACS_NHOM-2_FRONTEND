import { useState } from "react";
import { Plus, Trash2, Edit3, Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { toast } from "sonner";

interface Amenity {
  id: number;
  name: string;
}

export function AmenitiesManage() {
  const [amenities, setAmenities] = useState<Amenity[]>([
    { id: 1, name: "Wifi miễn phí" },
    { id: 2, name: "Máy lạnh" },
    { id: 3, name: "Máy giặt" },
    { id: 4, name: "Tủ lạnh" },
    { id: 5, name: "Bếp nấu ăn" },
    { id: 6, name: "Ban công" },
    { id: 7, name: "Bãi đỗ xe" },
    { id: 8, name: "Camera an ninh" },
  ]);

  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) {
      toast.error("Vui lòng nhập tên tiện ích");
      return;
    }
    const newId = amenities.length > 0 ? Math.max(...amenities.map(a => a.id)) + 1 : 1;
    setAmenities([...amenities, { id: newId, name: newName }]);
    setNewName("");
    setOpen(false);
    toast.success("Đã thêm tiện ích mới");
  };

  const handleStartEdit = (amenity: Amenity) => {
    setEditingId(amenity.id);
    setEditingName(amenity.name);
  };

  const handleSaveEdit = () => {
    if (!editingName.trim()) {
      toast.error("Tên tiện ích không được để trống");
      return;
    }
    setAmenities(amenities.map(a => a.id === editingId ? { ...a, name: editingName } : a));
    setEditingId(null);
    toast.success("Cập nhật tiện ích thành công");
  };

  const handleDelete = (id: number) => {
    setAmenities(amenities.filter(a => a.id !== id));
    toast.success("Đã xóa tiện ích");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">1. Quản lý tiện ích</h1>
          <p className="text-muted-foreground mt-1">Cấu hình danh sách tiện ích của phòng trọ trên hệ thống</p>
        </div>
        <Button onClick={() => setOpen(!open)} className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600">
          <Plus className="w-4 h-4 mr-1" /> Thêm tiện ích mới
        </Button>
      </div>

      {open && (
        <div className="rounded-2xl bg-white border border-border p-6 max-w-md">
          <h3 className="mb-4 text-lg font-medium">Thêm tiện ích mới</h3>
          <div className="space-y-4">
            <div>
              <Label>Tên tiện ích</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ví dụ: Thang máy, Máy sấy tóc..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600">Thêm mới</Button>
              <Button variant="outline" className="rounded-full" onClick={() => setOpen(false)}>Hủy</Button>
            </div>
          </div>
        </div>
      )}

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
            {amenities.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-mono">{a.id}</TableCell>
                <TableCell>
                  {editingId === a.id ? (
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="max-w-xs"
                    />
                  ) : (
                    <span>{a.name}</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {editingId === a.id ? (
                      <>
                        <Button onClick={handleSaveEdit} size="icon" variant="ghost" className="rounded-full text-emerald-600">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => setEditingId(null)} size="icon" variant="ghost" className="rounded-full text-rose-600">
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => handleStartEdit(a)} size="icon" variant="ghost" className="rounded-full">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => handleDelete(a.id)} size="icon" variant="ghost" className="rounded-full text-rose-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
export default AmenitiesManage;
