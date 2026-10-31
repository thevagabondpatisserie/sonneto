<template>
  <div class="tu" :style="{ height: cao + 'px' }" ref="tuEl">
    <button
      v-for="(k, i) in khoa"
      :key="k.ma"
      ref="bia"
      type="button"
      class="bia"
      :class="{ 'bia--sang': sang === i }"
      :style="kieuBia(k, i)"
      :aria-expanded="moIdx === i ? 'true' : 'false'"
      :aria-label="`Mở hồ sơ khoá ${k.ten}`"
      @mouseenter="sang = i"
      @focus="sang = i"
      @click="mo(i)"
    >
      <span class="bia__tab" :style="{ left: viTriTab(i) }">{{ k.ten }}</span>
      <span class="bia__than">
        <span class="bia__cot">{{ metaKhoa(k) }}</span>
        <span class="bia__cot bia__cot--rong">{{ k.moTa }}</span>
        <span class="bia__cot bia__cot--phai">Học trong 6 tháng<br><span class="bia__mo">Mở hồ sơ</span></span>
      </span>
    </button>
  </div>

  <Teleport to="body">
    <div v-if="moIdx !== null" class="nen" :class="{ 'nen--hien': hien }" @click.self="dong" @keydown.esc="dong">
      <div
        ref="hoSoEl"
        class="ho-so"
        role="dialog"
        aria-modal="true"
        :aria-label="`Hồ sơ khoá ${dangMo.ten}`"
        :style="mauBien(dangMo)"
      >
        <span class="ho-so__gay" aria-hidden="true">{{ dangMo.ten }}</span>

        <div class="giay-vung">
          <article v-for="g in giay" :key="g.ma" class="giay" :class="`giay--${g.ma}`" :style="kieuGiay(g)"
            @pointerdown="batDauKeo($event, g)">
            <template v-if="g.ma === 'gioi-thieu'">
              <span class="lo" aria-hidden="true"><i></i><i></i><i></i></span>
              <p class="giay__nho">Hồ sơ khoá học</p>
              <h2 class="giay__ten">{{ dangMo.ten }}</h2>
              <p class="giay__meta">{{ metaKhoa(dangMo) }}, học trong 6 tháng</p>
              <p>{{ dangMo.moTa }}</p>
              <p class="giay__nho">Một vài bài trong khoá</p>
              <ol class="giay__ds"><li v-for="b in dangMo.hoSo.baiTieuBieu" :key="b">{{ b }}</li></ol>
              <span class="dau-moc" aria-hidden="true">Sonneto<br><small>bếp thử nghiệm</small></span>
            </template>

            <template v-else-if="g.ma === 'anh'">
              <svg class="kep" width="26" height="64" viewBox="0 0 26 64" aria-hidden="true"><path d="M8 58V12a5 5 0 0 1 10 0v40a8 8 0 0 1-16 0V18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
              <img :src="dangMo.anh" :alt="dangMo.anhMoTa" draggable="false">
              <p class="anh__chu">{{ dangMo.anhMoTa }}</p>
            </template>

            <template v-else-if="g.ma === 'phieu'">
              <p class="phieu__dau">Phiếu cân</p>
              <p class="phieu__ten">{{ dangMo.hoSo.phieuCan.ten }}</p>
              <dl>
                <div v-for="d in dangMo.hoSo.phieuCan.dong" :key="d[0]"><dt>{{ d[0] }}</dt><dd class="num">{{ d[1] }}</dd></div>
              </dl>
              <p class="phieu__chan">Cân lại mỗi mẻ. Ghi số vào sổ.</p>
            </template>

            <template v-else>
              <p class="giay__nho">Học xong, bạn làm được</p>
              <p class="the-hong__chu">{{ dangMo.hoSo.lamDuoc }}</p>
            </template>
          </article>
        </div>

        <div class="ho-so__nut">
          <button type="button" class="nut-giu" @click="giuCho">Giữ chỗ khoá này</button>
          <button ref="nutDong" type="button" class="nut-dong" @click="dong">Cất hồ sơ</button>
        </div>
        <p class="ho-so__goi-y" aria-hidden="true">Kéo giấy để xem bên dưới</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { cuonToi } from '@/cuon.js'

