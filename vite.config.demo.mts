import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  base: '/yiz-ui/',
  resolve: {
    alias: [
      {
        find: 'yiz-ui',
        replacement: path.resolve(__dirname, './scripts')
      }
    ]
  },
  plugins: [vue()],
  build: {
    outDir: 'site'
  }
})
