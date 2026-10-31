<template>
  <div ref="tuEl" class="tu" :class="{ 'tu--hep': hep, 'tu--ban': pha !== 'nghi' }" :style="{ height: caoTu + 'px' }" @mouseleave="pha === 'nghi' && (sang = null)">
    <button
      v-for="(k, i) in khoa"
      :key="k.ma"
      :ref="(el) => (biaEls[i] = el)"
      type="button"
      class="bia"
      :class="{ 'bia--sang': sang === i }"
      :style="kieuBia(k, i)"
      :aria-label="`Mở hồ sơ khoá ${k.ten}`"
      @mouseenter="pha === 'nghi' && !hep && (sang = i)"
      @focus="pha === 'nghi' && !hep && (sang = i)"
      @click="mo(i)"
    >
      <span class="bia__tab" :style="{ left: cot(i) + '%', width: (hep ? 62 : 28) + '%' }">
        <svg class="tab-hinh" viewBox="0 0 300 46" preserveAspectRatio="none" aria-hidden="true"><path :d="DUONG_TAB" /></svg>
        <span class="bia__chu">{{ k.ten }}</span>
      </span>
      <span class="bia__than" :style="{ height: than + 'px' }">
        <span class="than">
          <span class="than__so num">{{ soHoSo(i) }}</span>
          <span class="than__mo-ta">{{ k.moTa }}</span>
          <img v-if="k.anh" class="than__anh" :src="k.anh" alt="" loading="lazy" draggable="false">
          <span class="than__meta">{{ metaKhoa(k) }}<br>Học trong {{ thangHoc(k) }}<br><em class="than__mo">Bấm để mở hồ sơ</em></span>
        </span>
      </span>
    </button>
  </div>

  <Teleport to="body">
    <div
      v-if="dangMo"
      ref="manEl"
      class="man"
      :class="{ 'man--bay': pha !== 'mo', 'man--hep': hep }"
      role="dialog"
      aria-modal="true"
      :aria-label="`Hồ sơ khoá ${dangMo.ten}`"
    >
      <div ref="nenEl" class="man__nen" aria-hidden="true"></div>

      <header ref="dauEl" class="man__dau">
        <p class="man__duong">Khoá học<span aria-hidden="true"> / </span>{{ dangMo.ten }}</p>
        <div class="man__nut">
          <button type="button" class="nut-giu" @click="giuCho">Giữ chỗ khoá này</button>
          <button ref="nutDong" type="button" class="nut-dong" @click="dong">Đóng</button>
        </div>
      </header>

      <div class="man__tieu-de">
        <h2 ref="tenEl" class="man__ten">
          <span v-for="(tu, n) in chuTen" :key="n" class="man__tu"><span v-for="(c, m) in tu" :key="m" class="man__chu">{{ c }}</span></span>
        </h2>
        <p ref="metaEl" class="man__meta">{{ metaKhoa(dangMo) }}<br>Học trong {{ thangHoc(dangMo) }} kể từ ngày ghi danh</p>
      </div>

      <div class="canh">
        <div ref="hoSoEl" class="ho-so" :style="kieuHoSo">
          <span v-if="keBen" class="ho-so__tab ho-so__tab--sau" :style="kieuTabMo(keBen.cotTab, mauCua(keBen.k, keBen.i))" aria-hidden="true">
            <svg class="tab-hinh" viewBox="0 0 300 46" preserveAspectRatio="none"><path :d="DUONG_TAB" /></svg>
            <span class="bia__chu">{{ keBen.k.ten }}</span>
          </span>
          <span class="ho-so__tab" :style="kieuTabMo(cot(moIdx), mauCua(dangMo, moIdx))" aria-hidden="true">
            <svg class="tab-hinh" viewBox="0 0 300 46" preserveAspectRatio="none"><path :d="DUONG_TAB" /></svg>
            <span class="bia__chu">{{ dangMo.ten }}</span>
          </span>

          <div class="giay-vung">
            <article
              v-for="g in giayHien"
              :key="g.ma"
              :ref="(el) => (giayEls[g.ma] = el)"
              class="giay"
              :class="`giay--${g.ma}`"
              :style="{ '--x': g.x + '%', '--y': g.y + '%', '--w': g.w + '%', rotate: g.r + 'deg', zIndex: g.z }"
              @pointerdown="batDauKeo($event, g)"
            >
              <template v-if="g.ma === 'gioi-thieu'">
                <span class="lo" aria-hidden="true"><i v-for="n in 6" :key="n"></i></span>
                <span class="thuoc" aria-hidden="true"><i v-for="n in 14" :key="n">{{ n }}</i></span>
                <p class="ghi-chu">Hồ sơ {{ soHoSo(moIdx) }}<br>{{ metaKhoa(dangMo) }}<br>Học trong {{ thangHoc(dangMo) }}</p>
                <h3 class="giay__dau">Học xong, bạn làm được</h3>
                <p v-if="hs.lamDuoc" class="giay__chu-lon">{{ hs.lamDuoc }}</p>
                <p class="giay__chu">{{ dangMo.moTa }}</p>
                <p v-if="hs.baiTieuBieu.length" class="ghi-chu ghi-chu--muc">Một vài bài trong khoá</p>
                <ol class="giay__ds">
                  <li v-for="(b, n) in hs.baiTieuBieu" :key="b"><span class="num">{{ String(n + 1).padStart(2, '0') }}</span>{{ b }}</li>
                </ol>
                <span class="dau-moc" aria-hidden="true">Sonneto<small>bếp thử nghiệm</small></span>
                <p class="giay__chan num" aria-hidden="true">Sonneto, hồ sơ {{ soHoSo(moIdx) }}</p>
              </template>

              <template v-else-if="g.ma === 'phieu'">
                <h3 class="phieu__dau">Phiếu cân</h3>
                <p class="phieu__ten">{{ hs.phieuCan.ten }}</p>
                <dl class="phieu__bang">
                  <div v-for="d in hs.phieuCan.dong" :key="d[0]"><dt>{{ d[0] }}</dt><dd class="num">{{ d[1] }}</dd></div>
                </dl>
                <p class="phieu__chan">Trích từ bài học. Cân lại mỗi mẻ, ghi số vào sổ.</p>
              </template>

              <template v-else-if="g.ma === 'bien-nhan'">
                <svg class="kep" width="30" height="78" viewBox="0 0 30 78" aria-hidden="true"><path d="M9 70V14a6 6 0 0 1 12 0v48a9 9 0 0 1-18 0V22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" /></svg>
                <p class="bien-nhan__dau">PHIẾU GIỮ CHỖ</p>
                <dl class="bien-nhan__bang">
                  <div><dt>Khoá</dt><dd>{{ dangMo.ten }}</dd></div>
                  <div><dt>Hình thức</dt><dd>{{ dangMo.hinhThuc }}</dd></div>
                  <div><dt>Thời gian học</dt><dd>{{ thangHoc(dangMo) }}</dd></div>
                </dl>
                <p class="bien-nhan__ghi">Để lại số ở cuối trang, Sonneto gọi lại trong ngày.</p>
                <svg class="chu-ky" viewBox="0 0 160 46" aria-hidden="true"><path d="M6 34c10-22 20-26 22-14s-8 20 2 14 14-24 20-18-4 22 6 16 12-20 18-14 2 14 12 10 16-12 26-10 18 4 30-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
              </template>

              <template v-else>
                <img :src="dangMo.anh" :alt="dangMo.anhMoTa" draggable="false">
                <p class="anh__chu">{{ dangMo.anhMoTa }}</p>
              </template>
            </article>
          </div>

          <!-- Lớp bìa ngoài: giống hệt thân bìa trong tủ, che giấy lúc mới rút ra rồi mờ đi. -->
          <div ref="baoEl" class="bao" :style="kieuBao" aria-hidden="true">
            <div class="bao__trong" :style="kieuBaoTrong">
              <span class="than">
                <span class="than__so num">{{ soHoSo(moIdx) }}</span>
                <span class="than__mo-ta">{{ dangMo.moTa }}</span>
                <img v-if="dangMo.anh" class="than__anh" :src="dangMo.anh" alt="" draggable="false">
                <span class="than__meta">{{ metaKhoa(dangMo) }}<br>Học trong {{ thangHoc(dangMo) }}</span>
              </span>
            </div>
          </div>
        </div>
        <p v-if="!hep" class="man__goi-y">Kéo các tờ giấy để xem phần bên dưới.</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { cuonToi } from '@/cuon.js'

