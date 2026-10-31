<template>
  <header class="dau">
    <div class="wrap dau__hang">
      <RouterLink to="/" class="logo">Sonneto</RouterLink>
      <nav class="dau__menu" aria-label="Điều hướng chính">
        <a href="#khoa-hoc" @click.prevent="cuonToi('khoa-hoc')">Khoá học</a>
        <a href="#tai-bep" @click.prevent="cuonToi('tai-bep')">Lớp tại bếp</a>
        <a href="#cho-quan" @click.prevent="cuonToi('cho-quan')">Làm bánh cho quán</a>
        <RouterLink to="/khoa-cua-toi" class="dau__dangnhap">Đăng nhập</RouterLink>
      </nav>
    </div>
  </header>

  <main>
    <section class="mo-dau">
      <img class="mo-dau__anh" :src="anh('8054')" alt="Học viên làm bánh bûche de Noël tại bếp Sonneto" width="1800" height="1200" fetchpriority="high">
      <div class="mo-dau__phu" aria-hidden="true"></div>
      <div class="wrap mo-dau__chu">
        <h1 class="display-xl">Học làm bánh.<br>Làm bánh cho quán của bạn.</h1>
        <div class="mo-dau__ben">
          <p class="lead">Lớp online, lớp tại bếp, và nhận làm bánh riêng cho quán cà phê, nhà hàng, chuỗi.</p>
          <div class="hang-nut">
            <NutBam href="#khoa-hoc" @click.prevent="cuonToi('khoa-hoc')">Xem khoá học</NutBam>
            <NutBam kieu="phu" href="#cho-quan" @click.prevent="cuonToi('cho-quan')">Đặt làm bánh cho quán</NutBam>
          </div>
        </div>
      </div>
    </section>

    <section class="wrap gioi-thieu">
      <p class="statement">Mỗi công thức được cân theo gram, làm thử nhiều mẻ, rồi mới tới tay học viên.</p>
      <p class="muted">Học xong mang về bảng định lượng, các bước gắn theo phút trong video, và chỗ hỏi lại giảng viên khi mẻ bánh ở nhà không ra như ở lớp.</p>
    </section>

    <section id="khoa-hoc" class="wrap muc">
      <div class="muc__dau">
        <h2 class="display-l" tabindex="-1">Khoá học</h2>
        <p class="muted">Mỗi khoá là một hồ sơ. Bấm vào để mở.</p>
      </div>
      <p v-if="loi" class="thong-bao">{{ loi }}</p>
      <TuHoSo v-else-if="khoaHoc.length" :khoa="khoaHoc" />
    </section>

    <section id="tai-bep" class="tai-bep">
      <div class="wrap tai-bep__luoi">
        <div class="tai-bep__trai">
          <div class="tai-bep__chu">
            <h2 class="display-l" tabindex="-1">Lớp tại bếp</h2>
            <p class="muted">Mỗi người một bàn làm việc, nguyên liệu cân sẵn. Giảng viên đi từng bàn, chỉ tay vào chỗ cần sửa. Cuối buổi mang bánh về.</p>
          </div>
          <img :src="anh('7640')" alt="Giảng viên hướng dẫn rải crumble lên khay" class="tai-bep__nho" loading="lazy" width="1200" height="900">
        </div>
        <img :src="anh('9280')" alt="Học viên đổ mousse vào khuôn" class="tai-bep__lon" loading="lazy" width="1200" height="1800">
      </div>
    </section>

    <section id="cho-quan" class="wrap muc">
      <div class="muc__dau">
        <h2 class="display-l" tabindex="-1">Làm bánh cho quán của bạn</h2>
        <p class="muted rong-420">Cho quán cà phê, nhà hàng, khách sạn và chuỗi muốn có món bánh riêng.</p>
      </div>
      <ol class="buoc">
        <li v-for="(b, i) in cacBuoc" :key="i">
          <span class="buoc__so">Bước {{ i + 1 }}</span>
          <span class="title">{{ b.ten }}</span>
          <span class="muted">{{ b.moTa }}</span>
        </li>
      </ol>
      <p class="muted rong-720">Ký thoả thuận bảo mật trước khi bắt đầu. Công thức giao xong thuộc về quán. Giá tính theo gói trọn, hoặc phí phát triển kèm đơn sản xuất, nói rõ từ buổi đầu.</p>
    </section>

    <section id="lien-he" class="lien-he">
      <div class="wrap lien-he__luoi">
        <div class="lien-he__chu">
          <h2 class="display-l" tabindex="-1">Để lại số, Sonneto gọi lại trong ngày.</h2>
          <p>Khoá học mở bán, anh chị nhận tin trước.</p>
        </div>
        <form class="form" @submit.prevent="gui" novalidate>
          <fieldset class="chon">
            <legend>Anh chị quan tâm</legend>
            <label :class="{ dang: form.can === 'khoa' }"><input type="radio" v-model="form.can" value="khoa">Khoá học</label>
            <label :class="{ dang: form.can === 'quan' }"><input type="radio" v-model="form.can" value="quan">Làm bánh cho quán</label>
          </fieldset>
          <div class="hai-o">
            <label class="o" for="lh-ten">Tên<input id="lh-ten" v-model.trim="form.ten" autocomplete="name"></label>
            <label class="o" for="lh-sdt">Điện thoại hoặc Zalo<input id="lh-sdt" v-model.trim="form.sdt" type="tel" autocomplete="tel" :aria-invalid="loiSdt ? 'true' : 'false'" aria-describedby="lh-trangthai"></label>
          </div>
          <label class="o" for="lh-loi">Vài dòng về việc anh chị cần<textarea id="lh-loi" v-model.trim="form.loiNhan" rows="3"></textarea></label>
          <NutBam kieu="toi" type="submit" :disabled="dangGui">{{ dangGui ? 'Đang gửi' : 'Gửi yêu cầu' }}</NutBam>
          <p id="lh-trangthai" class="trang-thai" role="status" aria-live="polite">{{ trangThaiGui }}</p>
        </form>
      </div>
    </section>
  </main>

  <footer class="wrap chan">
    <span class="logo logo--nho">Sonneto</span>
    <span>Bếp thử nghiệm và lớp học làm bánh, TP. Hồ Chí Minh</span>
  </footer>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import NutBam from '@/components/NutBam.vue'
