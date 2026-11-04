# Kiểm bản độc lập — 2026-11-04

- Nguồn gốc: snapshot PR1 971efc37156aab1bc9b06516683dbc7838b36920; snapshot không sửa.
- Node 22.14.0, npm 10.9.2; Vite 6.4.5; React 19.0.0. Build đạt; npm audit 0 vulnerabilities tại lúc cài bản vá.
- Python serve.py chạy loopback 127.0.0.1:8766. HTTP kiểm tất cả file dist khớp byte với file repo.
- Chrome thật qua CUA: mở trang, logo/font/ảnh và khung video hiển thị. Đo chiều rộng trang/hồ sơ ở 320/390/1440 không tràn. Đã quan sát screenshot homepage desktop và mobile, khung C ở 390.
- Tái hiện lỗi click giữa button Bắt đầu từ đây mở Cookies ở 390 trước sửa; sau sửa cùng locator mở đúng Bắt đầu từ đây ở 390 và 1440.
- Vào bài mẫu, đổi tab, lưu ghi chú báo Đã lưu trên thiết bị này; đóng về tủ đạt.
- Chưa kiểm video thật/playback liên tục, Safari, mọi motion/reduced-motion, hoặc quyền LMS. Không có video thật trong repo. Đây là smoke test preview, không phải nghiệm thu production.
- Chưa merge/deploy web Sonneto chính. Workflow build artifact chưa đồng nghĩa deploy.
