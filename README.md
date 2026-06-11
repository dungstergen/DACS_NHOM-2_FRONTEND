# E-commerce Room Rental Platform

Đây là mã nguồn giao diện (Frontend) cho E-commerce Room Rental Platform. Thiết kế gốc (Figma) có tại: [E-commerce-Room-Rental-Platform](https://www.figma.com/design/SKvYDkBkGDLJxTClL7JZPH/E-commerce-Room-Rental-Platform).

## Hướng dẫn cài đặt và khởi chạy dự án

Dự án này được xây dựng dựa trên hệ sinh thái **Vite**, **React** và sử dụng **pnpm** làm trình quản lý package. Vui lòng làm theo các bước dưới đây để chạy dự án khi mới clone về:

### 1. Yêu cầu môi trường
- **Node.js**: Khuyến nghị phiên bản 18.x trở lên.
- **pnpm**: Bạn cần cài đặt pnpm trên máy tính. Nếu chưa cài đặt, hãy mở terminal và chạy lệnh:
  ```bash
  npm install -g pnpm
  ```

### 2. Cài đặt thư viện (Dependencies)
Mở terminal tại thư mục gốc của dự án vừa clone về và chạy lệnh sau để tải tất cả các thư viện cần thiết:
```bash
pnpm install
```
*(Lưu ý: Nên dùng `pnpm install` thay vì `npm install` để đồng bộ đúng phiên bản các package được định nghĩa trong `pnpm-lock.yaml`)*

### 3. Cấu hình biến môi trường
Dự án yêu cầu các biến môi trường để hoạt động (đặc biệt là để kết nối với API backend). 
Bạn hãy tạo một file có tên là `.env` tại thư mục gốc của dự án (cùng vị trí với `package.json`) và thêm dòng sau:
```env
VITE_API_URL=http://localhost:8000
```
*(Bạn có thể thay đổi URL trên nếu server backend của bạn chạy ở một cổng hoặc domain khác)*

### 4. Chạy dự án ở chế độ phát triển (Development)
Sau khi hoàn tất các bước trên, bạn khởi chạy server phát triển bằng lệnh:
```bash
pnpm dev
```
Dự án sẽ được build và phục vụ tại địa chỉ local (thường là `http://localhost:5173`). Bạn chỉ cần click vào đường dẫn trên terminal để xem ứng dụng trên trình duyệt.

### 5. Build dự án (Dành cho Production)
Khi bạn cần đóng gói ứng dụng để deploy lên môi trường production, hãy chạy lệnh:
```bash
pnpm build
```
Kết quả sẽ được tạo ra trong thư mục `dist`.