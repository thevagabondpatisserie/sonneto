// Dữ liệu MẪU, chỉ dùng khi build chế độ preview (xem thử ngoài Frappe).
// Trên site thật, dữ liệu đến từ Frappe Learning qua src/api.js.
// Tên khoá, số bài, công thức là nội dung mẫu, anh Việt sẽ thay.

const anh = (so) => `${import.meta.env.BASE_URL}anh/${so}.jpg`

export const khoaHoc = [
  {
    ma: 'buche-de-noel',
    ten: 'Bûche de Noël',
    hinhThuc: 'Online',
    soBai: 10,
    moTa: 'Cuộn bông lan không nứt, kem bơ mịn, trang trí cho mùa lễ.',
    anh: anh('8034'),
    anhMoTa: 'Học viên trang trí bánh bûche',
    hoSo: {
      mau: 'cacao',
      lamDuoc: 'Cuộn được bông lan mỏng không nứt, phết kem bơ mịn, trang trí một khúc bûche đủ bán mùa lễ.',
      baiTieuBieu: ['Bông lan cuộn không nứt', 'Kem bơ Ý ổn định', 'Ganache phủ vân gỗ', 'Nấm meringue và trang trí'],
      phieuCan: { ten: 'Bông lan cuộn cacao', dong: [['Trứng', '200 g'], ['Đường', '120 g'], ['Bột mì', '60 g'], ['Bột cacao', '20 g'], ['Bơ chảy', '30 g']] },
    },
  },
  {
    ma: 'fraisier-entremets',
    ten: 'Fraisier và entremets',
    hinhThuc: 'Online',
    soBai: 12,
    moTa: 'Dựng bánh nhiều lớp, mousse đứng khuôn, mặt bánh gọn.',
    anh: anh('9288'),
    anhMoTa: 'Học viên bắt kem lên bánh fraisier',
    hoSo: {
      mau: 'dau',
      lamDuoc: 'Dựng một chiếc fraisier đứng khuôn, mặt cắt dâu đều, lớp mousse không chảy khi ra quầy.',
      baiTieuBieu: ['Bông lan joconde', 'Nhân dâu và gel', 'Đổ mousse và lắp nhân', 'Lớp gương bền trong trời nóng'],
      phieuCan: { ten: 'Mousse vani', dong: [['Sữa tươi', '250 g'], ['Lòng đỏ trứng', '60 g'], ['Đường', '50 g'], ['Gelatin lá', '8 g'], ['Kem tươi 35%', '400 g']] },
    },
  },
  {
    ma: 'banh-nuong-nho',
    ten: 'Bánh nướng nhỏ cho quán cà phê',
    hinhThuc: 'Tại bếp',
    thoiLuong: '1 ngày',
    moTa: 'Madeleine, financier và các món để được cả ngày ở quầy.',
    anh: anh('7584'),
    anhMoTa: 'Khay bánh nướng nhỏ vừa ra lò',
    hoSo: {
      mau: 'bo',
      lamDuoc: 'Nướng được một khay madeleine nở gù và financier giòn mép, để quầy cả ngày vẫn mềm.',
      baiTieuBieu: ['Madeleine nở gù', 'Financier bơ nâu', 'Bánh nướng nhỏ theo mùa', 'Bảo quản và trưng bày ở quầy'],
      phieuCan: { ten: 'Madeleine mật ong', dong: [['Bơ', '125 g'], ['Trứng', '150 g'], ['Đường', '120 g'], ['Bột mì', '125 g'], ['Mật ong', '20 g']] },
    },
  },
  {
    ma: 'gia-von-bep-banh',
    ten: 'Tính giá vốn cho bếp bánh',
    hinhThuc: 'Online',
    soBai: 6,
    moTa: 'Từ công thức ra giá từng chiếc bánh, kèm bảng tính mẫu.',
    anh: anh('7634'),
    anhMoTa: 'Học viên ghi chép công thức',
    hoSo: {
      mau: 'pistachio',
      lamDuoc: 'Tự tính giá vốn từng chiếc bánh từ công thức, biết món nào lời, món nào cần đổi giá.',
      baiTieuBieu: ['Đọc công thức nhiều tầng', 'Hao hụt khi sơ chế', 'Giá vốn từng chiếc', 'Đặt giá bán cho quán'],
      phieuCan: { ten: 'Croissant, 40 chiếc', dong: [['Bột T55', '18.500đ'], ['Bơ lá 82%', '134.400đ'], ['Đường', '2.880đ'], ['Men tươi', '2.400đ'], ['Mỗi chiếc', '4.123đ']] },
    },
  },
]

