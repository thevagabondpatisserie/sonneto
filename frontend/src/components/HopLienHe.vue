<template>
  <dialog ref="hop" class="hop" aria-labelledby="lh-tieu-de" @close="emit('dong')" @click.self="dong">
    <button type="button" class="dong" aria-label="Đóng" @click="dong">×</button>
    <p class="eyebrow">ĐỂ LẠI SỐ CHO SONNETO</p>
    <h2 id="lh-tieu-de">{{ tieuDe }}</h2>
    <form @submit.prevent="gui" novalidate>
      <fieldset class="chon">
        <legend>Anh chị quan tâm</legend>
        <label :class="{ dang: form.can === 'khoa' }"><input v-model="form.can" type="radio" value="khoa">Khoá học</label>
        <label :class="{ dang: form.can === 'quan' }"><input v-model="form.can" type="radio" value="quan">Làm bánh cho quán</label>
      </fieldset>
      <label class="o">Tên<input v-model.trim="form.ten" autocomplete="name"></label>
      <label class="o">Điện thoại hoặc Zalo<input ref="oSdt" v-model.trim="form.sdt" type="tel" inputmode="tel" autocomplete="tel" :aria-invalid="loiSdt ? 'true' : 'false'" aria-describedby="lh-trang-thai"></label>
      <label class="o">Vài dòng về việc anh chị cần<textarea v-model.trim="form.loiNhan" rows="3"></textarea></label>
      <button class="gui" type="submit" :disabled="dangGui">{{ dangGui ? 'Đang gửi…' : 'Gửi cho Sonneto ↗' }}</button>
      <p id="lh-trang-thai" class="trang-thai" role="status" aria-live="polite">{{ trangThai }}</p>
    </form>
  </dialog>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'

const props = defineProps({
  mo: { type: Boolean, default: false },
  can: { type: String, default: 'khoa' },
  loiNhan: { type: String, default: '' },
  tieuDe: { type: String, default: 'Sonneto gọi lại trong ngày.' },
})
const emit = defineEmits(['dong'])

const hop = ref(null)
const oSdt = ref(null)
const form = reactive({ can: 'khoa', ten: '', sdt: '', loiNhan: '' })
const loiSdt = ref(false)
const dangGui = ref(false)
const trangThai = ref('')

watch(() => props.mo, async (mo) => {
  await nextTick()
  const el = hop.value
  if (!el) return
  if (mo && !el.open) {
    Object.assign(form, { can: props.can, loiNhan: props.loiNhan })
    trangThai.value = ''
    loiSdt.value = false
    el.showModal()
  } else if (!mo && el.open) el.close()
}, { immediate: true })

function dong() { hop.value?.close() }

async function gui() {
  const so = form.sdt.replace(/[^\d+]/g, '')
  loiSdt.value = so.replace('+', '').length < 9
  if (loiSdt.value) {
    trangThai.value = 'Anh chị cho xin số điện thoại hoặc Zalo để Sonneto gọi lại.'
    oSdt.value?.focus()
    return
  }
  if (import.meta.env.MODE === 'preview') {
    trangThai.value = 'Đây là bản xem thử nên yêu cầu chưa được gửi đi.'
    return
  }
  dangGui.value = true
  trangThai.value = ''
  try {
    const res = await fetch('/api/method/sonneto.api.gui_yeu_cau', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ can: form.can, ten: form.ten, sdt: so, loi_nhan: form.loiNhan }),
    })
    if (!res.ok) throw new Error()
    trangThai.value = 'Đã nhận. Sonneto sẽ gọi lại trong ngày.'
    Object.assign(form, { ten: '', sdt: '', loiNhan: '' })
  } catch {
    trangThai.value = 'Chưa gửi được. Anh chị thử lại, hoặc nhắn Zalo cho Sonneto.'
  } finally {
    dangGui.value = false
  }
}
</script>

<style scoped>
.hop { background: #f1eddf; color: #25251f; border: 0; padding: 44px 48px 36px; max-width: 480px; width: calc(100% - 32px); font: 12px/1.6 'Be Vietnam Pro', sans-serif; }
.hop::backdrop { background: #0009; backdrop-filter: blur(5px); }
.dong { position: absolute; right: 12px; top: 8px; font-size: 26px; min-width: 44px; min-height: 44px; background: none; border: 0; color: inherit; cursor: pointer; }
.eyebrow { font-size: 9px; letter-spacing: 1.4px; color: #77776d; margin: 0 0 12px; }
h2 { font: 400 32px/1.2 'Playfair Display', Georgia, serif; margin: 0 0 22px; }
form { display: grid; gap: 16px; }
.chon { border: 0; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.chon legend { font-size: 10px; color: #77776d; margin-bottom: 8px; padding: 0; }
.chon label { border: 1px solid #25251f55; border-radius: 30px; padding: 10px 16px; cursor: pointer; min-height: 44px; display: inline-flex; align-items: center; }
.chon label.dang { background: #25251f; color: #f1eddf; border-color: #25251f; }
.chon input { position: absolute; opacity: 0; pointer-events: none; }
.chon label:has(input:focus-visible) { outline: 2px solid #2251df; outline-offset: 3px; }
.o { display: grid; gap: 4px; font-size: 10px; color: #55554b; }
.o input, .o textarea { font: 16px 'Be Vietnam Pro', sans-serif; color: #25251f; background: none; border: 0; border-bottom: 1px solid #25251f66; padding: 8px 0; border-radius: 0; resize: vertical; }
.o input:focus, .o textarea:focus { outline: none; border-bottom-color: #2251df; }
.o input[aria-invalid="true"] { border-bottom-color: #c0392b; }
.gui { background: #2251df; color: #fff; border: 0; padding: 15px 20px; min-height: 48px; font: 13px 'Be Vietnam Pro', sans-serif; cursor: pointer; justify-self: start; }
.gui:disabled { opacity: .6; cursor: default; }
.trang-thai { min-height: 1.6em; margin: 0; font-size: 12px; }
@media (max-width: 700px) { .hop { padding: 40px 22px 28px; } h2 { font-size: 27px; } }
</style>