import TuHoSo from '@/components/TuHoSo.vue'
import { layKhoaHoc } from '@/api.js'
import { cuonToi } from '@/cuon.js'

const anh = (so) => `${import.meta.env.BASE_URL}anh/${so}.jpg`
const khoaHoc = ref([])
const loi = ref('')

onMounted(async () => {
  try { khoaHoc.value = await layKhoaHoc() } catch (e) { loi.value = e.message }
})

const cacBuoc = [
  { ten: 'Nghe quán cần gì', moTa: 'Món muốn bán, giá muốn bán, bếp đang có máy gì, mỗi ngày bán bao nhiêu.' },
  { ten: 'Làm mẫu, nếm cùng nhau', moTa: 'Vài phương án, sửa tới khi chủ quán gật đầu.' },
  { ten: 'Giao công thức, dạy bếp làm', moTa: 'Định lượng theo gram, giá vốn, hạn dùng. Theo bếp của quán tới khi ra đều tay.' },
]

const form = reactive({ can: 'khoa', ten: '', sdt: '', loiNhan: '' })
const loiSdt = ref(false)
const dangGui = ref(false)
const trangThaiGui = ref('')

async function gui() {
  const so = form.sdt.replace(/[^\d+]/g, '')
  loiSdt.value = so.replace('+', '').length < 9
  if (loiSdt.value) {
    trangThaiGui.value = 'Anh chị cho xin số điện thoại hoặc Zalo để Sonneto gọi lại.'
    document.getElementById('lh-sdt').focus()
    return
  }
  if (import.meta.env.MODE === 'preview') {
    trangThaiGui.value = 'Đây là bản xem thử nên yêu cầu chưa được gửi đi.'
    return
  }
  dangGui.value = true
  trangThaiGui.value = ''
  try {
    const res = await fetch('/api/method/sonneto.api.gui_yeu_cau', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ can: form.can, ten: form.ten, sdt: so, loi_nhan: form.loiNhan }),
    })
    if (!res.ok) throw new Error()
    trangThaiGui.value = 'Đã nhận. Sonneto sẽ gọi lại trong ngày.'
    Object.assign(form, { ten: '', sdt: '', loiNhan: '' })
  } catch {
    trangThaiGui.value = 'Chưa gửi được. Anh chị thử lại, hoặc nhắn Zalo cho Sonneto.'
  } finally {
    dangGui.value = false
  }
}
</script>

<style scoped>
.dau { position: absolute; inset: 0 0 auto; z-index: 2; padding-top: env(safe-area-inset-top, 0px); }
.dau__hang { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-4); padding-block: 18px; }
.logo { font-family: var(--font-display); font-size: 34px; font-weight: 400; text-decoration: none; color: var(--cream); }
.logo--nho { font-size: 24px; }
.dau__menu { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2) 28px; font-size: 15px; }
.dau__menu a { text-decoration: none; min-height: var(--touch-min); display: inline-flex; align-items: center; }
.dau__dangnhap { padding: 0 20px; border: 1px solid rgba(242, 236, 228, .55); border-radius: var(--radius-pill); }
@media (max-width: 760px) { .dau__menu a:not(.dau__dangnhap) { display: none; } .logo { font-size: 28px; } }

