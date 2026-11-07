# Sonneto: trang chủ 01 và khung video C đã duyệt

Anh Việt chốt trang chủ **mẫu 01** và video **hồ sơ hai lớp C**, rồi yêu cầu đưa source lên Sonneto, tag Claude và đưa bản thử lên web. Thư mục này là bản nguồn mới nhất, thay hướng hình thức trong thư mục `sonneto-homepage-approved` cũ; giữ thư mục cũ làm lịch sử, không sửa đè.

## Nguồn và cách đối chiếu

- Preview: https://sonneto-motion-studio.higgsfield.app
- Source Higgsfield commit: `17c9146a6d79bb464c10a6b27e797634f862a005`.
- `provenance.json` ghi SHA-256 của 28 tệp xuất nguyên bản từ checkout cloud. Đây là source thực tế, không dựng lại từ ảnh hoặc Summary.
- `app/src/routes/index.tsx`: homepage, motion, hồ sơ, chuyển sang bài mẫu, notes, tải công thức.
- `app/src/sonneto.css`: font tự host, bố cục responsive, khung C (hồng sau, xanh trước, giấy kem trong).
- `app/public`: logo, font và license, bộ icon SVG, ảnh mẫu, công thức TXT.
- `__root.tsx` giữ explicit stylesheet URL cho SSR. Khi chuyển Vue phải dùng cơ chế import stylesheet phù hợp; không bỏ CSS như lỗi bản thử trước.
- Đây là **snapshot thiết kế React/TanStack trên template Higgsfield**, không phải app Vue đã tích hợp hoặc một project độc lập đầy đủ. `package.json` chỉ ghi môi trường nguồn; không chép dependency Quanta/Higgsfield vào Vue.

## Các mốc đã chọn

- [Trang chủ 01 desktop/mobile](https://d2ol7oe51mr4n9.cloudfront.net/user_3LYDpJDbRin4RoRrxjOSjhFNGEj/e245149a-8a9f-4bde-9695-b94f45b2c2dd.jpg).
- [Hồ sơ desktop](https://d2ol7oe51mr4n9.cloudfront.net/user_3LYDpJDbRin4RoRrxjOSjhFNGEj/4847a02e-bdb9-451f-8032-a7b73f8e40bd.jpg) và [mobile](https://d2ol7oe51mr4n9.cloudfront.net/user_3LYDpJDbRin4RoRrxjOSjhFNGEj/a2121efa-55bf-4e3e-8e17-ad9956a3ea97.jpg).
- [Khung video C được chọn](https://d2ol7oe51mr4n9.cloudfront.net/user_3LYDpJDbRin4RoRrxjOSjhFNGEj/71eec169-8855-4f41-b8ee-2d2ae8121d95.jpg): không dùng lại khung video sát hai mép trong JPEG bài học cũ.

JPEG là bản vẽ duyệt, không phải screenshot của SHA triển khai này. Preview có nhãn mẫu và file picker vì chưa nhận được video khóa học thật. File tải thực tế là TXT; không giả nút tải PDF như trong mockup.

## Nối với PR #2 hiện có

Nền tích hợp Claude đã làm: `42173440f368b07fb631fe7a44736b3ad38bb777`, nhánh `tich-hop-trang-chu-codex`, PR #2. Không bỏ các API/router/auth/expiry và trạng thái tải, rỗng, lỗi/retry đang có.

1. Đưa tỉ lệ mẫu 01 vào `TrangChu.vue`: logo giữa, tiêu đề và khoảng thở gọn, tủ chiếm trọng tâm; bộ chọn motion chỉ là công cụ preview, không chiếm hero production. Một tai cho mỗi bìa, không thêm tai phụ chồng lên nhau.
2. Dùng khung C trên cả trang hồ sơ và bài học: toàn bộ video/controls nằm trong khung, có lề ngoài; xanh trước/hồng sau/kem trong. Lớp nền có thứ tự explicit, không để pseudo-element hồng phủ lên mép xanh.
3. Giữ 4 motion click đã được chọn và reduced-motion; đóng đảo chiều mở. Không dùng zoom thủ công toàn canvas làm nội dung tràn ngang. Kiểm rapid click và return focus/scroll.
4. Tách hồ sơ khám phá và bàn học nhưng video ở ngoài tab tài liệu, không unmount khi đổi Nguyên liệu/Các bước/Ghi chú. Vue dùng router/lifecycle của dự án thay vì copy thao tác dialog React nguyên xi.
5. Nối bài học thật qua API hiện hữu; snapshot dùng dữ liệu mẫu công khai. Không đưa nguyên liệu/video bị giới hạn ra API công khai. Tài khoản còn hạn/hết hạn phải giữ đúng gate.
6. Dùng khóa course/lesson ổn định để lưu notes; id mảng trong preview không được dùng production. Nhãn mẫu, file picker local và các bài chưa có nội dung phải được thay bằng dữ liệu/trạng thái thật.
7. Không thay source runtime trong PR #1 bàn giao này; tích hợp trong PR #2 để giữ một đầu mối. Sau tích hợp build bundle Frappe theo README repo và kiểm các màn không thuộc scope.

## Kiểm đã làm và giới hạn

- `git diff --check` nguồn cloud đạt; push Higgsfield được service xác nhận. Xác minh 28 SHA-256 sau download archive.
- Build/deploy của preview do `deploy_website` thực hiện; không có node_modules trong sandbox nên không chạy typecheck độc lập tại sandbox.
- Chưa có browser QA của SHA cuối: CUA báo browser use disabled; Mac cũng đang khóa. Không gọi ảnh mockup là ảnh kiểm live. Không vượt quyền bằng Playwright ngoài CUA.
- Chưa merge/deploy Sonneto Frappe; chưa có kết luận Claude review; chưa có video thật hoặc đồng bộ notes/progress vào LMS.

## Cổng trước khi phát hành bản chính

Chụp source tích hợp cuối ở 1440/390/320; kiểm tràn ngang, tai bìa, logo/menu, dấu Việt, khung C, close/focus và reduced-motion. Kiểm các trạng thái API, auth/expiry, media lỗi/tải chậm, đổi tab không reset playback, file download thật và notes storage bị chặn. Báo rõ SHA, test, review, deploy và kiểm live riêng.
