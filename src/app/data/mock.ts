export const ROOM_IMAGES = [
  "https://images.unsplash.com/photo-1759691555010-7f3f8674d2f2?w=1080&q=80",
  "https://images.unsplash.com/photo-1758555225914-18bc01bb8253?w=1080&q=80",
  "https://images.unsplash.com/photo-1762280237740-5a9292e527ab?w=1080&q=80",
  "https://images.unsplash.com/photo-1775029918191-32e44ee20d06?w=1080&q=80",
  "https://images.unsplash.com/photo-1621891334481-5c14b369d9d7?w=1080&q=80",
  "https://images.unsplash.com/photo-1621891333885-66f833b348ba?w=1080&q=80",
  "https://images.unsplash.com/photo-1663174729156-1d2641bf83d2?w=1080&q=80",
  "https://images.unsplash.com/photo-1621891334762-e186f94d3a1d?w=1080&q=80",
];

export type Room = {
  id: string;
  title: string;
  address: string;
  district: string;
  price: number;
  area: number;
  beds: number;
  bathrooms: number;
  rating: number;
  reviews: number;
  status: "available" | "occupied" | "pending";
  amenities: string[];
  images: string[];
  description: string;
  host: { name: string; avatar: string; phone: string };
  lat: number;
  lng: number;
};

export const AMENITIES = [
  "Wifi miễn phí",
  "Máy lạnh",
  "Máy giặt",
  "Tủ lạnh",
  "Bếp",
  "Ban công",
  "Gác lửng",
  "Bãi đỗ xe",
  "Camera an ninh",
  "Tự do giờ giấc",
  "Có thang máy",
  "Nội thất đầy đủ",
];

