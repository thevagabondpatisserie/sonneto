<template>
  <div class="man">
    <header class="thanh">
      <RouterLink to="/khoa-cua-toi" class="thanh__ve" aria-label="Về Khoá của tôi">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
      </RouterLink>
      <span class="thanh__khoa">{{ bai?.tenKhoa }}</span>
      <NhanHan v-if="bai" :so-ngay="soNgay" :het-han="bai.hetHan" />
    </header>

    <p v-if="loi" class="wrap loi">{{ loi }}</p>

    <div v-else-if="bai" class="khung">
      <div class="chinh">
        <div class="video">
          <img :src="bai.anhVideo" alt="Khung video: đổ mousse vào khuôn">
          <button type="button" class="video__phat" aria-label="Phát video">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          </button>
          <div class="video__duoi">
            <div class="thanh-tg" aria-hidden="true">
              <div class="thanh-tg__da" :style="{ width: phanTram + '%' }"></div>
              <span v-for="b in bai.cacBuoc" :key="b.phut" class="thanh-tg__moc" :style="{ left: (b.giay / tongGiay * 100) + '%' }"></span>
            </div>
            <div class="video__tg num"><span>{{ buocDang.phut }} / {{ bai.thoiLuong }}</span><span class="video__dang">{{ buocDang.viec }}</span></div>
          </div>
        </div>

        <div class="wrap tieu-de">
          <p class="muted nho">Bài {{ bai.thuTu }} trên {{ bai.tongBai }}</p>
          <h1 class="title">{{ bai.ten }}</h1>
        </div>

        <div class="wrap">
          <div class="tab" role="tablist" aria-label="Nội dung bài học">
            <button v-for="t in tabs" :key="t.ma" type="button" role="tab" :id="'tab-' + t.ma" :aria-selected="tab === t.ma" :aria-controls="'pn-' + t.ma" @click="tab = t.ma">{{ t.ten }}</button>
          </div>

          <section v-show="tab === 'cong-thuc'" id="pn-cong-thuc" role="tabpanel" aria-labelledby="tab-cong-thuc" class="pn">
            <div class="ct-dau">
              <h2 class="title-s">{{ bai.congThuc.ten }}</h2>
              <div class="nhan-me" role="group" aria-label="Nhân mẻ">
                <button v-for="h in heSoChon" :key="h.so" type="button" :aria-pressed="heSo === h.so" @click="heSo = h.so">{{ h.chu }}</button>
              </div>
            </div>
            <table class="bang">
              <caption class="sr">Nguyên liệu {{ bai.congThuc.ten }}, nhân {{ heSo }}</caption>
              <tbody>
                <tr v-for="nl in bai.congThuc.nguyenLieu" :key="nl.ten">
                  <th scope="row">{{ nl.ten }}</th>
                  <td class="num">{{ luongSauNhan(nl, heSo) }}</td>
                </tr>
              </tbody>
            </table>
            <p class="muted nho">{{ bai.congThuc.choBaoNhieu[heSo] }}</p>
          </section>

          <section v-show="tab === 'cac-buoc'" id="pn-cac-buoc" role="tabpanel" aria-labelledby="tab-cac-buoc" class="pn">
            <ol class="buoc">
              <li v-for="b in bai.cacBuoc" :key="b.phut">
                <button type="button" :aria-current="b.giay === buocDang.giay ? 'step' : null" @click="dangO = b.giay">
                  <span class="buoc__tg num">{{ b.phut }}</span><span>{{ b.viec }}</span>
                </button>
              </li>
            </ol>
          </section>

          <section v-show="tab === 'hoi'" id="pn-hoi" role="tabpanel" aria-labelledby="tab-hoi" class="pn">
            <p class="muted">Gửi ảnh mặt cắt bánh của bạn kèm câu hỏi. Giảng viên trả lời trong 24 giờ.</p>
            <label class="o-hoi" for="cau-hoi">Câu hỏi của bạn<textarea id="cau-hoi" rows="4"></textarea></label>
            <NutBam kieu="phu">Đính kèm ảnh</NutBam>
          </section>
        </div>
      </div>

      <aside class="ben" aria-label="Danh sách bài">
        <div v-for="p in bai.danhSach" :key="p.phan" class="ben__phan">
          <h2 class="ben__ten">{{ p.phan }}</h2>
          <ul>
            <li v-for="x in p.bai" :key="x.ma" :class="{ xong: x.xong, dang: x.ma === bai.ma }">
              <span class="cham" aria-hidden="true"></span>
              <span class="ben__bai">{{ x.ten }}<span class="sr">{{ x.xong ? ', đã học' : x.ma === bai.ma ? ', đang học' : '' }}</span></span>
              <span class="num muted">{{ x.thoiLuong }}</span>
            </li>
          </ul>
        </div>
        <div class="day-nut">
          <NutBam kieu="phu" href="#" @click.prevent>Tải công thức</NutBam>
          <NutBam href="#" @click.prevent>Bài tiếp theo</NutBam>
        </div>
      </aside>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NutBam from '@/components/NutBam.vue'
