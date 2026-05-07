import { Search, Clock, User } from "lucide-react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { BLOG_POSTS } from "../../data/mock";

export function BlogPage() {
  const featured = BLOG_POSTS[0];
  const rest = BLOG_POSTS.slice(1);
  const categories = ["Tất cả", "Kinh nghiệm", "Decor", "Thị trường", "Pháp lý"];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="text-sm text-indigo-600 mb-2">Cẩm nang thuê phòng</div>
        <h1 className="text-4xl tracking-tight">Blog & Tin tức</h1>
        <p className="text-muted-foreground mt-3">Mọi điều bạn cần biết về việc thuê phòng, decor và pháp lý.</p>
        <div className="relative mt-6 max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-11 h-12 rounded-full bg-white" placeholder="Tìm bài viết..." />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map((c, i) => (
          <button
            key={c}
            className={`px-4 py-2 rounded-full text-sm border ${
              i === 0
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-border bg-white hover:border-indigo-500 hover:text-indigo-600"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Featured */}
      <article className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-3xl overflow-hidden border border-border bg-white mb-10 group cursor-pointer">
        <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
          <img src={featured.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <Badge className="self-start bg-pink-50 text-pink-700 hover:bg-pink-50 border-0">Bài viết nổi bật</Badge>
          <h2 className="text-3xl tracking-tight mt-4 group-hover:text-indigo-600 transition-colors">{featured.title}</h2>
          <p className="text-muted-foreground mt-3">{featured.excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-6">
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{featured.author}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featured.readTime}</span>
            <span>{featured.date}</span>
          </div>
        </div>
      </article>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rest.map((b) => (
          <article key={b.id} className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-border hover:shadow-xl transition-all">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={b.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">{b.category}</span>
                <span className="text-muted-foreground">{b.readTime}</span>
              </div>
              <h3 className="line-clamp-2 group-hover:text-indigo-600 transition-colors">{b.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{b.excerpt}</p>
              <div className="text-xs text-muted-foreground">{b.author} • {b.date}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