export const ROOMS: Room[] = [
  {
    id: "r1",
    title: "Phòng studio cao cấp gần Đại học Bách Khoa",
    address: "12 Lý Thường Kiệt, P.7",
    district: "Quận 10, TP.HCM",
    price: 4500000,
    area: 25,
    beds: 1,
    bathrooms: 1,
    rating: 4.9,
    reviews: 124,
    status: "available",
    amenities: ["Wifi miễn phí", "Máy lạnh", "Máy giặt", "Tủ lạnh", "Ban công", "Camera an ninh"],
    images: [ROOM_IMAGES[0], ROOM_IMAGES[1], ROOM_IMAGES[2], ROOM_IMAGES[3]],
    description:
      "Phòng studio thiết kế hiện đại, đầy đủ nội thất, ánh sáng tự nhiên, gần các trường đại học và trung tâm thương mại. Khu vực an ninh, yên tĩnh, phù hợp sinh viên và người đi làm.",
    host: { name: "Anh Minh", avatar: "https://i.pravatar.cc/100?img=12", phone: "0901 234 567" },
    lat: 10.7769,
    lng: 106.7009,
  },
  {
    id: "r2",
    title: "Căn hộ mini full nội thất, view thoáng",
    address: "45 Nguyễn Văn Cừ",
    district: "Quận 5, TP.HCM",
    price: 5800000,
    area: 32,
    beds: 1,
    bathrooms: 1,
    rating: 4.8,
    reviews: 87,
    status: "available",
    amenities: ["Wifi miễn phí", "Máy lạnh", "Bếp", "Có thang máy", "Tự do giờ giấc"],
    images: [ROOM_IMAGES[1], ROOM_IMAGES[4], ROOM_IMAGES[5]],
    description:
      "Căn hộ mini có gác lửng, ban công view thành phố, gần chợ Bến Thành, nhiều tuyến xe buýt thuận tiện.",
    host: { name: "Chị Lan", avatar: "https://i.pravatar.cc/100?img=32", phone: "0908 111 222" },
    lat: 10.7626,
    lng: 106.6822,
  },
  {
    id: "r3",
    title: "Phòng trọ giá rẻ, sạch sẽ, an ninh 24/7",
    address: "88 Trần Hưng Đạo",
    district: "Quận 1, TP.HCM",
    price: 3200000,
    area: 18,
    beds: 1,
    bathrooms: 1,
    rating: 4.6,
    reviews: 56,
    status: "occupied",
    amenities: ["Wifi miễn phí", "Camera an ninh", "Bãi đỗ xe"],
    images: [ROOM_IMAGES[2], ROOM_IMAGES[6]],
    description:
      "Phòng trọ giá rẻ phù hợp sinh viên, gần các trường đại học lớn. Khu vực dân cư an ninh, có camera 24/7.",
    host: { name: "Cô Hạnh", avatar: "https://i.pravatar.cc/100?img=45", phone: "0912 333 444" },
    lat: 10.7679,
    lng: 106.6951,
  },
  {
    id: "r4",
    title: "Phòng cao cấp có ban công, gần công viên",
    address: "23 Phan Xích Long",
    district: "Quận Phú Nhuận, TP.HCM",
    price: 6500000,
    area: 28,
    beds: 1,
    bathrooms: 1,
    rating: 4.95,
    reviews: 201,
    status: "available",
    amenities: ["Wifi miễn phí", "Máy lạnh", "Máy giặt", "Tủ lạnh", "Bếp", "Ban công", "Có thang máy", "Nội thất đầy đủ"],
    images: [ROOM_IMAGES[3], ROOM_IMAGES[7], ROOM_IMAGES[0]],
    description:
      "Phòng cao cấp với ban công rộng nhìn ra công viên, đầy đủ tiện nghi, lý tưởng cho người đi làm.",
    host: { name: "Anh Khoa", avatar: "https://i.pravatar.cc/100?img=23", phone: "0903 555 666" },
    lat: 10.7956,
    lng: 106.6831,
  },
  {
    id: "r5",
    title: "Studio mới xây 100%, nội thất sang trọng",
    address: "56 Cộng Hòa",
    district: "Quận Tân Bình, TP.HCM",
    price: 5200000,
    area: 26,
    beds: 1,
    bathrooms: 1,
    rating: 4.85,
    reviews: 94,
    status: "available",
    amenities: ["Wifi miễn phí", "Máy lạnh", "Máy giặt", "Bếp", "Camera an ninh", "Có thang máy"],
    images: [ROOM_IMAGES[4], ROOM_IMAGES[5], ROOM_IMAGES[6]],
    description: "Studio mới xây hoàn toàn, gần sân bay Tân Sơn Nhất, thuận tiện đi lại.",
    host: { name: "Chị Thảo", avatar: "https://i.pravatar.cc/100?img=49", phone: "0907 888 999" },
    lat: 10.8014,
    lng: 106.6517,
  },
  {
    id: "r6",
    title: "Phòng ấm cúng, có gác lửng",
    address: "120 Võ Văn Tần",
    district: "Quận 3, TP.HCM",
    price: 3900000,
    area: 22,
    beds: 1,
    bathrooms: 1,
    rating: 4.7,
    reviews: 73,
    status: "available",
    amenities: ["Wifi miễn phí", "Gác lửng", "Tự do giờ giấc", "Bãi đỗ xe"],
    images: [ROOM_IMAGES[5], ROOM_IMAGES[1], ROOM_IMAGES[3]],
    description: "Phòng có gác lửng tận dụng tối đa diện tích, khu vực trung tâm Quận 3.",
    host: { name: "Anh Đức", avatar: "https://i.pravatar.cc/100?img=15", phone: "0911 222 333" },
    lat: 10.7765,
    lng: 106.6886,
  },
];

export const BLOG_POSTS = [
  {
    id: "b1",
    title: "10 kinh nghiệm thuê phòng trọ cho sinh viên năm nhất",
    excerpt: "Chia sẻ những điều cần biết khi đi thuê phòng lần đầu, từ khảo sát giá đến hợp đồng.",
    image: ROOM_IMAGES[0],
    author: "Minh Anh",
    date: "02/05/2026",
    category: "Kinh nghiệm",
    readTime: "5 phút",
  },
  {
    id: "b2",
    title: "Cách bố trí phòng trọ 20m² đẹp như studio",
    excerpt: "Mẹo decor phòng nhỏ trở nên rộng rãi, tiện nghi và thẩm mỹ.",
    image: ROOM_IMAGES[2],
    author: "Khánh Linh",
    date: "28/04/2026",
    category: "Decor",
    readTime: "7 phút",
  },
  {
    id: "b3",
    title: "Top 5 khu vực thuê phòng giá tốt tại TP.HCM 2026",
    excerpt: "Cập nhật khu vực có giá thuê hợp lý, an ninh và tiện ích đầy đủ.",
    image: ROOM_IMAGES[4],
    author: "Hoàng Nam",
    date: "20/04/2026",
    category: "Thị trường",
    readTime: "6 phút",
  },
  {
    id: "b4",
    title: "Mẫu hợp đồng thuê nhà chuẩn pháp lý 2026",
    excerpt: "Những điều khoản quan trọng không thể thiếu trong hợp đồng thuê nhà.",
    image: ROOM_IMAGES[6],
    author: "LS. Phương Thảo",
    date: "15/04/2026",
    category: "Pháp lý",
    readTime: "8 phút",
  },
];

