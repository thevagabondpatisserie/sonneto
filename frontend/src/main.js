import { createApp } from 'vue'
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
  scrollBehavior(to) {
    if (to.hash && !to.hash.startsWith('#/')) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

createApp(App).use(router).mount('#app')
