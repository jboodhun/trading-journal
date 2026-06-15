import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const src = (dir: string) => fileURLToPath(new URL(`./src/${dir}`, import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      components: src('components'),
      hooks: src('hooks'),
      services: src('services'),
      store: src('store'),
      lib: src('lib'),
      types: src('types'),
      pages: src('pages'),
    },
  },
  server: {
    port: 5188,
    proxy: {
      '/api': 'http://localhost:3017',
    },
  },
})