export const DASHBOARD_REVENUE = [
  { month: "T11", revenue: 145, bookings: 12 },
  { month: "T12", revenue: 168, bookings: 15 },
  { month: "T1", revenue: 192, bookings: 18 },
  { month: "T2", revenue: 175, bookings: 14 },
  { month: "T3", revenue: 220, bookings: 22 },
  { month: "T4", revenue: 248, bookings: 25 },
  { month: "T5", revenue: 276, bookings: 28 },
];

export const OCCUPANCY_DATA = [
  { name: "Đã thuê", value: 42, color: "#10b981" },
  { name: "Còn trống", value: 18, color: "#3b82f6" },
  { name: "Đang giữ", value: 6, color: "#f59e0b" },
];

export const APPOINTMENTS = [
  { id: "a1", customer: "Nguyễn Văn A", phone: "0901 111 222", room: "Phòng studio - Q.10", date: "2026-05-08", time: "09:00", status: "confirmed" },
  { id: "a2", customer: "Trần Thị B", phone: "0902 333 444", room: "Căn hộ mini - Q.5", date: "2026-05-08", time: "14:30", status: "pending" },
  { id: "a3", customer: "Lê Văn C", phone: "0903 555 666", room: "Phòng cao cấp - Phú Nhuận", date: "2026-05-09", time: "10:00", status: "confirmed" },
  { id: "a4", customer: "Phạm Thị D", phone: "0904 777 888", room: "Studio - Tân Bình", date: "2026-05-09", time: "16:00", status: "cancelled" },
  { id: "a5", customer: "Hoàng Văn E", phone: "0905 999 000", room: "Phòng gác lửng - Q.3", date: "2026-05-10", time: "11:00", status: "pending" },
];

export const DEPOSITS = [
  { id: "d1", customer: "Nguyễn Văn A", room: "Phòng studio - Q.10", amount: 4500000, date: "2026-05-05", status: "paid" },
  { id: "d2", customer: "Trần Thị B", room: "Căn hộ mini - Q.5", amount: 5800000, date: "2026-05-04", status: "paid" },
  { id: "d3", customer: "Lê Văn C", room: "Phòng cao cấp - Phú Nhuận", amount: 6500000, date: "2026-05-03", status: "pending" },
];

export const INVOICES = [
  { id: "INV-2026-05-01", room: "Phòng studio - Q.10", tenant: "Nguyễn Văn A", month: "05/2026", rent: 4500000, electric: 320000, water: 80000, internet: 100000, trash: 30000, parking: 100000, total: 5130000, status: "unpaid" },
  { id: "INV-2026-04-01", room: "Phòng studio - Q.10", tenant: "Nguyễn Văn A", month: "04/2026", rent: 4500000, electric: 285000, water: 75000, internet: 100000, trash: 30000, parking: 100000, total: 5090000, status: "paid" },
  { id: "INV-2026-05-02", room: "Căn hộ mini - Q.5", tenant: "Trần Thị B", month: "05/2026", rent: 5800000, electric: 410000, water: 95000, internet: 100000, trash: 30000, parking: 100000, total: 6535000, status: "paid" },
];

export const REPORTS = [
  { id: "rp1", room: "Phòng studio - Q.10", reporter: "Nguyễn Văn A", reason: "Tin đăng sai thông tin giá", date: "2026-05-05", status: "pending" },
  { id: "rp2", room: "Căn hộ mini - Q.5", reporter: "Trần Thị B", reason: "Hình ảnh không đúng thực tế", date: "2026-05-04", status: "reviewing" },
  { id: "rp3", room: "Phòng giá rẻ - Q.1", reporter: "Lê Văn C", reason: "Chủ phòng có thái độ không tốt", date: "2026-05-02", status: "resolved" },
];

export const formatVND = (n: number) => n.toLocaleString("vi-VN") + "₫";
