import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useBillingConfig, useUpdateBillingConfig } from "../../../hook/useBillingConfig";

interface SystemCostsForm {
  electricity_price: number;
  water_price: number;
  internet_price: number;
  trash_price: number;
  parking_price: number;
}

export function SystemCosts() {
  const { register, handleSubmit, reset } = useForm<SystemCostsForm>({
    defaultValues: {
      electricity_price: 0,
      water_price: 0,
      internet_price: 0,
      trash_price: 0,
      parking_price: 0,
    },
  });

  // React Query Hooks
  const { data: config, isLoading, isError, error } = useBillingConfig();
  const { mutate: updateConfig, isPending: isUpdating } = useUpdateBillingConfig();

  useEffect(() => {
    if (config) {
      reset({
        electricity_price: Number(config.electricity_price),
        water_price: Number(config.water_price),
        internet_price: Number(config.internet_price),
        trash_price: Number(config.trash_price),
        parking_price: Number(config.parking_price),
      });
    }
  }, [config, reset]);

  const onSubmit = (formData: SystemCostsForm) => {
    if (
      formData.electricity_price < 0 ||
      formData.water_price < 0 ||
      formData.internet_price < 0 ||
      formData.trash_price < 0 ||
      formData.parking_price < 0
    ) {
      toast.error("Các chi phí cấu hình phải lớn hơn hoặc bằng 0");
      return;
    }

    updateConfig(formData, {
      onSuccess: (res) => {
        toast.success(res.message || "Cập nhật cấu hình chi phí thành công");
      },
      onError: (err: any) => {
        const msg = err.response?.data?.message || "Cập nhật chi phí thất bại";
        toast.error(msg);
      },
    });
  };

  const items = [
    {
      key: "electricity_price",
      label: "Điện",
      unit: "đ/kWh",
      icon: "⚡",
    },
    {
      key: "water_price",
      label: "Nước",
      unit: "đ/m³",
      icon: "💧",
    },
    {
      key: "internet_price",
      label: "Internet",
      unit: "đ/tháng",
      icon: "📶",
    },
    {
      key: "trash_price",
      label: "Phí rác",
      unit: "đ/tháng",
      icon: "🗑️",
    },
    {
      key: "parking_price",
      label: "Gửi xe máy",
      unit: "đ/xe/tháng",
      icon: "🛵",
    },
  ] as const;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-border">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-muted-foreground text-sm mt-3">Đang tải cấu hình chi phí...</p>
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Chi phí hệ thống</h1>
          <p className="text-muted-foreground mt-1">Cấu hình giá điện, nước và các chi phí dịch vụ áp dụng cho toàn hệ thống</p>
        </div>
        <Button
          type="submit"
          disabled={isUpdating}
          className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 min-w-[140px]"
        >
          {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Lưu thay đổi
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.key} className="rounded-2xl bg-white border border-border p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-2xl">
                  {it.icon}
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{it.label}</div>
                  <div className="text-xs text-muted-foreground">{it.unit}</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Input
                type="number"
                {...register(it.key, { valueAsNumber: true })}
                className="text-lg rounded-xl"
              />
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}

export default SystemCosts;