import NhanHan from '@/components/NhanHan.vue'
import { layBaiHoc } from '@/api.js'
import { luongSauNhan, soNgayConLai } from '@/logic.js'

const route = useRoute()
const bai = ref(null)
const loi = ref('')
const tab = ref('cong-thuc')
const heSo = ref(1)
const dangO = ref(504)
const soNgay = computed(() => (bai.value ? soNgayConLai(bai.value.hetHan, bai.value.homNay) : null))

const tabs = [
  { ma: 'cong-thuc', ten: 'Công thức' },
  { ma: 'cac-buoc', ten: 'Các bước' },
  { ma: 'hoi', ten: 'Hỏi giảng viên' },
]
const heSoChon = [{ so: 0.5, chu: '½' }, { so: 1, chu: '1×' }, { so: 2, chu: '2×' }]

const tongGiay = computed(() => {
  const [m, s] = (bai.value?.thoiLuong || '0:0').split(':').map(Number)
  return m * 60 + s
})
const buocDang = computed(() => {
  const ds = bai.value?.cacBuoc || []
  return [...ds].reverse().find((b) => b.giay <= dangO.value) || ds[0] || {}
})
const phanTram = computed(() => (tongGiay.value ? (dangO.value / tongGiay.value) * 100 : 0))

onMounted(async () => {
  try { bai.value = await layBaiHoc(route.params.khoa, route.params.bai) }
  catch (e) { loi.value = e.message }
})
</script>

