// Một cửa duy nhất lấy dữ liệu. Chế độ preview dùng dữ liệu mẫu (nạp riêng, không vào bản build thật);
// trên site thật gọi các hàm của app sonneto (bọc Frappe Learning), xem sonneto/api.py.

const XEM_THU = import.meta.env.MODE === 'preview'
const mau = () => import('./data/mau.js')

async function goi(ham, thamSo = {}) {
  const qs = new URLSearchParams(thamSo).toString()
  const res = await fetch(`/api/method/sonneto.api.${ham}${qs ? '?' + qs : ''}`, {
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
  })
  if (res.status === 403 || res.status === 401) {
    let thongDiep = 'Cần đăng nhập để xem mục này.'
    try {
      const j = await res.json()
      const m = JSON.parse(j._server_messages || '[]')[0]
      if (m) thongDiep = JSON.parse(m).message || thongDiep
    } catch { /* giữ câu mặc định */ }
    const loi = new Error(thongDiep)
    loi.canDangNhap = res.status === 401 || /đăng nhập/i.test(thongDiep)
    throw loi
  }
  if (!res.ok) throw new Error('Chưa tải được dữ liệu. Anh chị tải lại trang giúp.')
  return (await res.json()).message
}

export async function layKhoaHoc() {
  return XEM_THU ? (await mau()).khoaHoc : goi('danh_sach_khoa')
}

export async function layKhoaCuaToi() {
  if (!XEM_THU) return goi('khoa_cua_toi')
  const m = await mau()
  return { hocVien: m.hocVien, ghiDanh: m.ghiDanh, khoaHoc: m.khoaHoc }
}

export async function layBaiHoc(khoa, bai) {
  return XEM_THU ? (await mau()).baiHoc : goi('bai_hoc', { khoa, bai })
}