const props = defineProps({ khoa: { type: Array, required: true } })

/* Tỉ lệ đo từ video mẫu (khung 570px): tab cao 22, mỗi bìa cách nhau 26.5, tab rộng 28%,
   ba cột tab ở 2.6%, 32.6%, 64.9%. Rê chuột vào một bìa, các bìa phía trước lùi xuống 72px. */
const DUONG_TAB = 'M0 46C14 46 18 38 21 28L26 12C29 4 34 0 45 0H255C266 0 271 4 274 12L279 28C282 38 286 46 300 46Z'
const RONG = { tab: 46, buoc: 54, lo: 150, hien: 320, cot: [2.5, 34, 65.5] }
const HEP = { tab: 40, buoc: 46, lo: 0, hien: 240, cot: [3, 35] }

// Màu bìa theo nguyên liệu chính. Chữ sáng hay tối để đọc rõ trên nền.
const MAU = {
  cacao: { nen: '#8B4A2B', chu: '#F2ECE4' },
  dau: { nen: '#C23B4E', chu: '#F2ECE4' },
  bo: { nen: '#D9A55B', chu: '#1A1411' },
  pistachio: { nen: '#7E9A6A', chu: '#1A1411' },
  'mam-xoi': { nen: '#93304F', chu: '#F2ECE4' },
  kem: { nen: '#E4D2B4', chu: '#1A1411' },
}
const THU_TU_MAU = Object.keys(MAU)
const mauCua = (k, i) => MAU[k?.hoSo?.mau] || MAU[THU_TU_MAU[i % THU_TU_MAU.length]]

