import { createApp, nextTick } from 'vue'
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import TrangChu from './pages/TrangChu.vue'
import BaiHoc from './pages/BaiHoc.vue'
import KhoaCuaToi from './pages/KhoaCuaToi.vue'
import './styles/tokens.css'
import './styles/base.css'

const router = createRouter({
  // Xem thử ngoài Frappe dùng #, site thật dùng đường dẫn sạch.
  history: import.meta.env.MODE === 'preview' ? createWebHashHistory() : createWebHistory('/'),
  routes: [
    { path: '/', component: TrangChu },
    { path: '/khoa/:ma', component: TrangChu },
    { path: '/khoa-cua-toi', component: KhoaCuaToi, meta: { app: true } },
    { path: '/hoc/:khoa/:bai', component: BaiHoc, meta: { app: true } },
  ],
  scrollBehavior(to, from, daLuu) {
    if (dangChuyenCanh) return false // chuyển cảnh tự cuộn trước khi chụp trạng thái mới
    if (daLuu) return daLuu
    if (to.hash && !to.hash.startsWith('#/')) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

/* Chuyển cảnh giữa tủ (/) và trang giấy (/khoa/<mã>): dải màu của ngăn nở thành tấm bảng và ngược lại.
   Dùng View Transitions của trình duyệt; không hỗ trợ hoặc khách bật giảm chuyển động thì chuyển thẳng. */
let dangChuyenCanh = false
let xongCapNhat = null
let cuonTu = 0
const laTu = (r) => r.matched[0]?.components?.default === TrangChu
const nganCua = (ma) => (ma ? document.querySelector(`.folder[data-ma="${CSS.escape(String(ma))}"]`) : null)
function coChuyenCanh(to, from) {
  return !!document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches &&
    from.matched.length > 0 && laTu(to) && laTu(from) && to.path !== from.path
}
router.beforeResolve((to, from) => {
  if (!coChuyenCanh(to, from)) return
  if (!from.params.ma) cuonTu = window.scrollY
  const ngan = nganCua(to.params.ma)
  if (!from.params.ma && ngan) ngan.style.viewTransitionName = 'bang'
  dangChuyenCanh = true
  return new Promise((tiep) => {
    const vt = document.startViewTransition(() => new Promise((xong) => { xongCapNhat = xong; tiep() }))
    vt.finished.finally(() => {
      dangChuyenCanh = false
      document.querySelectorAll('.folder').forEach((e) => { e.style.viewTransitionName = '' })
    })
  })
})
router.afterEach(async (to, from) => {
  if (!xongCapNhat) return
  await nextTick()
  if (to.params.ma) window.scrollTo(0, 0)
  else {
    window.scrollTo(0, cuonTu)
    const ngan = nganCua(from.params.ma)
    if (ngan) ngan.style.viewTransitionName = 'bang'
  }
  const xong = xongCapNhat
  xongCapNhat = null
  xong()
})

createApp(App).use(router).mount('#app')