.mo-dau { position: relative; min-height: 640px; height: 780px; max-height: 92vh; overflow: hidden; display: flex; align-items: flex-end; }
.mo-dau__anh { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 40%; }
.mo-dau__phu { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(26,20,17,.55) 0%, rgba(26,20,17,.05) 30%, rgba(26,20,17,.25) 55%, rgba(26,20,17,.94) 100%); }
.mo-dau__chu { position: relative; width: 100%; display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: var(--space-8); padding-bottom: 64px; }
.mo-dau__chu h1 { max-width: 820px; text-wrap: balance; }
.mo-dau__ben { display: flex; flex-direction: column; gap: 22px; max-width: 360px; }
.hang-nut { display: flex; flex-wrap: wrap; gap: var(--space-3); }

.gioi-thieu { display: flex; flex-wrap: wrap; gap: 40px 80px; align-items: baseline; padding-block: var(--space-28) 96px; }
.gioi-thieu .statement { flex: 2 1 520px; }
.gioi-thieu .muted { flex: 1 1 280px; }

.muc { display: flex; flex-direction: column; gap: 40px; padding-block: 0 120px; }
.muc__dau { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: var(--space-3); border-top: 1px solid var(--line); padding-top: 28px; }
.muc__dau h2:focus { outline: none; }
.hang-the { display: flex; flex-wrap: wrap; gap: 40px var(--space-6); }
.thong-bao { color: var(--warn-fg); }
.rong-420 { max-width: 420px; }
.rong-720 { max-width: 720px; }

.tai-bep { background: var(--chocolate-800); padding-block: 120px; margin-bottom: 120px; }
.tai-bep__luoi { display: flex; flex-wrap: wrap; gap: var(--space-6); }
.tai-bep__trai { flex: 1 1 340px; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; gap: var(--space-8); }
.tai-bep__chu { display: flex; flex-direction: column; gap: 20px; max-width: 380px; }
.tai-bep__nho { width: 100%; height: auto; aspect-ratio: 4 / 3; object-fit: cover; border-radius: var(--radius-photo); }
.tai-bep__lon { flex: 1.4 1 420px; min-width: 0; width: 100%; height: 760px; object-fit: cover; border-radius: var(--radius-photo); }
@media (max-width: 760px) { .tai-bep__lon { height: 480px; } .tai-bep { padding-block: 64px; margin-bottom: 64px; } }

.buoc { margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: var(--space-6); }
.buoc li { flex: 1 1 280px; min-width: 0; display: flex; flex-direction: column; gap: 10px; padding-top: 20px; border-top: 1px solid var(--cream); }
.buoc__so { font-family: var(--font-display); font-size: 22px; color: var(--raspberry); }

.lien-he { background: var(--cream); color: var(--chocolate-900); }
.lien-he__luoi { display: flex; flex-wrap: wrap; gap: var(--space-12) 96px; padding-block: var(--space-28); }
.lien-he__chu { flex: 1 1 340px; min-width: 0; display: flex; flex-direction: column; gap: var(--space-4); }
.lien-he__chu h2 { line-height: 1.02; }
.lien-he__chu p { color: var(--ink-muted); }
.form { flex: 1.3 1 420px; min-width: 0; display: flex; flex-direction: column; gap: 22px; }
.chon { border: 0; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
.chon legend { padding: 0; margin-bottom: 10px; font-size: 14px; color: var(--ink-muted); }
.chon label { min-height: var(--touch-min); padding: 0 18px; display: inline-flex; align-items: center; gap: var(--space-2); border-radius: var(--radius-pill); border: 1px solid var(--chocolate-900); font-size: 15px; cursor: pointer; }
.chon label.dang { background: var(--chocolate-900); color: var(--cream); }
.chon input { accent-color: var(--raspberry); }
.hai-o { display: flex; flex-wrap: wrap; gap: 22px; }
.hai-o .o { flex: 1 1 220px; }
.o { display: flex; flex-direction: column; gap: 6px; font-size: 14px; color: var(--ink-muted); }
.o input, .o textarea { min-height: 48px; border: 0; border-bottom: 1px solid var(--chocolate-900); background: transparent; color: var(--chocolate-900); font-size: 17px; padding: 8px 0; border-radius: 0; }
.o textarea { resize: vertical; }
.o input[aria-invalid="true"] { border-bottom-color: #9A2335; }
.form :deep(.nut) { align-self: flex-start; }
.trang-thai { min-height: 1.5em; color: var(--chocolate-900); font-weight: 400; }

.chan { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: var(--space-3); padding-block: 36px; color: var(--muted); font-size: 14px; }
</style>