const tuEl = ref(null)
const biaEls = []
const rongTu = ref(1200)
const hep = computed(() => rongTu.value < 700)
const cfg = computed(() => (hep.value ? HEP : RONG))
const than = computed(() => Math.round(rongTu.value)) // thân bìa vuông: xoay 90 độ vẫn khớp hồ sơ mở
const caoTu = computed(() => (props.khoa.length - 1) * cfg.value.buoc + cfg.value.tab + cfg.value.hien)

const sang = ref(null)
const pha = ref('nghi') // nghi, rut, bay, mo, ve
const moIdx = ref(null)
const dangMo = computed(() => (moIdx.value === null ? null : props.khoa[moIdx.value]))
const keBen = computed(() => {
  const i = moIdx.value
  if (i === null) return null
  const j = i + 1 < props.khoa.length ? i + 1 : i - 1
  return j >= 0 && j !== i ? { k: props.khoa[j], i: j, cotTab: cot(j) } : null
})
const chuTen = computed(() => (dangMo.value ? dangMo.value.ten.split(' ').map((t) => Array.from(t)) : []))

function cot(i) { const c = cfg.value.cot; return c[i % c.length] }
function soHoSo(i) { return String((i ?? 0) + 1).padStart(2, '0') }
function metaKhoa(k) { return k.soBai ? `${k.hinhThuc}, ${k.soBai} bài` : `${k.hinhThuc}, ${k.thoiLuong}` }
function thangHoc(k) { const n = Number(k.soNgayHoc) > 0 ? Number(k.soNgayHoc) : 180; return n % 30 === 0 ? `${n / 30} tháng` : `${n} ngày` }

function kieuBia(k, i) {
  const m = mauCua(k, i)
  const s = sang.value
  const sau = s !== null && i > s
  const noi = s !== null && i >= s
  return {
    '--mau': m.nen, '--chu-bia': m.chu,
    top: `${i * cfg.value.buoc}px`,
    height: `${cfg.value.tab + than.value}px`,
    zIndex: i + 1,
    transform: `translate3d(0, ${sau ? cfg.value.lo : 0}px, ${noi ? 14 : 0}px)`,
  }
}

/* Hồ sơ mở: hộp vuông W x W, tab dọc ở mép phải. Lúc bắt đầu bay, hộp xoay -90 độ và thu
   theo hệ số s = rộng tủ / W nên trùng khít thân bìa trong tủ, tab trùng đúng chỗ. */
const W = ref(900)
const caoMo = ref(null) // màn hẹp: hộp dài ra sau khi đáp
const s0 = computed(() => rongTu.value / W.value)
const tabMo = computed(() => cfg.value.tab / s0.value)
const kieuHoSo = computed(() => {
  const m = mauCua(dangMo.value, moIdx.value)
  return { width: W.value + 'px', height: (caoMo.value ?? W.value) + 'px', '--mau': m.nen, '--chu-bia': m.chu, '--tab': tabMo.value + 'px', '--co-tab': (hep.value ? 18 : 23) / s0.value + 'px' }
})
function kieuTabMo(cotPt, m) {
  const dai = W.value * (hep.value ? 0.62 : 0.28)
  return {
    '--mau': m.nen, '--chu-bia': m.chu, width: dai + 'px', height: tabMo.value + 'px', padding: `0 ${(hep.value ? 26 : 44) / s0.value}px`,
    transform: `translate(${W.value + tabMo.value}px, ${(cotPt / 100) * W.value}px) rotate(90deg)`,
  }
}
const kieuBao = computed(() => ({ width: W.value + 'px', height: W.value + 'px', transform: `translate(${W.value}px, 0) rotate(90deg)` }))
const kieuBaoTrong = computed(() => ({ width: rongTu.value + 'px', height: than.value + 'px', transform: `scale(${1 / s0.value})` }))

// Giấy trong hồ sơ (vị trí theo % hộp, màn rộng). Màn hẹp xếp dọc.
const GIAY = [
  { ma: 'gioi-thieu', x: 40, y: 4, w: 55, r: 0, z: 1 },
  { ma: 'phieu', x: 4, y: 12, w: 40, r: -1, z: 2 },
  { ma: 'bien-nhan', x: 25, y: 47, w: 21, r: 3, z: 4 },
  { ma: 'anh', x: 5, y: 60, w: 24, r: -3.5, z: 3 },
]
const hs = computed(() => {
  const h = dangMo.value?.hoSo || {}
  return { lamDuoc: h.lamDuoc || dangMo.value?.moTa || '', baiTieuBieu: h.baiTieuBieu || [], phieuCan: h.phieuCan?.dong?.length ? h.phieuCan : null }
})
const giayHien = computed(() => GIAY.filter((g) => (g.ma !== 'phieu' || hs.value.phieuCan) && (g.ma !== 'anh' || dangMo.value?.anh)))
const giayEls = {}
let zMax = 4

