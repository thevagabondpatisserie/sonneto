# Bài học sự cố trên repo Sonneto

Mỗi mục là một bẫy đã gặp thật. Gặp bẫy mới thì thêm một mục ngắn ngay trong PR
đang làm.

## 04/11/2026: máy anh Việt bật giảm chuyển động, trang xem thử mất hết hiệu ứng

Chrome trên máy anh báo `prefers-reduced-motion: reduce`. Bản xem thử đặt thời
lượng 0 trong trường hợp đó nên anh thấy "motion cứng" dù code có chuyển động.
Cách phòng: trang xem thử luôn có nút bật chuyển động đầy đủ, và khi kiểm phải
chạy cả hai chế độ (Playwright `reducedMotion: 'reduce'` và `'no-preference'`).

## 03/11/2026: ở 390px bấm vào thân ngăn lại mở ngăn kế tiếp

Vùng bấm của ngăn chồng lên ngăn dưới. Kiểm bằng cách bấm giữa thân từng ngăn ở
390 và 320, đếm số lần mở sai (bản cũ 7/8, bản sửa 0/8).

## 04/11/2026: đóng hồ sơ xong, ngăn vừa mở vẫn hé vì focus trả về

Sau khi đóng, focus quay lại ngăn và kích hoạt trạng thái hover, ngăn nhô lên
100px, cú chạm tiếp theo ở cuối trang bị trượt. Khi tích hợp, không gắn hiệu ứng
mở vào `:focus`, chỉ vào `:focus-visible` hoặc trạng thái riêng.

## 04/11/2026: trang www của Frappe cần `<base>` hoặc đường dẫn tuyệt đối

Bản build Vite với `base: './'` chạy được khi mở trực tiếp nhưng đặt vào
`sonneto/www/` thì tài sản tìm sai chỗ. Chèn `<base href="/assets/sonneto/<ten>/">`
hoặc build với `--base=/assets/sonneto/<ten>/`.

## 04/11/2026: repo public, Frappe Cloud không tự thấy commit mới

Phải bấm Fetch Latest Updates trước khi Update Available hiện đúng SHA. Kiểm cột
"To" trong hộp Update Bench đúng SHA vừa merge rồi mới bấm Next.

## 05/11/2026: comment `@codex` trên repo này không đánh thức Codex

Tích hợp GitHub của Codex chưa bật cho repo sonneto nên không có tài khoản
`chatgpt-codex-connector[bot]` nào đọc comment. Mọi comment "của Codex" tới nay là
Codex local đăng bằng tài khoản anh Việt. Giao việc xong phải báo anh Việt dán
cho Codex chạy, hoặc anh bật repo này trong phần GitHub của Codex.
