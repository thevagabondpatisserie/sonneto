// Phép thuần cho tủ khoá học ở trang chủ (bản giao diện anh Việt duyệt 01/11/2026).
// Không chạm DOM hay mạng để kiểm thử được bằng node --test.

import { soNgayConLai, trangThaiHan } from './logic.js'

// Bảng màu bìa của bản đã duyệt, theo thứ tự ngăn từ trên xuống.
export const BANG_MAU = [
  { ma: 'man', nen: '#870854', chu: '#fff' },
  { ma: 'cam', nen: '#fb7123', chu: '#241d13' },
  { ma: 'xanh-reu', nen: '#008a78', chu: '#fff' },
  { ma: 'do', nen: '#ee302c', chu: '#fff' },
  { ma: 'tim', nen: '#70217e', chu: '#fff' },
  { ma: 'xanh-duong', nen: '#2454df', chu: '#fff' },
  { ma: 'hong', nen: '#c7448b', chu: '#fff' },
  { ma: 'xanh-duong', nen: '#2454df', chu: '#fff' },
]
// Tab phụ (nhãn hình thức) chỉ hiện ở vài ngăn để tạo nhịp, đúng bản mẫu: ngăn 2, 4, 5, 7.
const TAB_PHU = { 1: { nen: '#70217e', chu: '#fff' }, 3: { nen: '#2454df', chu: '#fff' }, 4: { nen: '#ffea50', chu: '#222' }, 6: null }

/** Màu một ngăn: theo màu chọn trong Frappe nếu có, không thì theo vị trí. */
export function mauNgan(k, i) {
  const chon = BANG_MAU.find((m) => m.ma === k?.hoSo?.mau)
  const goc = chon || BANG_MAU[i % BANG_MAU.length]
  const vt = i % BANG_MAU.length
  const coPhu = vt in TAB_PHU
  const phu = TAB_PHU[vt] || { nen: goc.nen, chu: goc.chu }
  return { nen: goc.nen, chu: goc.chu, coPhu, phuNen: phu.nen, phuChu: phu.chu }
}

export function thangHoc(k) {
  const n = Number(k?.soNgayHoc) > 0 ? Number(k.soNgayHoc) : 180
  return n % 30 === 0 ? `${n / 30} tháng` : `${n} ngày`
}

/** Nhãn ngắn: "Online, 10 bài" hoặc "Tại bếp, 1 ngày". */
export function nhanHinhThuc(k) {
  const ht = k?.hinhThuc || 'Online'
  if (k?.soBai) return `${ht}, ${k.soBai} bài`
  return k?.thoiLuong ? `${ht}, ${k.thoiLuong}` : ht
}

/** Bỏ dấu tiếng Việt và viết thường, để gõ "bo" vẫn ra "bơ". */
export function boDau(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLocaleLowerCase('vi')
}

function chuCuaKhoa(k) {
  const h = k?.hoSo || {}
  return [k?.ten, k?.moTa, k?.hinhThuc, h.lamDuoc, ...(h.baiTieuBieu || []), h.phieuCan?.ten, ...(h.phieuCan?.dong || []).map((d) => d[0])]
    .filter(Boolean)
    .join(' ')
}

/** Lọc khoá theo chữ tìm (có hay không dấu đều được) và theo danh sách đã lưu. */
export function locKhoa(ds, tim = '', chiDaLuu = false, daLuu = []) {
  const q = boDau(tim).trim()
  return (ds || []).filter((k) => {
    if (chiDaLuu && !daLuu.includes(k.ma)) return false
    return !q || boDau(chuCuaKhoa(k)).includes(q)
  })
}

const KHOA_LUU = 'sonneto-da-luu'
/** Đọc danh sách mã khoá đã lưu. Bộ nhớ trình duyệt hỏng hay bị chặn thì coi như trống. */
export function docDaLuu(kho) {
  try {
    const v = JSON.parse(kho?.getItem(KHOA_LUU) || '[]')
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}
/** Ghi lại. Trả false khi trình duyệt không cho ghi (chế độ riêng tư). */
export function ghiDaLuu(kho, ds) {
  try {
    kho.setItem(KHOA_LUU, JSON.stringify(ds))
    return true
  } catch {
    return false
  }
}
export function doiLuu(ds, ma) {
  return ds.includes(ma) ? ds.filter((x) => x !== ma) : [...ds, ma]
}

/** Mã khoá kế tiếp trong tủ, vòng lại đầu khi tới cuối. */
export function khoaKe(ds, ma) {
  if (!ds?.length) return null
  const i = ds.findIndex((k) => k.ma === ma)
  return ds[(i + 1) % ds.length].ma
}

/** "250 g Sữa tươi" từ một dòng phiếu cân ["Sữa tươi", "250 g"]. */
export function dongChuanBi(phieu) {
  return (phieu?.dong || []).map(([ten, sl]) => `${sl} ${ten}`)
}

/** Trạng thái học viên với một khoá: null khi chưa ghi danh, còn 'con' | 'sap' | 'het'. */
export function trangThaiGhiDanh(ghiDanh, ma, homNay) {
  const g = (ghiDanh || []).find((x) => x.khoa === ma)
  if (!g) return null
  const t = g.hetHan ? trangThaiHan(soNgayConLai(g.hetHan, homNay)) : 'con'
  return { trangThai: t, baiTiep: g.baiTiep || null }
}
