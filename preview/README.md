# Sonneto — bản xem thử tự chủ

Bản duyệt giao diện trang chủ 01 + video khung C. Chạy từ repo, không cần tài khoản, SDK, máy chủ hay CDN Higgsfield. Font, logo, icon, ảnh và công thức mẫu đi kèm. Source chuẩn để sửa preview là `preview/src/`; snapshot `design/sonneto-approved-01-frame-c/` giữ nguyên để đối chiếu.

## Xem ngay, không cần Node

Từ thư mục gốc repo:

```sh
python3 preview/serve.py
```

Mở http://127.0.0.1:8766/ trên **máy đang chạy lệnh**. Link localhost không dùng trên điện thoại hoặc máy khác. Có thể đổi cổng bằng `--port 8770`. Không cần mở Higgsfield. Bản build sẵn nằm trong `preview/dist/`.

## Sửa và build

Node 22.14 trở lên, npm:

```sh
cd preview
npm ci
npm run dev
# Sau khi sửa:
npm run build
```

Commit source + lockfile + dist cùng nhau. `dist/` là kết quả build, không sửa tay. React 19 + Vite, không còn TanStack route hay bộ khung Higgsfield. Giữ thiết kế từ source bàn giao 971efc37156aab1bc9b06516683dbc7838b36920; thêm entry độc lập, reset margin, đường asset tương đối và khoảng trắng tiêu đề desktop. Căn lại hộp bấm bìa với tai bìa để bấm giữa ngăn đầu không mở nhầm ngăn kế tiếp; giữ vị trí hình ảnh.

## Đưa lên máy chủ của mình

Upload **nội dung** `preview/dist/` lên thư mục web tĩnh bất kỳ (Nginx, object storage, hosting tĩnh của mình). Hỗ trợ cả domain gốc lẫn thư mục con có dấu `/` cuối URL. Không cần Node trên máy chủ sau build; không cần key Higgsfield. Repo và build này là nguồn bàn giao, link dịch vụ phác thảo chỉ để tham khảo. Workflow `Sonneto independent preview` build trên GitHub và xuất artifact `sonneto-static-preview`; đây là gói để upload, chưa phải URL đã deploy.

Đây là bản mẫu công khai, không phải LMS đang vận hành: chưa có đăng nhập, quyền học hoặc thanh toán; chọn video là chọn file local để thử, không upload. Ghi chú chỉ lưu trên trình duyệt. Không đưa video/công thức trả phí vào thư mục public này.

## Web Sonneto chính

Tiếp tục tích hợp mẫu đã duyệt vào `frontend/` Vue + Frappe/LMS trong PR #2, giữ API, đăng nhập và hạn học. Không thay app chính bằng preview React. Triển khai app chính qua pipeline Sonneto hiện có; Higgsfield không nằm trong pipeline. Video thật cần kho video do Sonneto quản lý và quyền truy cập theo bài; recipe thật phải tải qua quyền LMS. Việc này chưa hoàn tất trong gói preview.

## Kiểm trước khi phát hành chính

Build sạch, tải asset không lỗi; kiểm trực tiếp 1440/390/320px, mở/đóng hồ sơ, 4 kiểu motion, reduced-motion, khung C và đổi tab khi phát video, notes, tải TXT. Kiểm riêng đăng nhập/hạn học khi đưa vào Vue. Build thành công không thay nghiệm thu trình duyệt.

## Motion atelier 02

Sáu kiểu mở: rút ngang, lật bìa, xòe giấy, nhấc khỏi tủ, xoay trên bàn, mở từ giữa. Bìa 3D mở trên trục trái, các giấy bung độc lập theo nhịp; đóng gom giấy trước. Đổi tab có chuyển động riêng, không remount video. Tự đổi tránh lặp liên tiếp.

Mặc định tôn trọng giảm chuyển động hệ thống. Nút **Bật motion đầy đủ** là lựa chọn chủ động chỉ trong bản thử, không thay cài đặt máy. Nếu máy giảm chuyển động, có thông báo rõ ngay đầu trang.

Đã chuẩn bị route Frappe `/xem-thu-motion`, tách `/xem-thu`. Build từ gốc repo:

```sh
cd preview
npm run build
npx vite build --base=/assets/sonneto/xem-thu-motion/ --outDir ../sonneto/public/xem-thu-motion --emptyOutDir
cp ../sonneto/public/xem-thu-motion/index.html ../sonneto/www/xem-thu-motion.html
```

Các bước trên chỉ build. Cần deploy app Sonneto đúng SHA mới có route trên site thật.
