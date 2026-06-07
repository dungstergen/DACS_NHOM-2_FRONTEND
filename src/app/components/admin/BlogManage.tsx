import { Edit3, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { BLOG_POSTS } from "../../data/mock";

export function BlogManage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl tracking-tight">Quản lý blog</h1>
          <p className="text-muted-foreground mt-1">Tạo, chỉnh sửa và xuất bản bài viết</p>
        </div>
        <Button className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"><Plus className="w-4 h-4 mr-1" /> Bài viết mới</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {BLOG_POSTS.map((b) => (
          <div key={b.id} className="rounded-2xl bg-white border border-border overflow-hidden">
            <img src={b.image} className="w-full aspect-[16/10] object-cover" />
            <div className="p-5 space-y-2">
              <Badge className="bg-indigo-50 text-indigo-700 border-0">{b.category}</Badge>
              <h3 className="line-clamp-2">{b.title}</h3>
              <div className="text-xs text-muted-foreground">{b.author} • {b.date}</div>
              <div className="flex gap-1 pt-2">
                <Button size="sm" variant="outline" className="rounded-full"><Edit3 className="w-3.5 h-3.5 mr-1" /> Sửa</Button>
                <Button size="sm" variant="outline" className="rounded-full text-rose-600"><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default BlogManage;
