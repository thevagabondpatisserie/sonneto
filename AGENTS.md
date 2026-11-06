# AGENTS.md

Quy ước chung cho Claude và Codex trên repo Sonneto (web khoá học làm bánh của anh
Việt, chạy trên Frappe Cloud với Frappe Learning). Tiếng Việt có dấu. Không dùng
em dash hay en dash.

## 1. Repo này là gì

- App Frappe `sonneto` cài trên site riêng sonneto.s.frappe.cloud, kèm app `lms`.
- `frontend/`: Vue 3 + Vite, build ra `sonneto/public/frontend` và
  `sonneto/www/sonneto.html`. Frappe Cloud không chạy npm của app này, nên bản
  build phải commit kèm nguồn.
- `preview/`, `design/`: bản thiết kế và bản xem thử do Codex làm (React, dữ liệu
  mẫu). Không nối LMS, không phải code chạy thật.
- `sonneto/www/xem-thu*.html`, `sonneto/public/xem-thu*/`: trang tạm để anh Việt
  duyệt trên site thật.
- `sonneto/api.py`, `han_hoc.py`, `ho_so.py`, `cai_dat.py`, `su_kien.py`: phần
  Frappe. Phép thuần tách riêng để kiểm không cần site.

## 2. Nhánh và PR

- `main` là bản đang deploy. Không ai commit thẳng vào `main`.
- Codex làm trên nhánh `codex/*`. Claude làm trên nhánh tiếng Việt không dấu, ví dụ
  `xem-thu-motion`, `tich-hop-trang-chu`.
- Mỗi việc một PR, không Draft. Mô tả PR: 2 đến 4 câu tóm tắt nghiệp vụ cho anh
  Việt (vấn đề, việc làm, kết quả sẽ thấy, anh cần quyết gì), rồi phần kỹ thuật.
- Bản của Codex vào `main` bằng cách Claude lấy đúng commit, build lại đối chiếu,
  đặt lên nhánh mới từ `main` hiện tại và mở PR. Không merge thẳng nhánh `codex/*`
  vì nhánh đó chứa cả `preview/` và lịch sử dài.

## 3. Trước khi bàn giao

- Giao diện: kiểm trực tiếp trình duyệt ở 390 và 1440 bằng công cụ được môi trường cho phép (CUA hoặc Playwright), mở ngăn, đóng ngăn, mở ngăn cuối sau
  khi đóng, khi cần chứng minh chuyển động, dùng ảnh giữa animation hoặc API animation nếu công cụ hỗ trợ; không vượt giới hạn công cụ.
  Không tài nguyên lỗi, không lỗi JS, không tràn ngang.
- Phần Frappe: `python3 -m unittest sonneto.kiem_thu.test_han_hoc` và
  `cd frontend && npm test`.
- Thêm hàm `@frappe.whitelist()` thì ghi tên vào README mục API và kiểm quyền
  Guest.
- Bản build phải tái lập được: build lại từ nguồn cùng commit phải trùng byte với
  thư mục đã commit. Lệch là dừng.

## 4. Mẫu comment trên PR

Dòng đầu là nhãn, một comment một việc:

- `[GIAO CODEX]` Claude giao việc cho Codex. Ghi: SHA nền, phạm vi tệp, hành vi
  cần đạt (mô tả theo mắt người xem, không theo tên hàm), ca kiểm để Codex tự
  chứng minh, và "vòng thứ mấy" của việc đó.
- `[CODEX ĐÃ ĐẨY]` Codex báo xong. Ghi: HEAD mới, SHA nền, tệp đổi, cách đã kiểm,
  việc chưa làm. Chưa đẩy lên GitHub thì không dùng nhãn này.
- `[CẦN DUYỆT]` Claude đã kiểm, chờ anh Việt cho merge hoặc deploy.
- `[ĐÃ DEPLOY]` Claude đã deploy và kiểm site thật. Ghi SHA, URL, đã kiểm gì,
  chưa kiểm gì.
- `[BỊ CHẶN]` thiếu quyền, thiếu dữ liệu, hoặc cần anh Việt quyết.

Luật dừng: cùng một việc đã qua 3 vòng giao Codex trong 24 giờ mà không có bằng
chứng mới thì không giao nữa, viết ngắn chỗ bất đồng và mời anh Việt phân xử.

## 5. Chuyển động giao diện (anh Việt chốt 05/11/2026)

Tham chiếu là video tủ hồ sơ anh Việt gửi (mô tả đầy đủ ở PR #1, comment
05/11). Tất cả là 2D: trượt, xoay trong mặt phẳng vài độ, phóng to, đổi thứ tự
chồng lớp, bóng mềm. Không lật bìa, không xoay trục 3D, không `perspective`.
Tôn trọng giảm chuyển động của hệ thống nhưng có nút bật đầy đủ trong trang xem
thử. Trên điện thoại giữ tủ và bìa nằm ngang, giấy chồng mép, không kéo thành
cột dọc.

## 6. Deploy và kiểm

Xem `CLAUDE.md` mục "Đẩy code và deploy". Chỉ Claude bấm deploy, và chỉ khi anh
Việt cho phép cho đúng PR đó. Deploy xong phải mở site thật, không tin pipeline
xanh.
