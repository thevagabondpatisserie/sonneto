// Cuộn tới một mục trong trang mà không đổi dấu # (chế độ xem thử dùng # cho đường dẫn).
export function cuonToi(id) {
  const el = document.getElementById(id)
  if (!el) return
  const giam = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: giam ? 'auto' : 'smooth', block: 'start' })
  const dich = el.querySelector('h2, input, a, button')
  if (dich) dich.focus({ preventScroll: true })
}
