<template>
  <RouterLink v-if="to" :to="to" :class="cls"><slot /></RouterLink>
  <a v-else-if="href" :href="href" :class="cls"><slot /></a>
  <button v-else :type="type" :class="cls" :disabled="disabled"><slot /></button>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  kieu: { type: String, default: 'chinh' }, // chinh | phu | giahan | toi
  to: [String, Object],
  href: String,
  type: { type: String, default: 'button' },
  disabled: Boolean,
  rong: Boolean,
})
const cls = computed(() => ['nut', `nut--${props.kieu}`, props.rong && 'nut--rong'])
</script>

<style scoped>
.nut {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: var(--button-h); padding: 0 26px;
  border-radius: var(--radius-pill); border: 1px solid transparent;
  font: 500 15px/1.2 var(--font-body); text-decoration: none; cursor: pointer;
  transition: background .2s, color .2s, border-color .2s;
}
.nut--chinh { background: var(--cream); color: var(--chocolate-900); }
.nut--chinh:hover { background: var(--raspberry); color: var(--chocolate-900); }
.nut--phu { background: transparent; color: var(--cream); border-color: var(--muted); font-weight: 400; }
.nut--phu:hover { border-color: var(--raspberry); color: var(--raspberry); }
.nut--giahan { background: var(--raspberry); color: var(--chocolate-900); }
.nut--toi { background: var(--chocolate-900); color: var(--cream); }
.nut--toi:hover { background: var(--chocolate-700); color: var(--cream); }
.nut--rong { width: 100%; min-height: 48px; }
.nut:disabled { opacity: .5; cursor: default; }
</style>