// Hôm nay giả định 28/10/2026 để ba trạng thái hạn học đều hiện ra.
export const ghiDanh = [
  { khoa: 'fraisier-entremets', daHoc: 3, hetHan: '2027-03-19', baiTiep: 'do-mousse' },
  { khoa: 'gia-von-bep-banh', daHoc: 5, hetHan: '2026-11-06', baiTiep: 'bai-6' },
  { khoa: 'buche-de-noel', daHoc: 6, hetHan: '2026-10-02', baiTiep: 'bai-7' },
]

export const baiHoc = {
  ma: 'do-mousse',
  khoa: 'fraisier-entremets',
  tenKhoa: 'Fraisier và entremets',
  hetHan: '2027-03-19',
  homNay: '2026-10-28',
  thuTu: 4,
  tongBai: 12,
  ten: 'Đổ mousse và lắp nhân',
  thoiLuong: '22:10',
  anhVideo: anh('9280'),
  congThuc: {
    ten: 'Mousse vani',
    choBaoNhieu: { 0.5: 'Đủ cho nửa bánh tròn 18 cm.', 1: 'Đủ cho 1 bánh tròn 18 cm.', 2: 'Đủ cho 2 bánh tròn 18 cm.' },
    nguyenLieu: [
      { ten: 'Sữa tươi', gam: 250 },
      { ten: 'Lòng đỏ trứng', gam: 60 },
      { ten: 'Đường', gam: 50 },
      { ten: 'Gelatin lá', gam: 8 },
      { ten: 'Kem tươi 35%', gam: 400 },
      { ten: 'Vani', soLuong: 1, donVi: 'trái' },
    ],
  },
  danhSach: [
    { phan: 'Phần 1. Nền bánh', bai: [
      { ma: 'bai-1', ten: 'Chọn khuôn, chọn nguyên liệu', thoiLuong: '11:20', xong: true },
      { ma: 'bai-2', ten: 'Bông lan joconde', thoiLuong: '16:05', xong: true },
      { ma: 'bai-3', ten: 'Nhân dâu và gel', thoiLuong: '09:48', xong: true },
      { ma: 'do-mousse', ten: 'Đổ mousse và lắp nhân', thoiLuong: '22:10' },
    ] },
    { phan: 'Phần 2. Hoàn thiện', bai: [
      { ma: 'bai-5', ten: 'Lớp gương bền trong trời nóng', thoiLuong: '14:30' },
      { ma: 'bai-6', ten: 'Cắt lát và đọc mặt cắt', thoiLuong: '12:15' },
      { ma: 'bai-7', ten: 'Fraisier cổ điển', thoiLuong: '18:40' },
    ] },
  ],
  cacBuoc: [
    { phut: '01:10', giay: 70, viec: 'Ngâm gelatin trong nước đá 10 phút.' },
    { phut: '03:40', giay: 220, viec: 'Nấu sữa, lòng đỏ, đường tới 82°C.' },
    { phut: '06:30', giay: 390, viec: 'Cho gelatin vào, để nguội còn 30°C.' },
    { phut: '08:24', giay: 504, viec: 'Trộn kem đánh bông, đổ lớp mousse thứ nhất.' },
    { phut: '12:05', giay: 725, viec: 'Lắp nhân dâu, đổ lớp mousse thứ hai.' },
    { phut: '17:40', giay: 1060, viec: 'Làm phẳng mặt, cấp đông 4 giờ.' },
  ],
}

export const hocVien = { ten: 'Lan', homNay: '2026-10-28' }
