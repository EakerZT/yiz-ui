import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'scripts/index.ts'),
      name: 'YizUI',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'yiz-ui.mjs' : 'yiz-ui.cjs'),
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
