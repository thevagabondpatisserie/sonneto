# Giao diện trang chủ Sonneto đã được chọn

Ngày 01/11/2026, anh Việt chọn bản giao diện Codex này và yêu cầu đưa lên repository Sonneto để Claude áp dụng làm **trang chủ chính**.

Đây là bộ mã nguồn nguyên bản từ bản xem thử đã chọn, không phải bản dựng lại theo mô tả. Xem `provenance.json` để đối chiếu commit nguồn và SHA-256 từng tệp.

- Bản xem thử riêng tư: https://sonneto-baking-studio.thevagabondbakery.chatgpt.site
- Commit nguồn Sites: `488f6eac00fd9a9ff9cafad6600952cdd1aaee27`.
- Nền Sonneto khi bàn giao: `279213d3d603c3602a758f6ae383777819349746`.
- Bộ mẫu này chưa thay trang chủ Vue hoặc bundle Frappe đang chạy.

## Mở nguyên bản

Từ gốc repo:

```sh
python3 -m http.server 8765 --directory design/sonneto-homepage-approved
```

Mở http://localhost:8765. Không cần npm/build. Font lấy từ Google Fonts, có font dự phòng khi mất mạng.

## Bàn giao cho Claude: áp dụng làm trang chủ chính

Dùng trực tiếp `index.html`, `style.css`, `app.js` trong thư mục này làm nguồn thiết kế. Chuyển sang Vue, giữ bố cục, màu sắc, tỷ lệ, chữ và chuyển động của bản đã chọn. Không chỉ chỉnh lại tủ 3D cũ hoặc dùng bản mô tả để dựng một phương án khác.

1. Thay bố cục chính tại `frontend/src/pages/TrangChu.vue`: mở trang thấy ngay tiêu đề và các bìa nhiều màu trên nền tối; không đặt hero ảnh cũ phía trước tủ. Menu, logo và khoảng trắng theo bản mẫu.
2. Chuyển tương tác sang component Vue (có thể thay `frontend/src/components/TuHoSo.vue`): các bìa xếp phẳng, tab nhô, hover/focus mở rộng; bấm mở trang giấy gồm giấy hồng, giấy trắng và phiếu vàng. Giữ chuyển động và chế độ giảm chuyển động. Không mang kiểu xoay 3D cũ vào thay cho hiệu ứng đã chọn.
3. Dữ liệu tám nhóm bánh, công thức và nhãn khóa học trong `app.js` là **minh họa**, không phải nội dung khóa học được duyệt. Nối với `layKhoaHoc()` và dữ liệu LMS hiện hữu, xử lý đang tải/rỗng/lỗi/thử lại. Không công khai nội dung bài học bị giới hạn quyền chỉ để lấp trang giấy mẫu.
4. Giữ các luồng cần thiết của Sonneto: đăng nhập, Khóa của tôi, bài học và hạn học, lớp tại bếp, làm bánh cho quán, liên hệ. Sắp nội dung bổ sung dưới tủ hoặc đường điều hướng phù hợp; không để chúng lấn át bố cục mở đầu đã chọn. Phần backend và quy tắc hạn học giữ nguyên phạm vi.
5. Tìm kiếm/lưu bài trong mẫu là chức năng trên trình duyệt. Khi nối dữ liệu thật, dùng mã khóa học ổn định thay chỉ số mảng; nêu rõ lưu trên thiết bị nếu chưa có đồng bộ tài khoản. Đảm bảo các thao tác cần thiết dùng được trên mobile, không phụ thuộc hover.
6. Dùng Vue Router hiện hữu; không chép nguyên `history.replaceState` hoặc gắn sự kiện DOM thủ công của bản mẫu vào ứng dụng Vue. Tránh CSS toàn cục làm đổi trang học/Khóa của tôi.
7. Sau tích hợp, chạy kiểm frontend/backend phù hợp và `npm run build`; commit cả `sonneto/public/frontend` và `sonneto/www/sonneto.html` theo README repo. Không chỉ chép HTML mẫu lên trang Frappe để bỏ qua router/API.

## Tiêu chí nghiệm thu

- So song song với bản mẫu: desktop 1440 px và mobile 390 px, thử thêm 320 px; không tràn ngang, không che/cắt tên bìa hoặc nút.
- Rê chuột, focus bàn phím, chạm mở, trở về tủ, tìm kiếm, lưu/bỏ lưu và tải lại đều hoạt động; hỗ trợ reduced motion.
- Dữ liệu LMS thật: trạng thái tải, rỗng, lỗi, người chưa đăng nhập, học viên còn hạn và hết hạn. Không làm mất luồng liên hệ/đăng nhập hiện có.
- Chụp trang chủ và trang giấy trên desktop/mobile từ SHA tích hợp cuối; ghi rõ fixture hay site thật.
- Báo PR và SHA cuối, kiểm đạt/hỏng, review, build, merge, deploy và kiểm live riêng. Upload bộ mẫu này không đồng nghĩa đã thay trang chủ production.

## Bằng chứng hiện có và giới hạn

Bản mẫu đã được kiểm cú pháp JavaScript, mở bài Chocolate, trở về tủ, lưu công thức và tải lại vẫn giữ; đã xem desktop 1440 px và mobile 390 px với document width bằng viewport. Private deployment Sites đã thành công. Lượt mở live trước đây trong trình duyệt kiểm tra bị timeout; không coi đó là kiểm live đạt.

Bàn giao này giữ nguyên ba tệp đã chọn (đối chiếu byte và SHA-256), không có thay đổi runtime của ứng dụng Sonneto. Claude là người tiếp tục tích hợp trang chủ theo yêu cầu mới của anh Việt; chưa có kết quả tích hợp/review/deploy trong PR bàn giao.
