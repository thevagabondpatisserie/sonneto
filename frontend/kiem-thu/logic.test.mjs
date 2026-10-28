// Chạy: node --test frontend/kiem-thu/logic.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { soNgayConLai, trangThaiHan, ngayViet, luongSauNhan } from '../src/logic.js'

test('số ngày còn lại', () => {
  assert.equal(soNgayConLai('2027-03-19', '2026-10-28'), 142)
  assert.equal(soNgayConLai('2026-10-28', '2026-10-28'), 0)
  assert.equal(soNgayConLai('2026-10-02', '2026-10-28'), -26)
})

test('trạng thái hạn học khớp ngưỡng 14 ngày bên máy chủ', () => {
  assert.equal(trangThaiHan(142), 'con')
  assert.equal(trangThaiHan(14), 'con')
  assert.equal(trangThaiHan(13), 'sap')
  assert.equal(trangThaiHan(0), 'sap')
  assert.equal(trangThaiHan(-1), 'het')
  assert.equal(trangThaiHan(null), 'het')
})

test('ngày kiểu Việt Nam', () => {
  assert.equal(ngayViet('2026-10-02'), '02/10/2026')
})

test('nhân mẻ', () => {
  assert.equal(luongSauNhan({ gam: 250 }, 0.5), '125 g')
  assert.equal(luongSauNhan({ gam: 8 }, 0.5), '4 g')
  assert.equal(luongSauNhan({ gam: 1000 }, 2), '2.000 g')
  assert.equal(luongSauNhan({ soLuong: 1, donVi: 'trái' }, 0.5), '0,5 trái')
})
