import { useState } from "react";
import { Edit3, Plus, Trash2, Loader2, FileText, Globe, Eye } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Popconfirm, Dropdown, Tag, Button, Input, Select, Pagination } from "antd";
import type { MenuProps } from "antd";
import { toast } from "sonner";
import {
  useBlogPosts,
  useCreateBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
} from "../../../hook/useBlog";
import type { BlogPost } from "../../../interface/blog.interface";

interface BlogPostForm {
  title: string;
  content: string;
  thumbnail_url: string;
  status: "draft" | "published";
}

export function BlogManage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  // React-hook-form
  const { control, handleSubmit, reset } = useForm<BlogPostForm>();

  // React Query Hooks
  const { data: response, isLoading, isError, error } = useBlogPosts(page);
  const { mutate: createBlogPost, isPending: isCreating } = useCreateBlogPost();
  const { mutate: updateBlogPost, isPending: isUpdating } = useUpdateBlogPost();
  const { mutate: deleteBlogPost } = useDeleteBlogPost();

  const posts = response?.data || [];
  const totalPages = response?.last_page || 1;

  const openAddModal = () => {
    setEditingPostId(null);
    reset({
      title: "",
      content: "",
      thumbnail_url: "",
      status: "published",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPostId(post.id);
    reset({
      title: post.title,
      content: post.content,
      thumbnail_url: post.thumbnail_url || "",
      status: post.status,
    });
    setIsModalOpen(true);
  };

  const handleChangeStatus = (post: BlogPost, newStatus: "published" | "draft") => {
    updateBlogPost(
      {
        id: post.id,
        data: { status: newStatus },
      },
      {
        onSuccess: () => {
          toast.success("Cập nhật trạng thái bài viết thành công");
        },
        onError: (err: any) => {
          const msg = err.response?.data?.message || "Cập nhật trạng thái thất bại";
          toast.error(msg);
        },
      }
    );
  };

  const onSubmit = (formData: BlogPostForm) => {
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Vui lòng nhập nội dung bài viết");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      thumbnail_url: formData.thumbnail_url.trim() || undefined,
      status: formData.status,
    };

    if (editingPostId !== null) {
      updateBlogPost(
        { id: editingPostId, data: payload },
        {
          onSuccess: (res) => {
            toast.success(res.message || "Cập nhật bài viết thành công");
            setIsModalOpen(false);
          },
          onError: (err: any) => {
            const msg = err.response?.data?.message || "Cập nhật bài viết thất bại";
            toast.error(msg);
          },
        }
      );
    } else {
      createBlogPost(payload, {
        onSuccess: (res) => {
          toast.success(res.message || "Tạo bài viết thành công");
          setIsModalOpen(false);
        },
        onError: (err: any) => {
          const msg = err.response?.data?.message || "Tạo bài viết thất bại";
          toast.error(msg);
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    deleteBlogPost(id, {
      onSuccess: (res) => {
        toast.success(res.message || "Xóa bài viết thành công");
      },
      onError: (err: any) => {
        const msg = err.response?.data?.message || "Xóa bài viết thất bại";
        toast.error(msg);
      },
    });
  };

  const renderStatusDropdown = (post: BlogPost) => {
    const statusItems: MenuProps["items"] = [
      {
        key: "published",
        label: "Xuất bản",
        icon: <Globe className="w-3.5 h-3.5" />,
      },
      {
        key: "draft",
        label: "Bản nháp",
        icon: <Eye className="w-3.5 h-3.5" />,
      },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
      handleChangeStatus(post, key as "published" | "draft");
    };

    return (
      <Dropdown menu={{ items: statusItems, onClick: handleMenuClick }} trigger={["click"]}>
        <span className="cursor-pointer select-none">
          {post.status === "published" ? (
            <Tag
              icon={<Globe className="w-3.5 h-3.5" />}
              className="!inline-flex !items-center gap-1 shadow-sm border-0 bg-emerald-50 text-emerald-700 font-medium !py-2 !px-3 rounded-full whitespace-nowrap"
            >
              Đã xuất bản
            </Tag>
          ) : (
            <Tag
              icon={<Eye className="w-3.5 h-3.5" />}
              className="!inline-flex !items-center gap-1 shadow-sm border-0 bg-slate-100 text-slate-700 font-medium !py-2 !px-3 rounded-full whitespace-nowrap"
            >
              Bản nháp
            </Tag>
          )}
        </span>
      </Dropdown>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-border">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-muted-foreground text-sm mt-3">Đang tải danh sách bài viết...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-border text-rose-600">
        Có lỗi xảy ra khi tải dữ liệu: {(error as any)?.message || "Lỗi không xác định"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Quản lý blog</h1>
          <p className="text-muted-foreground mt-1">Tạo, chỉnh sửa và xuất bản bài viết</p>
        </div>
        <Button
          type="primary"
          onClick={openAddModal}
          icon={<Plus className="w-4 h-4" />}
          className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/25 border-0 hover:opacity-90"
          style={{ background: "linear-gradient(to right, #4f46e5, #9333ea)" }}
          size="large"
        >
          Bài viết mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((b) => (
          <div key={b.id} className="rounded-2xl bg-white border border-border overflow-hidden flex flex-col transition-shadow">
            <div className="relative aspect-[16/10] bg-slate-100 flex items-center justify-center overflow-hidden border-b border-border">
              {b.thumbnail_url ? (
                <img
                  src={b.thumbnail_url}
                  alt={b.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FileText className="w-12 h-12 text-slate-300" />
              )}
              <div className="absolute top-3 right-3">
                {renderStatusDropdown(b)}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="line-clamp-2 text-slate-800 font-semibold leading-snug" title={b.title}>
                  {b.title}
                </h3>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="font-medium text-slate-600">{b.author?.full_name || "Admin"}</span>
                  <span>•</span>
                  <span>{new Date(b.created_at).toLocaleDateString("vi-VN")}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-50">
                <Button
                  size="middle"
                  onClick={() => openEditModal(b)}
                  icon={<Edit3 className="w-3.5 h-3.5" />}
                  className="rounded-full flex-1"
                >
                  Sửa
                </Button>
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa bài viết này?"
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => handleDelete(b.id)}
                >
                  <Button
                    size="middle"
                    danger
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    className="rounded-full"
                  />
                </Popconfirm>
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-border">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-slate-800">Không có bài viết nào</h3>
            <p className="text-muted-foreground text-sm mt-1">Bắt đầu bằng cách tạo bài viết mới đầu tiên của bạn.</p>
            <Button
              type="primary"
              onClick={openAddModal}
              icon={<Plus className="w-4 h-4" />}
              className="mt-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 border-0"
              style={{ background: "linear-gradient(to right, #4f46e5, #9333ea)" }}
            >
              Bài viết mới
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          current={page}
          total={response?.total || 0}
          pageSize={response?.per_page || 10}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
          className="flex justify-center mt-6"
        />
      )}

      {/* Add / Edit Modal */}
      <Modal
        title={
          <span className="text-lg font-semibold text-slate-800">
            {editingPostId !== null ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
        className="rounded-2xl overflow-hidden"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-600">Tiêu đề bài viết <span className="text-rose-500">*</span></span>
            <Controller
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Nhập tiêu đề..."
                  size="large"
                  className="rounded-xl"
                />
              )}
            />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-600">Đường dẫn ảnh bìa (URL)</span>
            <Controller
              name="thumbnail_url"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="https://example.com/image.jpg..."
                  size="large"
                  className="rounded-xl"
                />
              )}
            />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-600">Trạng thái xuất bản</span>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  size="large"
                  className="w-full rounded-xl"
                  options={[
                    { value: "published", label: "Xuất bản (Published)" },
                    { value: "draft", label: "Bản nháp (Draft)" },
                  ]}
                />
              )}
            />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-600">Nội dung bài viết <span className="text-rose-500">*</span></span>
            <Controller
              name="content"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  placeholder="Nhập nội dung bài viết chi tiết..."
                  rows={6}
                  className="rounded-xl resize-none"
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="default"
              onClick={() => setIsModalOpen(false)}
              className="rounded-full min-w-[90px]"
              size="large"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
              className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 min-w-[120px] border-0 hover:opacity-90"
              style={{ background: "linear-gradient(to right, #4f46e5, #9333ea)" }}
              size="large"
            >
              {editingPostId !== null ? "Lưu thay đổi" : "Tạo bài viết"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default BlogManage;
