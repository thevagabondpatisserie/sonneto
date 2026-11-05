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

1. Codex cloud qua tích hợp GitHub (tài khoản `chatgpt-codex-connector[bot]`): chỉ
   hoạt động khi repo `thevagabondpatisserie/sonneto` đã được bật trong phần
   GitHub của Codex (chatgpt.com/codex, mục Settings, GitHub). Tới 05/11/2026 repo
   này CHƯA bật, nên comment `@codex` trên PR không đánh thức ai. Kiểm bằng cách
   xem có comment nào của `chatgpt-codex-connector[bot]` chưa.
2. Codex local trên máy anh Việt: đăng comment bằng chính tài khoản
   `thevagabondpatisserie`. Chỉ chạy khi anh Việt mở Codex và dán việc vào.

Vì vậy khi giao việc cho Codex, Claude phải làm đủ hai bước:

- Đăng comment giao việc trên đúng PR theo mẫu ở `AGENTS.md` mục 4 (dòng đầu
  `[GIAO CODEX]`, SHA nền, phạm vi tệp, hành vi cần đạt, ca kiểm).
- Báo anh Việt trong chat bằng một câu: "Việc X đã ghi ở link Y, anh dán cho Codex
  chạy". Không tự coi là Codex đã nhận. Không hẹn giờ chờ.

Khi nhận lại bản của Codex: lấy đúng commit Codex báo, build lại từ nguồn để đối
chiếu từng tệp, kiểm bằng Playwright ở 390 và 1440, rồi mới đặt lên `main`.

## Đẩy code và deploy

- `git push origin <nhánh>` chạy được trên repo này (khác với vagabond). Mở PR
  bằng `gh api`, không Draft, mô tả có phần tóm tắt nghiệp vụ cho anh Việt trước.
- Merge CHỈ khi anh Việt cho phép cho đúng PR đó trong phiên. Codex chưa rà thì
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

1. Không merge, không deploy khi anh Việt chưa cho phép trong phiên.
2. Không nhập mật khẩu, khoá API, token vào bất kỳ trang nào.
3. Không commit video hoặc ảnh tham chiếu của bên thứ ba (Pinterest, Higgsfield)
   vào repo public; mô tả bằng chữ trên PR và lưu khung hình trong Claude Project.
