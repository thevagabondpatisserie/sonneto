<template>
  <span :class="['nhan', `nhan--${trangThai}`]">{{ chu }}</span>
</template>

<script setup>
import { computed } from 'vue'
import { trangThaiHan, ngayViet } from '@/logic.js'
const props = defineProps({ soNgay: Number, hetHan: String })
const trangThai = computed(() => trangThaiHan(props.soNgay))
const chu = computed(() =>
  trangThai.value === 'het' ? `Hết hạn ngày ${ngayViet(props.hetHan)}` : `Còn ${props.soNgay} ngày`
)
</script>

<style scoped>
.nhan { display: inline-flex; align-self: flex-start; align-items: center; font-size: 13px; line-height: 1.4; padding: 2px 10px; border-radius: var(--radius-pill); border: 1px solid transparent; }
.nhan--con { background: var(--chocolate-700); color: var(--cream); }
.nhan--sap { background: var(--warn-bg); color: var(--warn-fg); }
.nhan--het { border-color: var(--muted); color: var(--cream); }
</style>
