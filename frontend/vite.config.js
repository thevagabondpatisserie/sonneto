import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// Hai chế độ build:
// - mặc định: build cho app Frappe. Tệp tĩnh vào sonneto/public/frontend,
//   trang vào sonneto/www/sonneto.html, phục vụ ở mọi đường dẫn của site Sonneto.
// - preview: một thư mục tự đủ (dist-preview) dùng dữ liệu mẫu, để xem thử ngoài Frappe.
export default defineConfig(({ mode }) => {
  const preview = mode === 'preview'
  return {
    plugins: [vue()],
    base: preview ? './' : '/assets/sonneto/frontend/',
    resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
    build: preview
      ? { outDir: 'dist-preview', emptyOutDir: true }
      : {
          outDir: '../sonneto/public/frontend',
          emptyOutDir: true,
          rollupOptions: { input: path.resolve(__dirname, 'index.html') },
        },
  }
})