const manEl = ref(null), nenEl = ref(null), dauEl = ref(null), tenEl = ref(null), metaEl = ref(null)
const hoSoEl = ref(null), baoEl = ref(null), nutDong = ref(null)
const giamChuyenDong = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const doi = (ms) => new Promise((r) => setTimeout(r, ms))

/* Lò xo tắt dần: t tính bằng giây, trả 0 tới 1, có vượt nhẹ khi z < 1. */
function loXo(t, w, z) {
  if (t <= 0) return 0
  const wd = w * Math.sqrt(1 - z * z)
  return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t))
}
const THOI_GIAN_BAY = 1150
function khungBay(dx, dy, s) {
  const N = 56, T = THOI_GIAN_BAY / 1000, ds = []
  for (let n = 0; n <= N; n++) {
    const t = (n / N) * T
    const viTri = loXo(t, 7.6, 0.84)
    const xoay = loXo(t - 0.05, 8.2, 0.74)
    const co = loXo(t, 7.2, 0.9)
    const nang = 80 * Math.sin(Math.PI * Math.min(1, t / 0.62)) // rút hồ sơ lên khỏi ngăn
    const nghieng = 14 * (1 - viTri) + 15 * Math.sin(Math.PI * Math.min(1, t / 0.56))
    const tx = dx * (1 - viTri), ty = dy * (1 - viTri) - nang
    ds.push({ transform: `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) rotateX(${nghieng.toFixed(3)}deg) rotateZ(${(-90 * (1 - xoay)).toFixed(3)}deg) scale(${(s + (1 - s) * co).toFixed(4)})` })
  }
  ds[N] = { transform: 'translate3d(0px, 0px, 0) rotateX(0deg) rotateZ(0deg) scale(1)' }
  return ds
}

let thanGoc = null, hoatAnhTu = [], nhoCuon = 0
function tinhW() {
  const vw = window.innerWidth
  if (hep.value) return Math.max(260, vw - 32 - HEP.tab * 0.9)
  return Math.min(1040, vw - 80 - RONG.tab)
}

