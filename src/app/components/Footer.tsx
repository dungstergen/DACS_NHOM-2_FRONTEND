import { Home, Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-white">Rental</span>
          </div>
          <p className="text-sm mt-4 text-slate-400">Nền tảng cho thuê phòng trọ minh bạch & an toàn hàng đầu Việt Nam.</p>
          <div className="flex gap-2 mt-5">
            {[Facebook, Instagram, Youtube].map((I, i) => (
              <button key={i} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center">
                <I className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
        {[
          { t: "Khám phá", links: ["Tìm phòng", "Phòng nổi bật", "Khu vực hot", "Blog"] },
          { t: "Hỗ trợ", links: ["Trung tâm trợ giúp", "Hợp đồng mẫu", "Chính sách hủy", "Báo cáo vi phạm"] },
          { t: "Công ty", links: ["Về chúng tôi", "Tuyển dụng", "Liên hệ", "Điều khoản"] },
        ].map((c) => (
          <div key={c.t}>
            <div className="text-white mb-3">{c.t}</div>
            <ul className="space-y-2 text-sm">
              {c.links.map((l) => <li key={l}><a className="hover:text-white">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-slate-500">© 2026 Rental. All rights reserved.</div>
    </footer>
  );
}
