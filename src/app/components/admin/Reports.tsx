import { Flag } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { REPORTS } from "../../data/mock";
import { toast } from "sonner";

export function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl tracking-tight">Báo cáo vi phạm</h1>
        <p className="text-muted-foreground mt-1">Duyệt các báo cáo từ người dùng và xử lý vi phạm</p>
      </div>
      <div className="space-y-3">
        {REPORTS.map((r) => (
          <div key={r.id} className="rounded-2xl bg-white border border-border p-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><Flag className="w-5 h-5" /></div>
              <div>
                <div>{r.room}</div>
                <div className="text-sm text-muted-foreground mt-0.5">"{r.reason}"</div>
                <div className="text-xs text-muted-foreground mt-1">Bởi {r.reporter} • {r.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={
                r.status === "pending" ? "bg-amber-50 text-amber-700 border-0" :
                r.status === "reviewing" ? "bg-blue-50 text-blue-700 border-0" :
                "bg-emerald-50 text-emerald-700 border-0"
              }>
                {r.status === "pending" ? "Chờ xử lý" : r.status === "reviewing" ? "Đang xem" : "Đã giải quyết"}
              </Badge>
              {r.status !== "resolved" && (
                <>
                  <Button onClick={() => toast.success("Đã ẩn tin đăng")} size="sm" variant="outline" className="rounded-full">Ẩn tin</Button>
                  <Button onClick={() => toast.success("Đã xóa tin đăng")} size="sm" className="rounded-full bg-rose-600 hover:bg-rose-700">Xóa tin</Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Reports;