const props = defineProps({ khoa: { type: Array, required: true } })

// Màu bìa theo nguyên liệu chính của khoá. Chữ trên bìa chọn sáng hay tối để đọc rõ.
const MAU = {
  cacao: { nen: '#8B4A2B', chu: '#F2ECE4' },
  dau: { nen: '#C23B4E', chu: '#F2ECE4' },
  bo: { nen: '#D9A55B', chu: '#1A1411' },
  pistachio: { nen: '#7E9A6A', chu: '#1A1411' },
}
const thuTuMau = ['cacao', 'dau', 'bo', 'pistachio']
const mauCua = (k, i) => MAU[k.hoSo?.mau] || MAU[thuTuMau[i % thuTuMau.length]]

const TAB = 46, BUOC = 58, LO = 230, DUOI = 150
const sang = ref(0)
const moIdx = ref(null)
const hien = ref(false)
const hoSoEl = ref(null)
const bia = ref([])
const nutDong = ref(null)
const tuEl = ref(null)
const giamChuyenDong = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const cao = computed(() => 8 + (props.khoa.length - 1) * BUOC + TAB + LO + DUOI)
const dangMo = computed(() => (moIdx.value === null ? null : props.khoa[moIdx.value]))

function viTriTab(i) { return `${2 + (i % 3) * 32}%` }
function metaKhoa(k) { return k.soBai ? `${k.hinhThuc}, ${k.soBai} bài` : `${k.hinhThuc}, ${k.thoiLuong}` }
function mauBien(k) {
  const m = mauCua(k, props.khoa.indexOf(k))
  return { '--mau': m.nen, '--chu-bia': m.chu }
}
function kieuBia(k, i) {
  const dich = sang.value !== null && i > sang.value ? LO : 0
  return {
    ...mauBien(k),
    top: `${8 + i * BUOC}px`,
    zIndex: i + 1,
    transform: `translateY(${dich}px)`,
    height: `${TAB + LO + DUOI}px`,
  }
}

// Giấy trong hồ sơ: vị trí ban đầu theo % vùng giấy, kéo được trên màn rộng.
const giay = reactive([
  { ma: 'gioi-thieu', x: 30, y: 4, r: -1.5, z: 2 },
  { ma: 'anh', x: 3, y: 10, r: -5, z: 3 },
  { ma: 'phieu', x: 66, y: 2, r: 4, z: 4 },
  { ma: 'hong', x: 6, y: 56, r: 2.5, z: 5 },
])
let zMax = 5
function kieuGiay(g) {
  return { '--x': g.x + '%', '--y': g.y + '%', '--r': g.r + 'deg', '--dx': (g.dx || 0) + 'px', '--dy': (g.dy || 0) + 'px', zIndex: g.z }
}

let keo = null
function batDauKeo(e, g) {
  if (window.innerWidth < 760 || e.button > 0) return
  if (e.target.closest('a, button')) return
  e.preventDefault()
  g.z = ++zMax
  keo = { g, x0: e.clientX - (g.dx || 0), y0: e.clientY - (g.dy || 0), el: e.currentTarget }
  keo.el.setPointerCapture(e.pointerId)
  keo.el.classList.add('giay--keo')
  keo.el.addEventListener('pointermove', dangKeo)
  keo.el.addEventListener('pointerup', thaKeo, { once: true })
  keo.el.addEventListener('pointercancel', thaKeo, { once: true })
}
function dangKeo(e) {
  if (!keo) return
  keo.g.dx = e.clientX - keo.x0
  keo.g.dy = e.clientY - keo.y0
}
function thaKeo() {
  if (!keo) return
  keo.el.classList.remove('giay--keo')
  keo.el.removeEventListener('pointermove', dangKeo)
  keo = null
}