<style scoped>
.man { min-height: 100vh; padding-bottom: 110px; }
.thanh { display: flex; align-items: center; gap: var(--space-2); height: 60px; padding: env(safe-area-inset-top, 0px) max(var(--space-4), env(safe-area-inset-right, 0px)) 0 max(4px, env(safe-area-inset-left, 0px)); }
.thanh__ve { width: var(--touch-min); height: var(--touch-min); display: inline-flex; align-items: center; justify-content: center; }
.thanh :deep(.nhan) { align-self: center; }
.thanh__khoa { flex: 1; min-width: 0; font-size: 14px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.khung { display: flex; flex-wrap: wrap; align-items: flex-start; }
.chinh { flex: 999 1 560px; min-width: 0; }
.ben { flex: 1 1 300px; min-width: 0; border-left: 1px solid var(--line); padding: 8px 0 32px; }

.video { position: relative; aspect-ratio: 16 / 9; max-height: 70vh; background: #000; overflow: hidden; }
.video img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 62%; opacity: .85; }
.video__phat { position: absolute; left: 50%; top: 46%; width: 64px; height: 64px; margin: -32px 0 0 -32px; border-radius: 50%; border: 1px solid rgba(242,236,228,.8); background: rgba(26,20,17,.45); color: var(--cream); display: flex; align-items: center; justify-content: center; cursor: pointer; }
.video__duoi { position: absolute; inset: auto 0 0; padding: 26px 14px 10px; background: linear-gradient(180deg, transparent, rgba(0,0,0,.75)); display: flex; flex-direction: column; gap: 8px; }
.thanh-tg { position: relative; height: 3px; background: rgba(242,236,228,.3); border-radius: 2px; }
.thanh-tg__da { position: absolute; inset: 0 auto 0 0; background: var(--raspberry); border-radius: 2px; transition: width .3s; }
.thanh-tg__moc { position: absolute; top: -3px; width: 2px; height: 9px; background: var(--cream); }
.video__tg { display: flex; justify-content: space-between; gap: 12px; font-size: 12px; }
.video__dang { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.tieu-de { padding-top: 16px; }
.tieu-de h1 { margin-top: 2px; }
.nho { font-size: 13px; }

.tab { display: flex; gap: 22px; margin-top: 10px; border-bottom: 1px solid var(--line); overflow-x: auto; }
.tab button { min-height: 48px; padding: 0; border: 0; background: transparent; font-size: 15px; color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; white-space: nowrap; }
.tab button[aria-selected="true"] { color: var(--cream); border-bottom-color: var(--raspberry); }

.pn { padding-top: 14px; display: flex; flex-direction: column; gap: 10px; max-width: 640px; }
.ct-dau { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.nhan-me { display: flex; gap: 6px; }
.nhan-me button { width: var(--touch-min); height: var(--touch-min); border-radius: var(--radius-pill); border: 1px solid var(--line-strong); background: transparent; font-size: 15px; cursor: pointer; }
.nhan-me button[aria-pressed="true"] { background: var(--cream); color: var(--chocolate-900); border-color: var(--cream); }
.bang { width: 100%; border-collapse: collapse; font-size: 15px; }
.bang th, .bang td { padding: 9px 0; border-bottom: 1px solid var(--line); text-align: left; font-weight: 300; }
.bang td { text-align: right; font-weight: 400; }

.buoc { list-style: none; margin: 0; padding: 0; }
.buoc button { display: flex; gap: 12px; width: 100%; min-height: var(--touch-min); align-items: center; padding: 8px 0; border: 0; border-bottom: 1px solid var(--line); background: transparent; text-align: left; font-size: 15px; cursor: pointer; color: #D8CFC5; }
.buoc button[aria-current="step"] { background: var(--chocolate-700); color: var(--cream); padding-inline: 12px; }
.buoc__tg { flex: 0 0 48px; color: var(--raspberry); }

.o-hoi { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--muted); }
.o-hoi textarea { background: var(--chocolate-800); border: 1px solid var(--line); border-radius: var(--radius-field); font-size: 15px; padding: 10px; }

.ben__phan { padding: 12px 22px 4px; }
.ben__ten { font-size: 13px; font-weight: 400; color: var(--muted); margin-bottom: 4px; }
.ben ul { list-style: none; margin: 0 -22px; padding: 0; }
.ben li { display: grid; grid-template-columns: 18px 1fr auto; gap: 12px; align-items: center; min-height: var(--touch-min); padding: 0 22px; font-size: 14px; color: var(--muted); }
.ben li.xong, .ben li.dang { color: var(--cream); }
.ben li.dang { background: var(--chocolate-700); }
.cham { width: 14px; height: 14px; border-radius: 50%; border: 1px solid var(--line-strong); }
.xong .cham { background: var(--raspberry); border-color: var(--raspberry); }
.dang .cham { border-color: var(--raspberry); box-shadow: inset 0 0 0 3px var(--chocolate-700), inset 0 0 0 7px var(--raspberry); }

.day-nut { position: fixed; inset: auto 0 0; z-index: 3; display: flex; gap: 10px; padding: 12px max(var(--space-4), env(safe-area-inset-right, 0px)) calc(16px + env(safe-area-inset-bottom, 0px)) max(var(--space-4), env(safe-area-inset-left, 0px)); background: linear-gradient(180deg, rgba(26,20,17,0), var(--chocolate-900) 30%); }
.day-nut :deep(.nut) { flex: 1; min-height: 50px; }
@media (min-width: 900px) { .day-nut { position: static; background: none; padding: 20px 22px 0; flex-direction: column; } .video { max-height: 58vh; aspect-ratio: auto; height: 58vh; } }
@media (max-width: 900px) { .ben { border-left: 0; border-top: 1px solid var(--line); } }

.loi { color: var(--warn-fg); padding-block: 24px; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
</style>
