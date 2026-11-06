# CLAUDE.md

Hướng dẫn cho Claude khi làm trên repo Sonneto. Đọc cùng `AGENTS.md` (quy ước chung
cho cả Claude và Codex) và `docs/bai-hoc-su-co.md` (bẫy đã gặp thật). Ngôn ngữ làm
việc là tiếng Việt có dấu. Không dùng dấu em dash hay en dash, chỉ dùng gạch ngang
thường.

## Đầu phiên, trước dòng code đầu tiên

```
git fetch origin
git log origin/main -n 10 --oneline
git status -sb
cat AGENTS.md
cat docs/bai-hoc-su-co.md
```

Rồi đọc PR đang mở và comment mới nhất trên GitHub. GitHub là trạng thái hiện
tại; ghi chú trong Claude Project chỉ là nhật ký. Nhật ký đầy đủ nằm ở project doc
`claude/sonneto-web-*.md` trong Claude Project "Vận hành - Operation".

## Phân vai (anh Việt chốt 05/11/2026)

- Claude: lead. Viết code tích hợp vào app Frappe và giao diện Vue, mở PR, nhận
  bản của Codex lên `main`, deploy Frappe Cloud khi anh Việt cho phép, kiểm site
  thật, báo kết quả.
- Codex: làm bản thiết kế và bản xem thử (thư mục `preview/`, `design/`) trên nhánh
  riêng của Codex, và rà PR của Claude khi được gọi. Codex không tự đẩy vào `main`.
- Anh Việt: duyệt giao diện trên site thật, cho phép merge và deploy.

## Hai cách Codex nhận việc trên repo này

1. Codex cloud qua tích hợp GitHub: cài đặt Sonneto đã được Codex desktop
   kiểm trực tiếp ngày 06/11/2026, có trong danh sách repo và bật review tự động.
   Tuy nhiên chưa thấy bot trả lời các yêu cầu PR #1/#5 sau hơn 30 phút.
   Đây là luồng CHƯA XÁC MINH hoạt động, không kết luận thiếu quyền chỉ từ việc im lặng.
2. Codex local trên máy anh Việt: có thể đăng comment bằng tài khoản
   `thevagabondpatisserie`; tên người đăng không chứng minh cloud bot đã chạy.

Khi giao việc, đăng đúng PR theo mẫu `[GIAO CODEX]` trong `AGENTS.md` mục 4.
`@codex review` yêu cầu rà code; không đồng nghĩa giao sửa hay tạo lịch làm việc.
Comment đã gửi, bot đã nhận, task đang chạy và code đã push là bốn trạng thái riêng.
Merge tài liệu này không tự bật bot hoặc tự đánh thức phiên Codex desktop.
Trong lúc cloud chưa xác minh, báo anh Việt link để giao cho Codex desktop.
Khi anh đã giao việc trong chat hiện tại, Codex tiếp tục trực tiếp, không bắt anh
chép lại brief đã đọc được trên PR. Trước khi làm kiểm task cloud để tránh sửa trùng.
Không coi reaction hoặc CI xanh là review đạt. Không hẹn giờ chờ nếu chưa có cơ chế.

Khi nhận lại bản của Codex: lấy đúng commit Codex báo, build lại từ nguồn để đối
chiếu từng tệp, kiểm bằng Playwright ở 390 và 1440, rồi mới đặt lên `main`.

## Đẩy code và deploy

- `git push origin <nhánh>` chạy được trên repo này (khác với vagabond). Mở PR
  bằng `gh api`, không Draft, mô tả có phần tóm tắt nghiệp vụ cho anh Việt trước.
- Merge CHỈ khi anh Việt đã cho phép đúng PR hoặc phạm vi đó. Quyền đã cấp tiếp tục có hiệu lực qua các phiên, trừ khi anh thu hồi hoặc phạm vi thay đổi. Codex chưa rà thì
  ghi rõ "Codex chưa rà" trong comment merge.
- Deploy Frappe Cloud, bench "Sonneto" (bench-51208), site sonneto.s.frappe.cloud:
  Apps, dấu ba chấm của app Sonneto, Fetch Latest Updates, rồi Update Available,
  tích đúng app Sonneto, Next, TÍCH CẢ SITE, Deploy and update site, chờ khoảng
  6 phút. Repo public nên Frappe Cloud không tự thấy commit mới, phải Fetch trước.
- Deploy xong kiểm trên site thật ở khung 375x812 và 1440, ghi `[ĐÃ DEPLOY]` trên
  PR kèm SHA, link và những gì chưa kiểm.

## Trang xem thử

- `/xem-thu`, `/xem-thu-motion` là trang tạm để anh Việt duyệt giao diện, đặt ở
  `sonneto/www/<ten>.html` + `.py` và tài sản ở `sonneto/public/<ten>/`, thẻ
  `<base>` hoặc đường dẫn tuyệt đối `/assets/sonneto/<ten>/`. Luôn `noindex`.
- Trang xem thử không nối dữ liệu LMS, không có đăng nhập. Gỡ cùng PR khi tính
  năng tương ứng vào trang chủ thật.

## Ba việc không làm

1. Không merge, không deploy khi chưa được anh Việt cho phép đúng phạm vi.
2. Không nhập mật khẩu, khoá API, token vào bất kỳ trang nào.
3. Không commit video hoặc ảnh tham chiếu của bên thứ ba (Pinterest, Higgsfield)
   vào repo public; mô tả bằng chữ trên PR và lưu khung hình trong Claude Project.
