<template>
  <div class="man">
    <header class="wrap dau">
      <RouterLink to="/" class="logo">Sonneto</RouterLink>
      <a href="#" class="tk" :aria-label="`Tài khoản của ${ten}`" @click.prevent>{{ ten.charAt(0) }}</a>
    </header>

    <main class="wrap noi-dung">
      <h1 class="chao">Chào {{ ten }}, học tiếp nhé.</h1>
      <p v-if="loi" class="loi">{{ loi }}</p>
      <p v-else-if="daTai && !the.length" class="muted">Anh chị chưa ghi danh khoá nào. <RouterLink to="/">Xem các khoá học</RouterLink></p>
      <ul class="ds">
        <li v-for="t in the" :key="t.ma" :class="['the', t.trangThai === 'het' && 'the--het']">
          <div class="the__tren">
            <img :src="t.anh" alt="" width="176" height="220">
            <div class="the__chu">
              <NhanHan :so-ngay="t.soNgay" :het-han="t.hetHan" />
              <h2 class="title-s">{{ t.ten }}</h2>
              <div class="tien-do" role="progressbar" :aria-valuenow="t.phanTram" aria-valuemin="0" aria-valuemax="100" :aria-label="`Tiến độ ${t.ten}`"><span :style="{ width: t.phanTram + '%' }"></span></div>
              <span class="muted nho">Đã học {{ t.daHoc }} trên {{ t.soBai }} bài</span>
            </div>
          </div>
          <p v-if="t.trangThai === 'het'" class="muted nho">Gia hạn là học tiếp từ bài {{ t.daHoc + 1 }}, tiến độ vẫn giữ.</p>
          <NutBam v-if="t.trangThai === 'het'" kieu="giahan" rong href="#" @click.prevent>Gia hạn thêm 6 tháng</NutBam>
          <NutBam v-else :kieu="t.dauTien ? 'chinh' : 'phu'" rong :to="`/hoc/${t.ma}/${t.baiTiep}`">Học tiếp bài {{ t.daHoc + 1 }}</NutBam>
        </li>
      </ul>
    </main>

    <nav class="day" aria-label="Điều hướng ứng dụng">
      <RouterLink to="/khoa-cua-toi" aria-current="page">Khoá của tôi</RouterLink>
      <RouterLink to="/">Tất cả khoá</RouterLink>
      <a href="#" @click.prevent>Tài khoản</a>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NutBam from '@/components/NutBam.vue'
import NhanHan from '@/components/NhanHan.vue'
import { layKhoaCuaToi } from '@/api.js'
import { soNgayConLai, trangThaiHan } from '@/logic.js'

const duLieu = ref(null)
const loi = ref('')
const daTai = ref(false)
const ten = computed(() => duLieu.value?.hocVien?.ten || '')

const the = computed(() => {
  if (!duLieu.value) return []
  const { ghiDanh, khoaHoc, hocVien } = duLieu.value
  const ds = ghiDanh.map((g) => {
    const k = khoaHoc.find((x) => x.ma === g.khoa) || {}
    const soNgay = soNgayConLai(g.hetHan, hocVien.homNay)
    return {
      ma: g.khoa, ten: k.ten, anh: k.anh, soBai: k.soBai, daHoc: g.daHoc, hetHan: g.hetHan, baiTiep: g.baiTiep,
      soNgay, trangThai: trangThaiHan(soNgay),
      phanTram: k.soBai ? Math.round((g.daHoc / k.soBai) * 100) : 0,
    }
  })
  const conHoc = ds.filter((t) => t.trangThai !== 'het')
  if (conHoc.length) conHoc[0].dauTien = true
  return ds
})

onMounted(async () => {
  try { duLieu.value = await layKhoaCuaToi() } catch (e) { loi.value = e.message } finally { daTai.value = true }
})
</script>

<style scoped>
.man { min-height: 100vh; padding-bottom: 100px; }
.dau { display: flex; align-items: center; justify-content: space-between; height: 64px; padding-top: env(safe-area-inset-top, 0px); }
.logo { font-family: var(--font-display); font-size: 26px; text-decoration: none; }
.tk { width: var(--touch-min); height: var(--touch-min); border-radius: 50%; background: var(--raspberry); color: var(--chocolate-900); display: inline-flex; align-items: center; justify-content: center; text-decoration: none; font-weight: 500; }
.noi-dung { max-width: 720px; }
.chao { font-family: var(--font-display); font-weight: 300; font-size: 38px; line-height: 1.05; padding: 8px 0 16px; }
.ds { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
.the { display: flex; flex-direction: column; gap: 12px; padding: 12px; border-radius: var(--radius-card); background: var(--chocolate-800); }
.the__tren { display: flex; gap: 14px; }
.the__tren img { width: 88px; height: 110px; flex: 0 0 88px; object-fit: cover; border-radius: var(--radius-photo); }
.the__chu { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.tien-do { height: 3px; background: var(--line); border-radius: 2px; }
.tien-do span { display: block; height: 3px; background: var(--raspberry); border-radius: 2px; }
.the--het img { filter: grayscale(1); opacity: .55; }
.the--het h2 { color: var(--muted); }
.the--het .tien-do span { background: var(--expired); }
.nho { font-size: 13px; }
.loi { color: var(--warn-fg); }

.day { position: fixed; inset: auto 0 0; display: flex; border-top: 1px solid var(--line); background: var(--chocolate-900); padding-bottom: env(safe-area-inset-bottom, 0px); }
.day a { flex: 1; min-height: 56px; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 13px; color: var(--muted); }
.day a[aria-current="page"] { color: var(--cream); box-shadow: inset 0 2px 0 var(--raspberry); }
</style>
