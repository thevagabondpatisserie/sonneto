// Chạy: node --test frontend/kiem-thu/tu.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mauNgan, nhanHinhThuc, thangHoc, boDau, locKhoa, docDaLuu, ghiDaLuu, doiLuu, khoaKe, dongChuanBi, trangThaiGhiDanh } from '../src/tu.js'

const ds = [
  { ma: 'buche', ten: 'Bûche de Noël', moTa: 'Cuộn bông lan', hinhThuc: 'Online', soBai: 10, hoSo: { phieuCan: { ten: 'Bông lan', dong: [['Bơ chảy', '30 g']] } } },
  { ma: 'tart', ten: 'Tart theo mùa', moTa: 'Vỏ giòn', hinhThuc: 'Tại bếp', thoiLuong: '1 ngày', hoSo: { mau: 'tim' } },
  { ma: 'gia-von', ten: 'Tính giá vốn', moTa: 'Bảng tính', hinhThuc: 'Online', soBai: 6 },
]

test('màu ngăn theo vị trí, theo màu chọn, và tab phụ đúng nhịp bản mẫu', () => {
  assert.equal(mauNgan(ds[0], 0).nen, '#870854')
  assert.equal(mauNgan(ds[1], 1).nen, '#70217e') // chọn "tim" trong Frappe
  assert.equal(mauNgan({}, 9).nen, '#fb7123') // vòng lại sau 8 màu
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6, 7].map((i) => mauNgan({}, i).coPhu), [false, true, false, true, true, false, true, false])
  assert.equal(mauNgan({}, 4).phuChu, '#222')
})

test('nhãn hình thức và thời gian học', () => {
  assert.equal(nhanHinhThuc(ds[0]), 'Online, 10 bài')
  assert.equal(nhanHinhThuc(ds[1]), 'Tại bếp, 1 ngày')
  assert.equal(nhanHinhThuc({}), 'Online')
  assert.equal(thangHoc({}), '6 tháng')
  assert.equal(thangHoc({ soNgayHoc: 90 }), '3 tháng')
  assert.equal(thangHoc({ soNgayHoc: 45 }), '45 ngày')
})

test('tìm có dấu hay không dấu đều ra, kể cả nguyên liệu trong phiếu cân', () => {
  assert.equal(boDau('Bơ Đường'), 'bo duong')
  assert.deepEqual(locKhoa(ds, 'bo chay').map((k) => k.ma), ['buche'])
  assert.deepEqual(locKhoa(ds, 'TẠI BẾP').map((k) => k.ma), ['tart'])
  assert.equal(locKhoa(ds, '').length, 3)
  assert.deepEqual(locKhoa(ds, '', true, ['gia-von']).map((k) => k.ma), ['gia-von'])
})

test('lưu khoá theo mã, chịu được bộ nhớ hỏng hoặc bị chặn', () => {
  const kho = { d: {}, getItem(k) { return this.d[k] ?? null }, setItem(k, v) { this.d[k] = v } }
  assert.deepEqual(docDaLuu(kho), [])
  assert.equal(ghiDaLuu(kho, doiLuu([], 'tart')), true)
  assert.deepEqual(docDaLuu(kho), ['tart'])
  assert.deepEqual(doiLuu(['tart'], 'tart'), [])
  kho.d['sonneto-da-luu'] = '{hỏng'
  assert.deepEqual(docDaLuu(kho), [])
  kho.d['sonneto-da-luu'] = '[1,"buche"]'
  assert.deepEqual(docDaLuu(kho), ['buche'])
  const chan = { getItem() { throw new Error('chặn') }, setItem() { throw new Error('chặn') } }
  assert.deepEqual(docDaLuu(chan), [])
  assert.equal(ghiDaLuu(chan, ['x']), false)
  assert.deepEqual(docDaLuu(null), [])
})

test('khoá kế tiếp vòng lại đầu, phiếu cân thành dòng chuẩn bị', () => {
  assert.equal(khoaKe(ds, 'buche'), 'tart')
  assert.equal(khoaKe(ds, 'gia-von'), 'buche')
  assert.equal(khoaKe([], 'x'), null)
  assert.deepEqual(dongChuanBi(ds[0].hoSo.phieuCan), ['30 g Bơ chảy'])
  assert.deepEqual(dongChuanBi(null), [])
})

test('trạng thái ghi danh: chưa ghi danh, còn hạn, sắp hết, hết hạn', () => {
  const gd = [{ khoa: 'buche', hetHan: '2027-03-19', baiTiep: 'b4' }, { khoa: 'tart', hetHan: '2026-11-05' }, { khoa: 'gia-von', hetHan: '2026-10-02' }]
  assert.equal(trangThaiGhiDanh(gd, 'khac', '2026-11-01'), null)
  assert.deepEqual(trangThaiGhiDanh(gd, 'buche', '2026-11-01'), { trangThai: 'con', baiTiep: 'b4' })
  assert.equal(trangThaiGhiDanh(gd, 'tart', '2026-11-01').trangThai, 'sap')
  assert.equal(trangThaiGhiDanh(gd, 'gia-von', '2026-11-01').trangThai, 'het')
})
