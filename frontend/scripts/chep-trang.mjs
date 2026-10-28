// Sau khi build: đưa trang index.html vào sonneto/www/sonneto.html để Frappe phục vụ ở "/".
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const goc = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
mkdirSync(resolve(goc, 'sonneto/www'), { recursive: true })
copyFileSync(resolve(goc, 'sonneto/public/frontend/index.html'), resolve(goc, 'sonneto/www/sonneto.html'))
console.log('Đã chép trang vào sonneto/www/sonneto.html')