let tabTruoc = null
async function mo(i) {
  tabTruoc = bia.value[i]
  const tu = tabTruoc.getBoundingClientRect()
  giay.forEach((g) => { g.dx = 0; g.dy = 0 })
  moIdx.value = i
  document.documentElement.style.overflow = 'hidden'
  await nextTick()
  const el = hoSoEl.value
  requestAnimationFrame(() => { hien.value = true })
  if (!giamChuyenDong() && el.animate) {
    // Bìa bay từ chỗ nằm trong tủ ra giữa màn hình, nghiêng nhẹ như rút hồ sơ khỏi ngăn.
    const toi = el.getBoundingClientRect()
    const dx = tu.left + tu.width / 2 - (toi.left + toi.width / 2)
    const dy = tu.top + tu.height / 2 - (toi.top + toi.height / 2)
    const s = Math.min(tu.width / toi.width, 1)
    el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(0deg)`, offset: 0 },
        { transform: `translate(${dx * 0.25}px, ${dy * 0.25 - 30}px) scale(${0.9 + s * 0.05}) rotate(-7deg)`, offset: 0.55 },
        { transform: 'translate(0, 0) scale(1) rotate(0deg)', offset: 1 },
      ],
      { duration: 720, easing: 'cubic-bezier(.2,.7,.2,1)' }
    )
    el.querySelectorAll('.giay').forEach((p, n) => {
      p.animate(
        [{ opacity: 0, translate: '0 80px', rotate: '8deg' }, { opacity: 1, translate: '0 0', rotate: '0deg' }],
        { duration: 520, delay: 420 + n * 90, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }
      )
    })
  }
  nutDong.value?.focus({ preventScroll: true })
}

async function dong() {
  if (moIdx.value === null) return
  const el = hoSoEl.value
  hien.value = false
  if (!giamChuyenDong() && el?.animate) {
    await el.animate(
      [{ transform: 'none', opacity: 1 }, { transform: 'translateY(60px) scale(.94) rotate(3deg)', opacity: 0 }],
      { duration: 280, easing: 'ease-in' }
    ).finished.catch(() => {})
  }
  moIdx.value = null
  document.documentElement.style.overflow = ''
  tabTruoc?.focus({ preventScroll: true })
}

async function giuCho() {
  await dong()
  cuonToi('lien-he')
}

function phimTat(e) { if (e.key === 'Escape' && moIdx.value !== null) dong() }
onMounted(() => window.addEventListener('keydown', phimTat))
onBeforeUnmount(() => { window.removeEventListener('keydown', phimTat); document.documentElement.style.overflow = '' })
</script>

<style scoped>
/* Tủ hồ sơ: các bìa chồng nhau, chỉ lộ tab và một dải. Bìa đang sáng đẩy các bìa sau xuống để lộ thân. */
.tu { position: relative; overflow: hidden; }
.bia {
  position: absolute; left: 0; right: 0;
  display: block; padding: 0; border: 0; background: none; text-align: left; cursor: pointer;
  color: var(--chu-bia); font: inherit;
  transition: transform .5s cubic-bezier(.2,.8,.2,1);
}
.bia__tab {
  position: absolute; top: 0; width: 30%; height: 46px;
  display: flex; align-items: center; justify-content: center; padding: 0 24px;
  background: var(--mau); color: var(--chu-bia);
  font-family: var(--font-display); font-size: 21px; line-height: 1.1; text-align: center;
  clip-path: polygon(6% 0, 94% 0, 100% 100%, 0 100%);
  border-radius: 10px 10px 0 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  transition: transform .3s;
}
.bia__than {
  position: absolute; top: 46px; left: 0; right: 0; bottom: 0;
  background: var(--mau); border-radius: 0 6px 6px 6px;
  box-shadow: 0 -1px 0 rgba(0,0,0,.18), 0 -18px 30px -24px rgba(0,0,0,.6);
  display: flex; flex-wrap: wrap; gap: 12px 40px; padding: 22px 28px; align-content: flex-start;
  font-size: 15px; line-height: 1.5;
}
.bia__cot { flex: 0 0 150px; opacity: .9; }
.bia__cot--rong { flex: 1 1 260px; font-size: 17px; opacity: 1; }
.bia__cot--phai { text-align: right; }
.bia__mo { display: inline-block; margin-top: 10px; padding: 6px 14px; border: 1px solid currentColor; border-radius: var(--radius-pill); opacity: 0; transform: translateY(6px); transition: opacity .3s, transform .3s; }
.bia--sang .bia__tab { transform: translateY(-6px); }
.bia--sang .bia__mo, .bia:focus-visible .bia__mo { opacity: 1; transform: none; }
.bia:focus-visible { outline: none; }
.bia:focus-visible .bia__tab { outline: 2px solid var(--raspberry); outline-offset: 2px; }

@media (max-width: 760px) {
  .bia__tab { width: 88%; left: 3% !important; font-size: 19px; }
  .bia__cot { flex-basis: 100%; }
  .bia__cot--phai { text-align: left; }
}

/* Hồ sơ mở: phủ màn hình */
.nen {
  position: fixed; inset: 0; z-index: 50;
  background: rgba(14, 10, 8, 0); transition: background .4s;
  display: flex; align-items: center; justify-content: center;
  padding: max(16px, env(safe-area-inset-top, 0px)) max(16px, env(safe-area-inset-right, 0px)) max(16px, env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px));
}
.nen--hien { background: rgba(14, 10, 8, .82); }
.ho-so {
  position: relative; width: min(1180px, 100%); height: min(780px, 100%);
  background: var(--mau); color: var(--chu-bia); border-radius: 8px;
  box-shadow: 0 50px 120px -40px rgba(0,0,0,.9);
  padding: 28px 72px 92px 28px;
  transform-origin: 50% 60%;
}
.ho-so__gay {
  position: absolute; right: -34px; top: 90px; width: 34px; height: 260px;
  background: var(--mau); border-radius: 0 10px 10px 0;
  writing-mode: vertical-rl; display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: 18px;
}
.giay-vung { position: relative; width: 100%; height: 100%; }

.giay {
  position: absolute; left: var(--x); top: var(--y);
  transform: translate(var(--dx), var(--dy)) rotate(var(--r));
  color: #2B211B; cursor: grab; touch-action: none; user-select: none;
  box-shadow: 0 1px 0 rgba(0,0,0,.08), 0 14px 30px -12px rgba(0,0,0,.45);
  transition: box-shadow .2s, rotate .2s;
}
.giay--keo { cursor: grabbing; box-shadow: 0 30px 60px -18px rgba(0,0,0,.6); rotate: 1.5deg; }

.giay--gioi-thieu { width: 44%; min-height: 86%; background: #F4EFE6; padding: 34px 40px 40px 64px; display: flex; flex-direction: column; gap: 12px; font-size: 15px; line-height: 1.6; }
.lo { position: absolute; left: 22px; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: space-around; }
.lo i { width: 12px; height: 12px; border-radius: 50%; background: var(--mau); box-shadow: inset 0 2px 3px rgba(0,0,0,.35); }
.giay__nho { font-size: 13px; color: #6B5D52; }
.giay__ten { font-family: var(--font-display); font-style: italic; font-weight: 400; font-size: 44px; line-height: 1.02; }
.giay__meta { font-size: 14px; color: #6B5D52; border-bottom: 1px solid #D9CFC2; padding-bottom: 12px; }
.giay__ds { margin: 0; padding-left: 20px; display: grid; gap: 4px; }
.dau-moc {
  position: absolute; right: 30px; bottom: 26px; width: 92px; height: 92px; border-radius: 50%;
  border: 2px solid #B8243C; color: #B8243C; transform: rotate(-14deg);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: 20px; line-height: 1; opacity: .8;
}
.dau-moc small { font-family: var(--font-body); font-size: 9px; letter-spacing: .04em; margin-top: 4px; }

.giay--anh { width: 26%; background: #FBF8F3; padding: 12px 12px 14px; }
.giay--anh img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; pointer-events: none; }
.anh__chu { font-family: var(--font-display); font-style: italic; font-size: 17px; margin-top: 8px; color: #4A3E36; }
.kep { position: absolute; top: -22px; left: 26px; color: #8C8C8C; }

.giay--phieu {
  width: 24%; background: #EBDDAF; padding: 30px 22px 22px; font-size: 14px;
  clip-path: polygon(0 4%, 5% 0, 10% 3%, 16% 0, 22% 4%, 28% 1%, 34% 4%, 40% 0, 47% 3%, 53% 0, 60% 4%, 66% 1%, 72% 4%, 79% 0, 85% 3%, 91% 0, 96% 4%, 100% 1%, 100% 100%, 0 100%);
}
.phieu__dau { font-weight: 500; letter-spacing: .02em; border-bottom: 1px dashed #8A7A55; padding-bottom: 6px; }
.phieu__ten { font-family: var(--font-display); font-size: 22px; margin: 8px 0 6px; }
.giay--phieu dl { margin: 0; display: grid; gap: 4px; }
.giay--phieu dl div { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px dotted #A89770; padding: 3px 0; }
.giay--phieu dd { margin: 0; font-weight: 400; }
.phieu__chan { margin-top: 12px; font-size: 12px; color: #6B5D3A; }

.giay--hong { width: 30%; background: #E7A9B3; padding: 26px 28px 30px; display: flex; flex-direction: column; gap: 10px; }
.giay--hong .giay__nho { color: #5E2A33; }
.the-hong__chu { font-family: var(--font-display); font-size: 25px; line-height: 1.2; }

.ho-so__nut { position: absolute; z-index: 20; left: 28px; right: 72px; bottom: 24px; display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end; }
.ho-so__nut button { min-height: 48px; padding: 0 22px; border-radius: var(--radius-pill); font: 500 15px var(--font-body); cursor: pointer; }
.nut-giu { background: #F2ECE4; color: #1A1411; border: 0; }
.nut-giu:hover { background: #FFFFFF; }
.nut-dong { background: transparent; color: var(--chu-bia); border: 1px solid currentColor; }
.ho-so__goi-y { position: absolute; left: 28px; bottom: 36px; font-size: 13px; opacity: .8; }

@media (max-width: 760px) {
  .nen { align-items: stretch; padding: 0; }
  .ho-so { width: 100%; height: 100%; border-radius: 0; padding: 20px 16px 96px; overflow-y: auto; }
  .ho-so__gay { display: none; }
  .giay-vung { height: auto; display: flex; flex-direction: column; gap: 22px; padding-top: 18px; }
  .giay { position: relative; left: auto; top: auto; width: auto !important; min-height: 0 !important; transform: rotate(calc(var(--r) * .5)); cursor: default; touch-action: auto; user-select: auto; }
  .giay--anh { width: 78% !important; align-self: center; }
  .giay--gioi-thieu { padding: 28px 22px 28px 48px; }
  .dau-moc { position: static; align-self: flex-end; width: 80px; height: 80px; margin-top: 4px; }
  .lo { left: 14px; }
  .ho-so__nut { position: fixed; left: 0; right: 0; bottom: 0; padding: 12px 16px calc(14px + env(safe-area-inset-bottom, 0px)); background: var(--mau); justify-content: stretch; }
  .ho-so__nut button { flex: 1; }
  .ho-so__goi-y { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .bia, .bia__tab, .bia__mo, .tu, .nen { transition: none; }
}
</style>
