<template>
  <div class="st">
    <header>
      <nav aria-label="Điều hướng">
        <RouterLink to="/" class="nut">Khám phá</RouterLink>
        <button type="button" class="nut an-hep" @click="moCachHoc">Cách học</button>
        <RouterLink :to="{ path: '/', query: { luu: '1' } }" class="nut">Đã lưu <span class="count">{{ daLuu.length }}</span></RouterLink>
        <component :is="taiKhoan.la" v-bind="taiKhoan.thuoc" class="nut chi-hep">{{ taiKhoan.chu }}</component>
      </nav>
      <RouterLink class="logo" to="/" aria-label="Sonneto trang chủ">Sonneto<span>baking studio</span></RouterLink>
      <div class="right">
        <button type="button" class="nut" :aria-expanded="dangTim ? 'true' : 'false'" @click="batTim">⌕ <span>Tìm khoá học</span></button>
        <component :is="taiKhoan.la" v-bind="taiKhoan.thuoc" class="nut tai-khoan">{{ taiKhoan.chu }}</component>
      </div>
    </header>

    <!-- TỦ KHOÁ HỌC -->
    <main v-if="!maMo" class="home">
      <div class="intro">
        <p>SONNETO / MỖI NGÀY MỘT CHÚT NGỌT</p>
        <h1>Mở một ngăn.<br class="mobile"> Học một món bánh.</h1>
        <div class="intro-bottom">
          <span>{{ chiDaLuu ? 'Những khoá anh chị đã lưu trên thiết bị này.' : 'Một tủ đầy những điều muốn thử.' }}</span>
          <span class="hint">Rê chuột để hé mở · Bấm để khám phá ↘</span>
        </div>
        <input v-if="dangTim" id="tim" ref="oTim" v-model="tim" type="search" placeholder="Tìm bánh, nguyên liệu…" aria-label="Tìm khoá học">
      </div>

      <p v-if="dangTai" class="trang-thai" role="status">Đang mở tủ…</p>
      <div v-else-if="loi" class="trang-thai" role="alert">
        <p>Chưa mở được tủ. {{ loi }}</p>
        <button type="button" class="vien" @click="taiKhoa">Thử lại</button>
      </div>
      <div v-else-if="!khoaHoc.length" class="trang-thai">
        <p>Tủ đang được xếp. Khoá học mở bán sẽ nằm ở đây.</p>
        <button type="button" class="vien" @click="moLienHe()">Để lại số để nhận tin trước</button>
      </div>
      <div v-else-if="hien.length" ref="tuEl" class="folders">
        <article
          v-for="{ k, i } in hien"
          :key="k.ma"
          class="folder"
          :style="{ '--color': mau(k, i).nen, '--text': mau(k, i).chu, '--alt': mau(k, i).phuNen, '--alt-text': mau(k, i).phuChu }"
        >
          <RouterLink class="tab" :to="duong(k)" :aria-label="`Mở khoá ${k.ten}`"><span class="tab-chu">{{ k.ten }}</span></RouterLink>
          <RouterLink v-if="mau(k, i).coPhu" class="tab alt-tab" :to="duong(k)" tabindex="-1" aria-hidden="true"><span class="tab-chu">{{ nhanHinhThuc(k) }}</span></RouterLink>
          <div class="folder-content" @click="router.push(duong(k))">
            <span class="number">{{ soNgan(i) }}<br>SONNETO</span>
            <div class="folder-summary">
              <h2>{{ k.ten }}</h2>
              <p>{{ k.moTa }}</p>
              <RouterLink class="open-label" :to="duong(k)" @click.stop>Mở hồ sơ khoá ↗</RouterLink>
            </div>
            <span class="folder-meta">{{ nhanHinhThuc(k) }}<br>HỌC TRONG {{ thangHoc(k).toUpperCase() }}</span>
          </div>
        </article>
      </div>
      <p v-else id="empty">{{ chiDaLuu ? 'Chưa có khoá đã lưu. Mở một khoá rồi nhấn trái tim nhé.' : 'Chưa tìm thấy khoá nào. Thử “bơ”, “chocolate” hoặc “tart” nhé.' }}</p>

      <footer>
        <span>Học từ những điều căn bản. Làm bằng cả niềm vui.</span>
        <button type="button" class="nut" @click="moLienHe()">Để lại số · Làm bánh cho quán</button>
        <span>SONNETO © 2026</span>
      </footer>
    </main>

    <!-- TRANG GIẤY CỦA MỘT KHOÁ -->
    <section v-else id="lesson" aria-label="Hồ sơ khoá học">
      <div class="breadcrumb">
        <RouterLink to="/" class="nut">← Tủ khoá học</RouterLink>
        <span v-if="khoa">/ {{ khoa.ten }}</span>
        <button v-if="khoa" id="layout" type="button" class="nut" aria-label="Đổi cách xếp giấy" :aria-pressed="xepRoi ? 'true' : 'false'" @click="xepRoi = !xepRoi">▦</button>
      </div>

      <p v-if="dangTai" class="trang-thai" role="status">Đang mở hồ sơ…</p>
      <div v-else-if="loi" class="trang-thai" role="alert">
        <p>Chưa mở được hồ sơ. {{ loi }}</p>
        <button type="button" class="vien" @click="taiKhoa">Thử lại</button>
      </div>
      <div v-else-if="!khoa" class="trang-thai">
        <p>Không tìm thấy khoá này. Có thể khoá đã đóng hoặc đổi tên.</p>
        <RouterLink to="/" class="vien">Về tủ khoá học</RouterLink>
      </div>

      <template v-else>
        <div class="lesson-heading">
          <div>
            <p class="eyebrow">MỞ MỘT TRANG MỚI</p>
            <h1>{{ khoa.ten }}</h1>
          </div>
          <div class="heading-nut">
            <button type="button" class="save" :aria-pressed="daLuuKhoa ? 'true' : 'false'" @click="luu">{{ daLuuKhoa ? '♥ Đã lưu khoá này' : '♡ Lưu khoá này' }}</button>
            <RouterLink v-if="ghiDanh && ghiDanh.trangThai !== 'het'" class="cta" :to="ghiDanh.baiTiep ? `/hoc/${khoa.ma}/${ghiDanh.baiTiep}` : '/khoa-cua-toi'">Vào học →</RouterLink>
            <button v-else-if="ghiDanh" type="button" class="cta" @click="moLienHe('khoa', `Muốn gia hạn khoá ${khoa.ten}.`, 'Gia hạn khoá học.')">Gia hạn khoá này</button>
            <button v-else type="button" class="cta" @click="moLienHe('khoa', `Muốn giữ chỗ khoá ${khoa.ten}.`, 'Giữ chỗ khoá học.')">Giữ chỗ khoá này</button>
          </div>
        </div>

        <div class="board" :class="{ collage: xepRoi }" :style="{ '--board': mau(khoa, viTri).nen }">
          <div class="side-tab">{{ khoa.ten }}</div>
          <article class="pink paper">
            <span class="stamp">KHOÁ HỌC / {{ soNgan(viTri) }}</span>
            <p class="script">Trước khi bắt đầu</p>
            <h2>{{ hs.lamDuoc }}</h2>
            <p>{{ khoa.moTa }}</p>
            <div class="drawing" aria-hidden="true">✳</div>
            <p class="tiny">Chậm một chút. Hiểu thêm một chút.<br>Mẻ bánh tiếp theo sẽ khác.</p>
            <span class="seal">Sonneto</span>
          </article>
          <article class="white paper">
            <span class="stamp">CÔNG THỨC / 02</span>
            <h2>{{ hs.phieuCan?.ten || khoa.ten }}</h2>
            <p class="recipe-meta">SONNETO / {{ nhanHinhThuc(khoa).toUpperCase() }}</p>
            <div class="recipe-columns" :class="{ 'mot-cot': !chuanBi.length }">
              <div v-if="chuanBi.length">
                <h3>Chuẩn bị</h3>
                <ul><li v-for="d in chuanBi" :key="d">{{ d }}</li></ul>
              </div>
              <div>
                <h3>Trong khoá</h3>
                <ol v-if="hs.baiTieuBieu.length"><li v-for="b in hs.baiTieuBieu" :key="b">{{ b }}</li></ol>
                <p v-else class="cho">Danh sách bài sẽ có khi khoá mở bán.</p>
              </div>
            </div>
            <div class="note">
              <b>Ghi chú trong bếp</b>
              <p>Học trong {{ thangHoc(khoa) }} kể từ ngày ghi danh. Xem lại video và công thức theo gram bao nhiêu lần cũng được.</p>
            </div>
            <p class="tiny">{{ XEM_THU ? 'Nội dung mẫu cho bản xem thử.' : 'Phiếu cân trích từ bài học trong khoá.' }}<br>Cân lại mỗi mẻ, ghi số vào sổ.</p>
          </article>
          <aside class="receipt">
            <h3>GHI NHỚ</h3>
            <p>HỌC TRONG<br>{{ thangHoc(khoa).toUpperCase() }}<br>KỂ TỪ NGÀY<br>GHI DANH.</p>
            <span>✧ Sonneto ✧</span>
          </aside>
        </div>

        <div class="lesson-bottom">
          <RouterLink to="/" class="nut">← Chọn một ngăn khác</RouterLink>
          <RouterLink v-if="maKe && maKe !== khoa.ma" :to="`/khoa/${maKe}`" class="nut">Khoá tiếp theo →</RouterLink>
        </div>
      </template>
    </section>

    <dialog ref="hopCachHoc" class="info" aria-labelledby="ch-tieu-de" @click.self="hopCachHoc.close()">
      <button type="button" class="close" aria-label="Đóng" @click="hopCachHoc.close()">×</button>
      <p class="eyebrow">CHÀO MỪNG ĐẾN SONNETO</p>
      <h2 id="ch-tieu-de">Học bằng cách làm.</h2>
      <p>Chọn một ngăn, mở hồ sơ khoá và bắt đầu từ những bước nhỏ. Nhấn trái tim để giữ lại khoá muốn học, danh sách được lưu trên thiết bị này.</p>
      <p>Khoá online học trong 6 tháng kể từ ngày ghi danh, xem lại video và công thức theo gram bao nhiêu lần cũng được. Lớp tại bếp học trực tiếp ở bếp Sonneto. Sonneto cũng nhận lên món và làm bánh cho quán.</p>
      <div class="dialog-hang">
        <button type="button" class="dialog-cta" @click="hopCachHoc.close(); router.push('/')">Mở tủ khoá học ↗</button>
        <button type="button" class="nut" @click="hopCachHoc.close(); moLienHe()">Để lại số</button>
      </div>
    </dialog>

    <HopLienHe :mo="lienHe.mo" :can="lienHe.can" :loi-nhan="lienHe.loiNhan" :tieu-de="lienHe.tieuDe" @dong="lienHe.mo = false" />
    <div class="toast" :class="{ show: thongBao }" role="status">{{ thongBao }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HopLienHe from '@/components/HopLienHe.vue'
import { layKhoaHoc, layKhoaCuaToi, daDangNhap, XEM_THU } from '@/api.js'
import { mauNgan, nhanHinhThuc, thangHoc, locKhoa, docDaLuu, ghiDaLuu, doiLuu, khoaKe, dongChuanBi, trangThaiGhiDanh } from '@/tu.js'

const route = useRoute()
const router = useRouter()

const khoaHoc = ref([])
const dangTai = ref(true)
const loi = ref('')
async function taiKhoa() {
  dangTai.value = true
  loi.value = ''
  try {
    khoaHoc.value = (await layKhoaHoc()) || []
  } catch (e) {
    loi.value = e.message || 'Anh chị tải lại trang giúp.'
  } finally {
    dangTai.value = false
  }
}

// Đăng nhập: học viên thấy "Khoá của tôi", khách thấy "Đăng nhập" (trang đăng nhập của Frappe rồi quay về).
const coDangNhap = daDangNhap()
const taiKhoan = computed(() =>
  coDangNhap
    ? { la: 'RouterLink', thuoc: { to: '/khoa-cua-toi' }, chu: 'Khoá của tôi' }
    : XEM_THU
      ? { la: 'RouterLink', thuoc: { to: '/khoa-cua-toi' }, chu: 'Đăng nhập' }
      : { la: 'a', thuoc: { href: '/login?redirect-to=/khoa-cua-toi' }, chu: 'Đăng nhập' },
)
const ghiDanhDs = ref([])
const homNay = ref(new Date().toISOString().slice(0, 10))
async function taiGhiDanh() {
  if (!coDangNhap) return
  try {
    const d = await layKhoaCuaToi()
    ghiDanhDs.value = d?.ghiDanh || []
    if (d?.hocVien?.homNay) homNay.value = d.hocVien.homNay
  } catch { /* chưa đăng nhập hoặc mạng lỗi: coi như chưa ghi danh, vẫn giữ chỗ được */ }
}

// Tủ: lọc theo tìm kiếm và "Đã lưu". Màu giữ theo vị trí trong tủ đầy đủ, lọc không đổi màu.
const tim = ref('')
const dangTim = ref(false)
const oTim = ref(null)
const chiDaLuu = computed(() => route.query.luu === '1')
const khoKhach = (() => { try { return window.localStorage } catch { return null } })()
const daLuu = ref(docDaLuu(khoKhach))
const hien = computed(() => {
  const loc = new Set(locKhoa(khoaHoc.value, tim.value, chiDaLuu.value, daLuu.value).map((k) => k.ma))
  return khoaHoc.value.map((k, i) => ({ k, i })).filter(({ k }) => loc.has(k.ma))
})
const mau = (k, i) => mauNgan(k, i)
const soNgan = (i) => String((i ?? 0) + 1).padStart(2, '0')
const duong = (k) => `/khoa/${encodeURIComponent(k.ma)}`

async function batTim() {
  if (maMo.value) await router.push('/')
  dangTim.value = !dangTim.value
  if (!dangTim.value) tim.value = ''
  await nextTick()
  oTim.value?.focus()
}

// Trang giấy
const maMo = computed(() => route.params.ma || null)
const viTri = computed(() => khoaHoc.value.findIndex((k) => k.ma === maMo.value))
const khoa = computed(() => khoaHoc.value[viTri.value] || null)
const hs = computed(() => {
  const h = khoa.value?.hoSo || {}
  return { lamDuoc: h.lamDuoc || khoa.value?.moTa || '', baiTieuBieu: h.baiTieuBieu || [], phieuCan: h.phieuCan?.dong?.length ? h.phieuCan : null }
})
const chuanBi = computed(() => dongChuanBi(hs.value.phieuCan))
const maKe = computed(() => khoaKe(khoaHoc.value, maMo.value))
const ghiDanh = computed(() => (khoa.value ? trangThaiGhiDanh(ghiDanhDs.value, khoa.value.ma, homNay.value) : null))
const daLuuKhoa = computed(() => !!khoa.value && daLuu.value.includes(khoa.value.ma))
const xepRoi = ref(false)

function luu() {
  const moi = doiLuu(daLuu.value, khoa.value.ma)
  daLuu.value = moi
  const ok = ghiDaLuu(khoKhach, moi)
  if (!moi.includes(khoa.value.ma)) bao('Đã bỏ lưu khoá này')
  else bao(ok ? 'Đã lưu trên thiết bị này' : 'Đã lưu trong lượt xem này')
}

let henGio
const thongBao = ref('')
function bao(s) {
  thongBao.value = s
  clearTimeout(henGio)
  henGio = setTimeout(() => { thongBao.value = '' }, 2300)
}

const hopCachHoc = ref(null)
function moCachHoc() { hopCachHoc.value?.showModal() }
const lienHe = reactive({ mo: false, can: 'khoa', loiNhan: '', tieuDe: 'Sonneto gọi lại trong ngày.' })
function moLienHe(can = 'khoa', loiNhan = '', tieuDe = 'Sonneto gọi lại trong ngày.') {
  Object.assign(lienHe, { mo: true, can, loiNhan, tieuDe })
}

// Tên khoá dài: thu chữ trên tab cho vừa (tối thiểu 12px), quá nữa thì có dấu ba chấm.
const tuEl = ref(null)
function vuaTab() {
  tuEl.value?.querySelectorAll('.folder').forEach((ngan) => {
    ngan.classList.remove('rong')
    ngan.querySelectorAll('.tab-chu').forEach((el) => thuNho(el, true))
    // Tên vẫn dài ở cỡ nhỏ nhất: trên màn hẹp kéo tab chính rộng ra (ẩn tab phụ của ngăn đó) thay vì cắt chữ.
    const chinh = ngan.querySelector('.tab:not(.alt-tab) .tab-chu')
    if (chinh && chinh.scrollWidth > chinh.clientWidth) {
      ngan.classList.add('rong')
      thuNho(chinh, true)
    }
  })
}
function thuNho(el, tuDau) {
  if (tuDau) el.style.fontSize = ''
  let co = parseFloat(getComputedStyle(el).fontSize)
  while (el.scrollWidth > el.clientWidth && co > 12) {
    co -= 1
    el.style.fontSize = co + 'px'
  }
}
watch(hien, () => nextTick(vuaTab))
let henVua
function khiDoiCo() { clearTimeout(henVua); henVua = setTimeout(vuaTab, 120) }

watch([maMo, khoa], () => {
  xepRoi.value = false
  document.title = khoa.value ? `${khoa.value.ten} | Sonneto` : 'Sonneto | Tủ khoá học'
}, { immediate: true })
watch(chiDaLuu, (v) => { if (v) { tim.value = ''; dangTim.value = false } })

onMounted(async () => {
  window.addEventListener('resize', khiDoiCo)
  // Font Playfair về muộn làm chữ rộng ra: đo lại mỗi khi trình duyệt tải xong font.
  document.fonts?.addEventListener?.('loadingdone', khiDoiCo)
  document.fonts?.ready?.then(() => nextTick(vuaTab))
  await Promise.all([taiKhoa(), taiGhiDanh()])
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', khiDoiCo)
  document.fonts?.removeEventListener?.('loadingdone', khiDoiCo)
  clearTimeout(henGio)
  clearTimeout(henVua)
})
</script>

<style scoped>
/* Lấy nguyên từ design/sonneto-homepage-approved/style.css (bản anh Việt duyệt 01/11/2026),
   gói trong .st để không đổi trang học và Khoá của tôi. */
.st { display: flow-root; min-height: 100vh; background: #1d1d1b; color: #efeee6; font-family: 'Be Vietnam Pro', sans-serif; font-size: 12px; font-weight: 400; line-height: normal;
  --serif: 'Playfair Display', Georgia, serif; --sans: 'Be Vietnam Pro', sans-serif; --mono: 'DM Mono', ui-monospace, monospace; }
:where(.st) p { margin: 1em 0; }
:where(.st) h2 { margin: .83em 0; }
:where(.st) h3 { margin: 1em 0; }
:where(.st) a { color: inherit; text-decoration: none; }
:where(.st) a:hover { color: inherit; }
.st :is(button, a, input) { -webkit-tap-highlight-color: transparent; }
:where(.st) button { font: inherit; color: inherit; cursor: pointer; border: 0; background: none; padding: 0; }
.st :is(button, a):focus-visible { outline: 2px solid #fff; outline-offset: 5px; }

header { height: 76px; border-bottom: 1px solid #ffffff17; display: flex; align-items: center; justify-content: space-between; padding: 0 5.5%; position: relative; }
nav, .right { display: flex; gap: 27px; align-items: center; }
nav .nut, .right .nut { padding: 12px 0; }
.count { font-size: 9px; opacity: .5; }
.chi-hep { display: none; }
.tai-khoan { font-size: 11px; color: #c9c9bd; }
.logo { font-family: var(--serif); font-style: italic; font-size: 32px; line-height: .9; position: absolute; left: 50%; transform: translateX(-50%); }
.logo span { display: block; text-align: center; font: 8px var(--sans); letter-spacing: 2px; margin-top: 8px; }

.intro { padding: 53px 0 46px; max-width: 1040px; margin: auto; }
.intro > p, .eyebrow { font-size: 9px; letter-spacing: 1.4px; color: #90908a; margin: 0 0 15px; }
h1 { font: 400 clamp(30px, 3.7vw, 57px)/1.2 var(--serif); letter-spacing: -2px; margin: 0; }
.intro-bottom { display: flex; justify-content: space-between; color: #99998e; margin-top: 22px; font-size: 10px; }
.hint { font-size: 9px; }
.mobile { display: none; }
.home { padding: 0 8%; }

.folders { position: relative; max-width: 1160px; margin: 0 auto; padding-top: 33px; }
.folder { position: relative; color: var(--text, #fff); background: var(--color); margin-top: 0; transition: filter .3s; isolation: isolate; }
.folder::before { content: ''; position: absolute; inset: -33px 0 0; background: var(--color); clip-path: polygon(0 33px, 1% 33px, 2% 29px, 3.3% 10px, 4.4% 4px, 5.5% 0, 25% 0, 26.2% 4px, 27.3% 11px, 28.6% 27px, 30% 33px, 100% 33px, 100% 100%, 0 100%); z-index: -1; }
.tab { position: absolute; top: -33px; height: 33px; left: 3%; width: 24%; font: 400 clamp(15px, 1.6vw, 24px) var(--serif); white-space: nowrap; padding: 0 8px; display: flex; align-items: center; justify-content: center; }
.tab-chu { display: block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
.alt-tab { left: 36%; width: 27%; font-size: clamp(14px, 1.4vw, 21px); background: var(--alt); color: var(--alt-text); clip-path: polygon(0 100%, 4% 86%, 9% 22%, 15% 0, 85% 0, 91% 22%, 96% 86%, 100% 100%); top: -25px; height: 25px; padding: 0 9%; }
.folder-content { height: 45px; overflow: hidden; transition: height .55s cubic-bezier(.2, .75, .2, 1); display: grid; grid-template-columns: 80px 1fr 190px; align-content: start; padding: 22px 5% 0; gap: 28px; cursor: pointer; }
.folder:last-child .folder-content { height: 220px; }
.folder:hover .folder-content, .folder:focus-within .folder-content { height: 225px; }
.folders:has(.folder:hover) .folder:last-child:not(:hover) .folder-content { height: 90px; }
.folder-content > * { opacity: 0; transform: translateY(10px); transition: opacity .3s, transform .4s; }
.folder:hover .folder-content > *, .folder:focus-within .folder-content > *, .folder:last-child .folder-content > * { opacity: 1; transform: none; }
.number, .folder-meta { font: 9px/1.6 var(--mono); letter-spacing: .2px; }
.folder-summary h2 { font: 400 30px var(--serif); margin: 0 0 13px; }
.folder-summary p { max-width: 330px; font-size: 11px; line-height: 1.8; margin: 0; }
.folder-meta { text-align: right; }
.open-label { display: block; margin-top: 23px; font: 12px var(--sans); }

footer { max-width: 1160px; margin: 28px auto 30px; display: flex; justify-content: space-between; align-items: center; gap: 16px; font-size: 9px; color: #888; }
footer .nut { font-size: 10px; color: #c9c9bd; padding: 12px 0; text-decoration: underline; text-underline-offset: 3px; }
#tim { display: block; background: none; border: 0; border-bottom: 1px solid #777; color: white; width: 100%; margin-top: 24px; padding: 12px 0; font: 16px var(--sans); }
#tim:focus { outline: none; border-bottom-color: #fff; }
#empty, .trang-thai { padding: 50px 0; max-width: 1160px; margin: 0 auto; font-size: 13px; color: #c9c9bd; }
.trang-thai p { margin: 0 0 18px; }
.vien { display: inline-flex; align-items: center; min-height: 44px; border: 1px solid #777 !important; padding: 0 19px !important; border-radius: 30px; }

.breadcrumb { display: flex; gap: 20px; padding: 24px 0; color: #9a9a90; font-size: 10px; align-items: center; }
.breadcrumb #layout { margin-left: auto; font-size: 24px; }
.breadcrumb .nut { padding: 8px 0; }
#lesson { max-width: 1200px; padding: 0 38px; margin: 0 auto; }
.lesson-heading { display: flex; justify-content: space-between; align-items: center; gap: 24px; margin: 12px 0 37px; }
.lesson-heading h1 { font-size: clamp(40px, 6.3vw, 92px); }
.heading-nut { display: flex; flex-direction: column; align-items: stretch; gap: 10px; flex: none; }
.save, .cta { border: 1px solid #777 !important; padding: 14px 19px !important; border-radius: 30px; white-space: nowrap; text-align: center; }
.cta { background: #efeee6 !important; color: #1d1d1b !important; border-color: #efeee6 !important; }
.board { background: var(--board, #2351dd); position: relative; padding: 24px; display: grid; grid-template-columns: 46% 54%; min-height: 620px; margin-right: 27px; align-items: start; }
.paper { position: relative; box-shadow: 0 2px 6px #0002; color: #282a20; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Cpath fill='%23000' opacity='.065' filter='url(%23n)' d='M0 0h200v200H0z'/%3E%3C/svg%3E"); }
.pink { background-color: #e8a4b1; padding: 55px 32px 35px; transform: rotate(-2deg); z-index: 2; min-height: 390px; margin: 28px -13px 0 0; }
.script { font: italic 32px var(--serif); margin: 0 0 22px; }
.pink h2 { font: 400 23px var(--serif); }
.pink > p:not(.script) { font: 14px/1.8 Georgia, serif; max-width: 310px; }
.stamp { position: absolute; right: 17px; top: 17px; transform: rotate(3deg); border: 1px solid #68648199; padding: 6px; font: 9px var(--mono); color: #686481; }
.seal { display: block; text-align: right; font: italic 24px var(--serif); color: #6b5a8d; }
.drawing { font: 100px Georgia; text-align: center; color: #8d3d46; line-height: 1.1; }
.white { background-color: #f3f1e7; padding: 58px 36px 30px 52px; min-height: 595px; }
.white::before { content: ''; position: absolute; left: 14px; top: 36px; bottom: 20px; width: 9px; background: radial-gradient(circle, var(--board) 3px, transparent 4px) 0 0/9px 50px; }
.white h2 { font: italic 42px/1.2 var(--serif); margin: 0 0 16px; }
.recipe-meta { font: 9px var(--mono); padding-bottom: 22px; border-bottom: 1px solid #3333; }
.recipe-columns { display: grid; grid-template-columns: 40% 60%; gap: 12px; }
.recipe-columns.mot-cot { grid-template-columns: 1fr; }
h3 { font: 400 20px var(--serif); }
ul, ol { padding-left: 17px; font: 13px/1.75 Georgia, serif; }
li { margin-bottom: 9px; }
.cho { font: 13px/1.75 Georgia, serif; opacity: .7; }
.note { margin-top: 22px; border-top: 1px solid #3333; padding-top: 20px; font: 13px/1.7 Georgia, serif; }
.tiny { font: 9px/1.6 var(--mono) !important; opacity: .65; margin-top: 28px; }
.receipt { position: absolute; bottom: 25px; left: 13%; width: 160px; min-height: 160px; transform: rotate(7deg); background: #ffe789; color: #323221; padding: 15px 20px; clip-path: polygon(0 4%, 10% 6%, 20% 0, 30% 3%, 43% 0, 55% 4%, 73% 1%, 85% 3%, 100% 0, 100% 96%, 90% 100%, 75% 97%, 60% 100%, 48% 96%, 35% 100%, 20% 96%, 0 100%); }
.receipt h3 { font: 22px var(--mono); margin: 0; }
.receipt p, .receipt span { font: 9px/1.7 var(--mono); }
.side-tab { position: absolute; right: -30px; top: 35px; writing-mode: vertical-rl; background: #ed332b; padding: 28px 9px; border-radius: 0 20px 20px 0; font: 16px var(--serif); max-height: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.board.collage .pink { transform: translate(-35px, 90px) rotate(-5deg); }
.board.collage .receipt { transform: translate(-40px, -390px) rotate(-7deg); }
.paper, .receipt { transition: transform .65s ease; }
.lesson-bottom { display: flex; justify-content: space-between; margin: 25px 27px 40px 0; }
.lesson-bottom .nut { padding: 15px 0; }

.info { background: #f1eddf; color: #25251f; border: 0; padding: 48px; max-width: 460px; width: calc(100% - 32px); font: 12px var(--sans); }
.info::backdrop { background: #0009; backdrop-filter: blur(5px); }
.info h2 { font: 36px var(--serif); }
.info p { line-height: 1.9; }
.close { position: absolute; right: 12px; top: 10px; font-size: 26px !important; min-width: 44px; min-height: 44px; }
.dialog-hang { display: flex; flex-wrap: wrap; align-items: center; gap: 22px; margin-top: 20px; }
.dialog-cta { background: #2251df !important; color: white !important; padding: 15px 20px !important; }
.dialog-hang .nut { text-decoration: underline; text-underline-offset: 3px; padding: 12px 0; }
.toast { position: fixed; bottom: 25px; left: 50%; transform: translate(-50%, 20px); opacity: 0; transition: .3s; background: #f3eddb; color: #222; padding: 14px 25px; border-radius: 3px; pointer-events: none; z-index: 5; }
.toast.show { opacity: 1; transform: translate(-50%, 0); }

@media (min-width: 1600px) {
  .intro { padding-top: 70px; padding-bottom: 60px; }
  .folder-content { height: 52px; }
}
@media (min-width: 701px) {
  .receipt { z-index: 3; bottom: 15px; left: 9%; transform: rotate(7deg) translateY(18px); }
  .board { padding-bottom: 45px; }
}
@media (max-width: 700px) {
  header { height: 86px; padding: 0 6%; }
  nav { gap: 15px; }
  nav .nut { font-size: 10px; }
  .an-hep { display: none; }
  .chi-hep { display: inline; }
  .logo { font-size: 28px; left: auto; right: 6%; transform: none; }
  .right { display: none; }
  .home { padding: 0 5%; }
  .intro { padding: 36px 6px 46px; }
  h1 { font-size: 36px; letter-spacing: -1.4px; }
  .mobile { display: block; }
  .intro > p { font-size: 8px; letter-spacing: .8px; }
  .intro-bottom { display: block; line-height: 1.8; margin-top: 16px; }
  .hint { display: block; margin-top: 5px; font-size: 0; }
  .hint::after { content: 'Chạm vào tên ngăn để mở khoá học ↘'; font-size: 9px; }
  .tab { font-size: 16px; left: 1%; width: 48%; justify-content: center; }
  .folder::before { clip-path: polygon(0 33px, 1% 33px, 3% 27px, 6% 6px, 9% 0, 41% 0, 44% 5px, 48% 29px, 51% 33px, 100% 33px, 100% 100%, 0 100%); }
  .alt-tab { left: 53%; width: 45%; font-size: 13px; padding: 0 7%; }
  .folder.rong .tab:not(.alt-tab) { width: 70%; }
  .folder.rong .alt-tab { display: none; }
  .folder.rong::before { clip-path: polygon(0 33px, 1% 33px, 3% 27px, 6% 6px, 9% 0, 63% 0, 66% 5px, 70% 29px, 73% 33px, 100% 33px, 100% 100%, 0 100%); }
  .folder-content { height: 42px; padding: 23px 6% 0; grid-template-columns: 32px 1fr; gap: 10px; }
  .number { font-size: 7px; }
  .folder-meta { display: none; }
  .folder-summary h2 { font-size: 23px; }
  .folder-summary p { font-size: 10px; }
  .folder:last-child .folder-content { height: 205px; }
  .folder:hover .folder-content, .folder:focus-within .folder-content { height: 205px; }
  .open-label { margin-top: 13px; }
  footer { gap: 12px 20px; line-height: 1.8; font-size: 8px; flex-wrap: wrap; }
  footer span:first-child { max-width: 180px; }
  footer .nut { order: 3; flex-basis: 100%; text-align: left; }
  #lesson { padding: 0 20px; }
  .lesson-heading { display: block; margin-bottom: 25px; }
  .lesson-heading h1 { font-size: 43px; }
  .heading-nut { flex-direction: row; flex-wrap: wrap; margin-top: 20px; }
  .save, .cta { padding: 11px 16px !important; }
  .board { display: flex; flex-direction: column; padding: 14px; margin-right: 18px; gap: 24px; }
  .pink { margin: 0; min-height: 0; width: 100%; padding: 45px 23px 22px; transform: rotate(-1deg); }
  .drawing { display: none; }
  .white { width: 100%; padding: 55px 22px 28px 32px; min-height: 0; }
  .white h2 { font-size: 34px; }
  .recipe-columns { grid-template-columns: 1fr; }
  .recipe-columns h3 { margin-bottom: 10px; }
  .receipt { position: relative; bottom: auto; left: 10%; margin: 0 0 15px; width: 150px; }
  .side-tab { right: -24px; padding: 22px 6px; font-size: 14px; max-height: 220px; }
  .board.collage .pink { transform: rotate(2deg); }
  .board.collage .receipt { transform: rotate(-7deg); }
  #layout { display: none; }
  .breadcrumb { gap: 10px; font-size: 8px; }
  .lesson-bottom { font-size: 10px; }
  .info { padding: 44px 24px 30px; }
}
@media (max-width: 360px) {
  nav { gap: 11px; }
  nav .nut { font-size: 9.5px; }
  .logo { font-size: 23px; }
  .logo span { font-size: 6.5px; letter-spacing: 1.4px; }
}
@media (prefers-reduced-motion: reduce) {
  .st *, .st *::before { transition: none !important; scroll-behavior: auto !important; }
}
</style>
