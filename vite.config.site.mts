import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { componentApiPlugin } from './site/build/component-api-plugin'

export default defineConfig({
  base: '/yiz-ui/',
  resolve: {
    alias: [
      {
        find: 'yiz-ui',
        replacement: path.resolve(__dirname, './scripts'),
      },
    ],
  },
  plugins: [componentApiPlugin(), vue()],
  build: {
    outDir: 'docs',
  },
})