async function mo(i) {
  if (pha.value !== 'nghi') return
  const bia = biaEls[i]
  thanGoc = bia.querySelector('.bia__than').getBoundingClientRect()
  W.value = tinhW()
  caoMo.value = null
  Object.values(giayEls).forEach((el) => el && (el.style.translate = ''))
  sang.value = hep.value ? null : i
  moIdx.value = i
  pha.value = 'rut'
  nhoCuon = window.scrollY
  document.documentElement.style.overflow = 'hidden'
  await nextTick()

  if (giamChuyenDong() || !hoSoEl.value.animate) {
    pha.value = 'mo'
    nutDong.value?.focus({ preventScroll: true })
    if (hep.value) moRongHep(false)
    return
  }

  const hoSo = hoSoEl.value
  hoSo.style.visibility = 'hidden'
  dauEl.value.style.opacity = '0'
  tenEl.value.querySelectorAll('.man__chu').forEach((c) => (c.style.opacity = '0'))
  metaEl.value.style.opacity = '0'

  // Bước 1: các bìa phía trước đổ ra sau, bìa phía sau lùi lên, bìa được chọn bị rút lên.
  hoatAnhTu = biaEls.map((el, j) => {
    const tu = getComputedStyle(el).transform
    if (j > i) return el.animate([{ transform: tu, opacity: 1 }, { transform: `translate3d(0, ${360 + (j - i) * 50}px, 0) rotateX(-42deg)`, opacity: 0 }], { duration: 380, delay: (j - i - 1) * 30, easing: 'cubic-bezier(.55,0,.8,.3)', fill: 'forwards' })
    if (j < i) return el.animate([{ transform: tu, opacity: 1 }, { transform: 'translate3d(0, -70px, -40px)', opacity: 0 }], { duration: 320, delay: (i - j - 1) * 20, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' })
    return el.animate([{ transform: tu }, { transform: 'translate3d(0, -24px, 0) rotateX(14deg)' }], { duration: 240, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' })
  })
  nenEl.value.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out', fill: 'forwards' })
  await doi(230)

  // Bước 2: hồ sơ bay ra, xoay 90 độ trong không gian 3D rồi nằm yên ở giữa màn.
  pha.value = 'bay'
  const dich = hoSo.getBoundingClientRect()
  const s = s0.value
  const dx = thanGoc.left + thanGoc.width / 2 - (dich.left + dich.width / 2)
  const dy = thanGoc.top - 24 + thanGoc.height / 2 - (dich.top + dich.height / 2)
  biaEls[i].style.visibility = 'hidden'
  hoSo.style.visibility = ''
  const bay = hoSo.animate(khungBay(dx, dy, s), { duration: THOI_GIAN_BAY, easing: 'linear' })
  baoEl.value.animate([{ opacity: 1, offset: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 0, offset: 0.4 }, { opacity: 0, offset: 1 }], { duration: THOI_GIAN_BAY, fill: 'forwards' })
  tenEl.value.querySelectorAll('.man__chu').forEach((c, n) => {
    c.animate([{ opacity: 0, transform: 'translateY(.32em)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 520, delay: 380 + n * 26, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' })
    c.style.opacity = ''
  })
  for (const [el, tre] of [[dauEl.value, 520], [metaEl.value, 640]]) {
    el.animate([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: tre, easing: 'ease-out', fill: 'backwards' })
    el.style.opacity = ''
  }
  await bay.finished.catch(() => {})
  pha.value = 'mo'
  if (hep.value) moRongHep(true)
  nutDong.value?.focus({ preventScroll: true })
}

// Màn hẹp: hộp vuông lúc bay, nằm yên rồi mới dài ra cho đủ giấy.
function moRongHep(dong) {
  const el = hoSoEl.value
  const cao = el.querySelector('.giay-vung').scrollHeight + 32
  if (dong && el.animate) el.animate([{ height: W.value + 'px' }, { height: cao + 'px' }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' })
  caoMo.value = cao
}

async function dong() {
  if (pha.value !== 'mo') return
  const i = moIdx.value
  const hoSo = hoSoEl.value
  if (giamChuyenDong() || !hoSo.animate) return xong(i)

  pha.value = 've'
  if (hep.value) {
    await hoSo.animate([{ height: hoSo.style.height }, { height: W.value + 'px' }], { duration: 240, easing: 'ease-in' }).finished.catch(() => {})
    caoMo.value = null
    await nextTick()
  }
  const dich = hoSo.getBoundingClientRect()
  const dx = thanGoc.left + thanGoc.width / 2 - (dich.left + dich.width / 2)
  const dy = thanGoc.top - 24 + thanGoc.height / 2 - (dich.top + dich.height / 2)
  const tg = 820
  for (const el of [dauEl.value, metaEl.value, tenEl.value]) el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' })
  baoEl.value.getAnimations().forEach((a) => a.cancel())
  baoEl.value.animate([{ opacity: 0, offset: 0 }, { opacity: 0, offset: 0.55 }, { opacity: 1, offset: 0.88 }, { opacity: 1, offset: 1 }], { duration: tg, fill: 'forwards' })
  await hoSo.animate(khungBay(dx, dy, s0.value).reverse(), { duration: tg, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' }).finished.catch(() => {})

  // Bìa trở về ngăn, các bìa khác dựng lại, lớp nền tan.
  const bia = biaEls[i]
  bia.style.visibility = ''
  hoatAnhTu.forEach((a) => a && a.reverse())
  const mo = nenEl.value.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease-in', fill: 'forwards' })
  hoSo.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' })
  // Lời hứa finished của hoạt ảnh chạy ngược không phải máy nào cũng báo, nên chờ có trần.
  await Promise.race([Promise.all([mo.finished, ...hoatAnhTu.map((a) => a && a.finished)].map((p) => p && p.catch(() => {}))), doi(620)])
  xong(i)
}

function xong(i) {
  hoatAnhTu.forEach((a) => a && a.cancel())
  hoatAnhTu = []
  moIdx.value = null
  pha.value = 'nghi'
  document.documentElement.style.overflow = ''
  window.scrollTo({ top: nhoCuon })
  biaEls[i]?.focus({ preventScroll: true })
}

async function giuCho() {
  await dong()
  cuonToi('lien-he')
}

/* Kéo giấy trên màn rộng: nhấc lên (to hơn chút, bóng sâu hơn), thả ra thì nằm lại chỗ mới. */
let keo = null
function batDauKeo(e, g) {
  if (hep.value || pha.value !== 'mo' || e.button > 0 || e.pointerType === 'touch') return
  const el = giayEls[g.ma]
  e.preventDefault()
  el.style.zIndex = ++zMax
  const [x0, y0] = (el.style.translate || '0px 0px').split(' ').map((v) => parseFloat(v) || 0)
  keo = { el, bx: e.clientX - x0, by: e.clientY - y0 }
  el.setPointerCapture(e.pointerId)
  el.classList.add('giay--keo')
  el.addEventListener('pointermove', dangKeo)
  el.addEventListener('pointerup', thaKeo, { once: true })
  el.addEventListener('pointercancel', thaKeo, { once: true })
}
function dangKeo(e) {
  if (keo) keo.el.style.translate = `${e.clientX - keo.bx}px ${e.clientY - keo.by}px`
}
function thaKeo() {
  if (!keo) return
  keo.el.classList.remove('giay--keo')
  keo.el.removeEventListener('pointermove', dangKeo)
  keo = null
}

function phimTat(e) { if (e.key === 'Escape') dong() }
let quanSat = null
onMounted(() => {
  window.addEventListener('keydown', phimTat)
  quanSat = new ResizeObserver(([m]) => { rongTu.value = m.contentRect.width })
  quanSat.observe(tuEl.value)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', phimTat)
  quanSat?.disconnect()
  document.documentElement.style.overflow = ''
})
</script>

<style scoped>
/* ---------- Tủ hồ sơ ---------- */
.tu { position: relative; overflow: hidden; perspective: 1500px; perspective-origin: 50% 0; }
.tu--ban { pointer-events: none; }
.bia {
  position: absolute; left: 0; right: 0;
  display: block; padding: 0; border: 0; background: none; text-align: left; cursor: pointer;
  color: var(--chu-bia); font: inherit;
  transform-origin: 50% 0;
  transition: transform .46s cubic-bezier(.22, 1, .36, 1);
  will-change: transform;
}
.bia__tab {
  position: absolute; top: 0; height: 46px;
  display: flex; align-items: center; justify-content: center; padding: 0 44px;
  color: var(--chu-bia);
  transition: transform .36s cubic-bezier(.22, 1, .36, 1);
}
.tab-hinh { position: absolute; inset: 0; width: 100%; height: 100%; fill: var(--mau); overflow: visible; }
.bia__chu {
  position: relative; font-family: var(--font-display); font-weight: 500; font-size: 23px; line-height: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-top: 2px;
}
.bia__than {
  position: absolute; top: 46px; left: 0; right: 0;
  background: var(--mau); border-radius: 6px 6px 0 0;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .14), 0 -12px 26px -16px rgba(0, 0, 0, .6);
}
.bia--sang .bia__tab { transform: translateY(-4px); }
.bia:focus-visible { outline: none; }
.bia:focus-visible .bia__chu { text-decoration: underline; text-underline-offset: 4px; }

/* Nội dung trên thân bìa: số hồ sơ, mô tả, ảnh nhỏ, hình thức. Kiểu phiếu lưu trữ. */
.than {
  display: grid; grid-template-columns: 64px 1fr 136px 200px; gap: 0 28px; align-items: start;
  padding: 68px 28px 20px; font-size: 14px; line-height: 1.55; color: var(--chu-bia); /* chừa dải trơn màu như bìa thật */
}
.than__so, .than__meta { font-family: var(--font-mono); font-size: 12.5px; letter-spacing: .02em; opacity: .82; }
.than__mo-ta { font-size: 16px; max-width: 46ch; }
.than__anh { width: 136px; height: 96px; object-fit: cover; border-radius: 2px; box-shadow: 0 0 0 3px rgba(255, 255, 255, .88), 0 8px 18px -8px rgba(0, 0, 0, .6); }
.than__meta { text-align: right; }
.than__mo { display: inline-block; margin-top: 10px; font-style: normal; opacity: 0; transform: translateY(4px); transition: opacity .3s, transform .3s; }
.bia--sang .than__mo { opacity: 1; transform: none; }
.tu--hep .bia__tab { height: 40px; padding: 0 26px; }
.tu--hep .bia__chu { font-size: 18px; }
.tu--hep .bia__than { top: 40px; }
.tu--hep .than { grid-template-columns: 1fr 96px; gap: 10px 16px; padding: 58px 16px 16px; }
.tu--hep .than__so { display: none; }
.tu--hep .than__anh { width: 96px; height: 72px; grid-row: span 2; }
.tu--hep .than__meta { text-align: left; }
.tu--hep .than__mo { display: none; }

/* ---------- Hồ sơ mở ---------- */
.man { position: fixed; inset: 0; z-index: 60; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; color: var(--cream); }
.man--bay { overflow: hidden; }
.man__nen { position: fixed; inset: 0; background: var(--chocolate-900); }
.man__dau {
  position: sticky; top: 0; z-index: 5;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 16px 40px; background: linear-gradient(var(--chocolate-900) 70%, rgba(26, 20, 17, 0));
}
.man__duong { font-size: 13px; color: var(--muted); }
.man__duong span { margin: 0 6px; opacity: .6; }
.man__nut { display: flex; gap: 10px; }
.man__nut button { min-height: 44px; padding: 0 20px; border-radius: var(--radius-pill); font: 500 15px var(--font-body); cursor: pointer; }
.nut-giu { background: var(--cream); color: var(--chocolate-900); border: 0; }
.nut-giu:hover { background: #fff; }
.nut-dong { background: transparent; color: var(--cream); border: 1px solid var(--line-strong); }
.nut-dong:hover { border-color: var(--cream); }
.man__tieu-de { position: relative; display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; padding: 4px 40px 28px; }
.man__ten { font-family: var(--font-display); font-weight: 300; font-size: clamp(44px, 6vw, 84px); line-height: .95; display: flex; flex-wrap: wrap; gap: 0 .24em; }
.man__tu { display: inline-flex; }
.man__chu { display: inline-block; white-space: pre; }
.man__meta { font-family: var(--font-mono); font-size: 12.5px; line-height: 1.6; color: var(--muted); text-align: right; flex: none; }
.canh { position: relative; perspective: 1700px; padding: 0 0 96px; display: flex; flex-direction: column; align-items: center; }
.man__goi-y { margin-top: 20px; font-size: 13px; color: var(--muted); }

.ho-so {
  position: relative; transform-origin: 50% 50%;
  margin-right: var(--tab); /* chừa chỗ cho tab dọc */
  background: var(--mau); border-radius: 6px 0 6px 6px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .08), 0 60px 120px -40px rgba(0, 0, 0, .85);
  will-change: transform;
}
.ho-so::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; background: linear-gradient(160deg, rgba(255, 255, 255, .08), rgba(0, 0, 0, .1)); }
.ho-so__tab { position: absolute; left: 0; top: 0; transform-origin: 0 0; display: flex; align-items: center; justify-content: center; color: var(--chu-bia); z-index: 0; }
.ho-so__tab .bia__chu { font-size: var(--co-tab); }
.ho-so__tab--sau { filter: brightness(.82); }
.bao { position: absolute; left: 0; top: 0; transform-origin: 0 0; background: var(--mau); border-radius: 6px; overflow: hidden; z-index: 30; pointer-events: none; }
.bao__trong { transform-origin: 0 0; }
.giay-vung { position: absolute; inset: 0; z-index: 1; }

/* Giấy */
.giay {
  position: absolute; left: var(--x); top: var(--y); width: var(--w);
  color: #2B211B; cursor: grab; touch-action: none; user-select: none;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .12), 0 18px 34px -16px rgba(0, 0, 0, .55);
  transition: box-shadow .25s, scale .25s cubic-bezier(.22, 1, .36, 1);
}
.giay--keo { cursor: grabbing; scale: 1.02; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 40px 70px -24px rgba(0, 0, 0, .7); }

.giay--gioi-thieu {
  height: 92%; background: #F4EFE6; padding: 48px 56px 48px 96px;
  background-image: radial-gradient(rgba(60, 40, 20, .05) 1px, transparent 1px); background-size: 3px 3px;
}
.lo { position: absolute; left: 28px; top: 6%; bottom: 6%; display: flex; flex-direction: column; justify-content: space-between; }
.lo i { width: 13px; height: 13px; border-radius: 50%; background: var(--mau); box-shadow: inset 0 2px 3px rgba(0, 0, 0, .35); }
.thuoc { position: absolute; right: 14px; top: 8%; bottom: 8%; display: flex; flex-direction: column; justify-content: space-between; border-right: 1px dotted #B3A797; padding-right: 6px; font-family: var(--font-mono); font-size: 9px; color: #9C8F80; }
.thuoc i { font-style: normal; }
.ghi-chu { font-family: var(--font-mono); font-size: 12px; line-height: 1.6; color: #6B5D52; }
.ghi-chu--muc { margin-top: 30px; padding-bottom: 8px; border-bottom: 1px solid #DDD3C6; }
.giay__dau { margin-top: 26px; font-family: var(--font-display); font-style: italic; font-weight: 400; font-size: 48px; line-height: 1; color: #1F1712; }
.giay__chu-lon { margin-top: 20px; font-family: var(--font-display); font-size: 25px; line-height: 1.3; color: #2B211B; }
.giay__chu { margin-top: 16px; font-size: 15px; line-height: 1.7; color: #4A3E36; max-width: 48ch; }
.giay__ds { list-style: none; margin: 0; padding: 0; }
.giay__ds li { display: flex; gap: 18px; padding: 11px 0; border-bottom: 1px dotted #CFC4B5; font-size: 16px; }
.giay__ds .num { font-family: var(--font-mono); font-size: 12px; color: #8A7C6E; padding-top: 3px; }
.dau-moc {
  position: absolute; right: 56px; bottom: 64px; width: 104px; height: 104px; border-radius: 50%;
  border: 2px solid #B8243C; color: #B8243C; transform: rotate(-14deg); opacity: .75;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: 22px; line-height: 1;
}
.dau-moc small { font-family: var(--font-mono); font-size: 8.5px; letter-spacing: .06em; margin-top: 5px; }
.giay__chan { position: absolute; left: 96px; bottom: 22px; font-family: var(--font-mono); font-size: 10px; color: #9C8F80; }

.giay--phieu { background: #E7A9B3; color: #3A1820; padding: 34px 36px 30px; }
.phieu__dau { font-family: var(--font-display); font-style: italic; font-weight: 400; font-size: 46px; line-height: 1; color: #2A0F16; }
.phieu__ten { margin-top: 8px; font-size: 14px; color: #6B2E3A; }
.phieu__bang { margin: 18px 0 0; display: grid; gap: 0; max-width: 360px; }
.phieu__bang div { display: flex; justify-content: space-between; gap: 16px; padding: 7px 0; border-bottom: 1px dotted rgba(58, 24, 32, .35); font-size: 15px; }
.phieu__bang dd { margin: 0; font-family: var(--font-mono); font-size: 13.5px; }
.phieu__chan { margin-top: 16px; font-family: var(--font-mono); font-size: 11px; color: #6B2E3A; }

.giay--bien-nhan {
  background: #F0D88E; color: #2E2410; padding: 34px 22px 34px;
  clip-path: polygon(0 3%, 4% 0, 9% 2.5%, 14% .4%, 20% 3%, 26% .6%, 31% 2.8%, 37% 0, 43% 2.4%, 49% .5%, 55% 3%, 61% .2%, 67% 2.6%, 73% .4%, 79% 2.8%, 85% 0, 91% 2.4%, 96% .6%, 100% 2.6%, 100% 97%, 96% 100%, 90% 97.6%, 84% 99.6%, 78% 97.2%, 72% 99.4%, 66% 97%, 60% 99.8%, 54% 97.4%, 48% 99.6%, 42% 97.2%, 36% 100%, 30% 97.6%, 24% 99.4%, 18% 97%, 12% 99.6%, 6% 97.4%, 0 99.5%);
}
.kep { position: absolute; top: -24px; right: 20px; color: #8D8D8D; filter: drop-shadow(0 2px 1px rgba(0, 0, 0, .3)); }
.bien-nhan__dau { font-family: var(--font-mono); font-weight: 700; font-size: 17px; letter-spacing: .04em; padding-bottom: 10px; border-bottom: 1.5px dashed #8C7A44; }
.bien-nhan__bang { margin: 12px 0 0; display: grid; gap: 8px; }
.bien-nhan__bang dt { font-family: var(--font-mono); font-size: 10px; letter-spacing: .04em; color: #7A6A3C; }
.bien-nhan__bang dd { margin: 1px 0 0; font-size: 14px; line-height: 1.35; }
.bien-nhan__ghi { margin-top: 12px; font-size: 12.5px; line-height: 1.45; color: #5A4A20; }
.chu-ky { display: block; width: 70%; margin-top: 10px; color: #33405E; border: 1.5px solid #6B5A2A; padding: 4px; }

.giay--anh { background: #FBF8F3; padding: 12px 12px 16px; }
.giay--anh img { display: block; width: 100%; aspect-ratio: 4 / 5; object-fit: cover; pointer-events: none; }
.anh__chu { font-family: var(--font-display); font-style: italic; font-size: 18px; margin-top: 10px; color: #4A3E36; }

/* Màn hẹp: giấy xếp dọc, không kéo */
.man--hep .man__dau { padding: 12px 16px; }
.man--hep .man__duong { display: none; }
.man--hep .man__nut { width: 100%; }
.man--hep .man__nut button { flex: 1; }
.man--hep .man__tieu-de { flex-direction: column; align-items: flex-start; padding: 8px 16px 22px; gap: 12px; }
.man--hep .man__meta { text-align: left; }
.man--hep .canh { align-items: flex-start; padding: 0 0 56px 16px; }
.man--hep .ho-so { overflow: visible; }
.man--hep .giay-vung { position: relative; inset: auto; height: 100%; overflow: hidden; display: flex; flex-direction: column; gap: 20px; padding: 16px 14px; }
.man--hep .giay { position: relative; left: auto; top: auto; width: auto; height: auto; cursor: default; touch-action: auto; user-select: auto; }
.man--hep .giay--gioi-thieu { padding: 30px 22px 36px 46px; }
.man--hep .lo { left: 15px; }
.man--hep .thuoc { display: none; }
.man--hep .giay__dau { font-size: 36px; }
.man--hep .giay__chu-lon { font-size: 21px; }
.man--hep .dau-moc { position: relative; right: auto; bottom: auto; margin: 24px 0 0 auto; width: 86px; height: 86px; font-size: 18px; }
.man--hep .giay__chan { left: 46px; bottom: 12px; }
.man--hep .giay--phieu { padding: 26px 22px; }
.man--hep .phieu__dau { font-size: 36px; }
.man--hep .giay--bien-nhan { width: 84%; align-self: flex-end; }
.man--hep .giay--anh { width: 72%; }

@media (prefers-reduced-motion: reduce) {
  .bia, .bia__tab, .giay { transition: none; }
}
</style>
