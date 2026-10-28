<template>
  <a class="the" href="#lien-he" @click.prevent="cuonToi('lien-he')">
    <img :src="khoa.anh" :alt="khoa.anhMoTa" loading="lazy" width="600" height="750">
    <span class="the__meta">{{ meta }}</span>
    <span class="the__ten">{{ khoa.ten }}</span>
    <span class="the__mota">{{ khoa.moTa }}</span>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import { cuonToi } from '@/cuon.js'
const props = defineProps({ khoa: { type: Object, required: true } })
const meta = computed(() => {
  const k = props.khoa
  return k.soBai ? `${k.hinhThuc}, ${k.soBai} bài` : `${k.hinhThuc}, ${k.thoiLuong}`
})
</script>

<style scoped>
.the { flex: 1 1 260px; min-width: 0; display: flex; flex-direction: column; gap: 14px; text-decoration: none; color: var(--cream); }
.the img { width: 100%; height: auto; aspect-ratio: 4 / 5; object-fit: cover; border-radius: var(--radius-photo); }
.the__meta { font-size: 14px; color: var(--muted); }
.the__ten { font-family: var(--font-display); font-size: 30px; line-height: 1.1; transition: color .2s; }
.the:hover .the__ten { color: var(--raspberry); }
.the__mota { font-size: 15px; line-height: 1.55; color: var(--muted); }
</style>
