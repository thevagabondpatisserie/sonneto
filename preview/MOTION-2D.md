# Bàn giấy 2D, 06/11/2026

Thay thế phần Motion atelier 02 trong README. Một motion chính thuần 2D: kéo ngăn, phóng nhẹ, giấy xòe chéo, đóng gom giấy rồi thu về ngăn. Không có lật bìa 3D.

Kéo thanh tên bằng chuột hoặc ngón tay; phím mũi tên di chuyển giấy đang chọn. Giấy được đưa lên trên khi tương tác. Bấm nền/nút xếp để xếp hoặc xòe lại. Nút chọn từng giấy giúp tiếp cận giấy bị che. Nội dung dài cuộn trong giấy; video nằm ngoài tab.

Build theo lệnh cuối README, giữ route riêng /xem-thu-motion. Không đổi Vue/LMS hay /xem-thu. Mặc định theo giảm chuyển động của máy, có opt-in đầy đủ trong bản thử.

## Kiểm

- Chrome CUA 390/1440: mở ngăn03, chụp giữa motion, không tràn trang/dialog.
- Drag chuột ở390: mục lục dịch -60px/+23px, z-index tăng7. Xếp lại reset offset; ArrowLeft dịch12px. Bấm nền đổi trạng thái xếp.
- Đổi tab, lưu ghi chú, Escape đóng, mở ngăn cuối sau đóng đạt.
- Chế độ giảm chuyển động và opt-in đầy đủ đều mở/đóng được; console error rỗng khi kiểm desktop.
- Build hai lần, 52 file output khớp byte. Source/build không còn rotateX, rotateY, perspective.
- Chưa kiểm touch trên iPhone/Safari thật, FPS hoặc video bài thật. Không coi viewport390 là kiểm iPhone.
- Chưa deploy Frappe. Claude tiếp nhận exact commit, kiểm và deploy trang thử.
