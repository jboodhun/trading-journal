import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      app: fileURLToPath(new URL('./src/app', import.meta.url)),
      components: fileURLToPath(new URL('./src/components', import.meta.url)),
      data: fileURLToPath(new URL('./src/data', import.meta.url)),
      hooks: fileURLToPath(new URL('./src/hooks', import.meta.url)),
      layouts: fileURLToPath(new URL('./src/layouts', import.meta.url)),
      pages: fileURLToPath(new URL('./src/pages', import.meta.url)),
      services: fileURLToPath(new URL('./src/services', import.meta.url)),
      styles: fileURLToPath(new URL('./src/styles', import.meta.url)),
    },
  },
})
