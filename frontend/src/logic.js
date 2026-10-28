// Phép thuần, không chạm mạng hay Frappe, để kiểm thử được riêng.

/** Số ngày còn lại tới hạn học, tính theo ngày lịch (âm là đã hết hạn). */
export function soNgayConLai(hetHan, homNay) {
  const a = Date.UTC(...ngay(homNay))
  const b = Date.UTC(...ngay(hetHan))
  return Math.round((b - a) / 86400000)
}

function ngay(chuoi) {
  const [y, m, d] = String(chuoi).slice(0, 10).split('-').map(Number)
  return [y, m - 1, d]
}

/** Trạng thái hạn học: 'con' (từ 14 ngày), 'sap' (dưới 14 ngày), 'het' (đã hết). */
export function trangThaiHan(soNgay) {
  if (soNgay == null || soNgay < 0) return 'het'
  if (soNgay < 14) return 'sap'
  return 'con'
}

/** dd/mm/yyyy từ yyyy-mm-dd. */
export function ngayViet(chuoi) {
  const [y, m, d] = String(chuoi).slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

/** Lượng nguyên liệu sau khi nhân mẻ, định dạng kiểu Việt Nam (dấu phẩy thập phân). */
export function luongSauNhan(nl, heSo) {
  const tron = (x) => Math.round(x * 10) / 10
  const so = (x) => tron(x).toLocaleString('vi-VN')
  if (nl.gam != null) return `${so(nl.gam * heSo)} g`
  return `${so(nl.soLuong * heSo)} ${nl.donVi}`
}
