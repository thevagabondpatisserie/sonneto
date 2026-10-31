# Sonneto

App Frappe cho web Sonneto: trang giới thiệu, khoá học có hạn học, màn học có công thức theo gram, màn Khoá của tôi, form để lại số. Chạy trên một **site riêng** trên Frappe Cloud với **tên miền riêng**, cài kèm Frappe Learning (app `lms`). Không chung site với Vagabond.

Giao diện theo Design System "Sonneto" (phương án A Bếp tối, chốt 28/10/2026).

## Cấu trúc

| Thư mục | Nội dung |
| --- | --- |
| `frontend/` | Giao diện Vue 3 + Vite. `src/pages`: Trang chủ, Bài học, Khoá của tôi. `src/styles/tokens.css`: màu, chữ, khoảng cách lấy từ Design System. |
| `sonneto/api.py` | Các hàm giao diện gọi: danh sách khoá, khoá của tôi, bài học (chặn khi hết hạn), gửi yêu cầu liên hệ. |
| `sonneto/han_hoc.py` | Phép tính hạn học (thuần, không cần Frappe). |
| `sonneto/cai_dat.py` | Thêm trường vào doctype của Frappe Learning sau mỗi lần migrate. |
| `sonneto/su_kien.py` | Tự điền hạn học khi ghi danh; email nhắc khi còn 14 và 3 ngày. |
| `sonneto/sonneto/doctype/yeu_cau_lien_he` | Nơi lưu số điện thoại khách để lại ở trang chủ. |

## Trường thêm vào Frappe Learning

- **LMS Course**: Số ngày được học (mặc định 180), Hình thức (Online hoặc Tại bếp), Thời lượng, Mô tả ảnh, Màu bìa hồ sơ, Học xong làm được gì.

Hồ sơ khoá ở trang chủ tự lấy 4 bài đầu làm "bài tiêu biểu" và 5 dòng nguyên liệu của bài đầu tiên có công thức làm "phiếu cân".
- **LMS Enrollment**: Học được tới ngày (tự điền khi ghi danh, sửa tay để gia hạn riêng).
- **Course Lesson**: Độ dài video, Ảnh bìa video, Công thức (gram, dạng JSON), Các bước gắn phút (JSON).

Mẫu JSON công thức:

```json
{"ten": "Mousse vani",
 "choBaoNhieu": {"0.5": "Đủ cho nửa bánh tròn 18 cm.", "1": "Đủ cho 1 bánh tròn 18 cm.", "2": "Đủ cho 2 bánh tròn 18 cm."},
 "nguyenLieu": [{"ten": "Sữa tươi", "gam": 250}, {"ten": "Vani", "soLuong": 1, "donVi": "trái"}]}
```

Mẫu JSON các bước: `[{"phut": "01:10", "giay": 70, "viec": "Ngâm gelatin trong nước đá 10 phút."}]`

## Lệnh

```
cd frontend && npm install
npm run dev            # chạy thử, cần site Frappe chạy cùng
npm run build:preview  # bản xem thử dùng dữ liệu mẫu, ra frontend/dist-preview
npm run build          # bản thật, ra sonneto/public/frontend và sonneto/www/sonneto.html
npm test               # kiểm thử phép tính phía giao diện
cd .. && python3 -m unittest sonneto.kiem_thu.test_han_hoc
```

Build xong phải commit cả `sonneto/public/frontend` và `sonneto/www/sonneto.html`, vì Frappe Cloud không chạy npm của app này.

## Lên Frappe Cloud

1. Tạo bench group mới (hoặc dùng bench đang có nếu cùng phiên bản Frappe), thêm app `lms` và app này từ GitHub.
2. Tạo site mới cho Sonneto, cài `lms` rồi `sonneto`.
3. Gắn tên miền riêng ở mục Domains của site.

## Chưa làm

- Thanh toán VietQR hoặc PayOS (Frappe Learning không có cổng Việt Nam).
- Video DRM (đề xuất VdoCipher, làm sau).
- Trang chi tiết từng khoá; nút Gia hạn và Tải công thức đang chưa nối.
- Chặn học viên đi vòng qua đường `/lms` có sẵn của Frappe Learning để xem bài đã hết hạn.
