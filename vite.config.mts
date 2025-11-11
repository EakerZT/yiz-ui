import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
    resolve: {
        // In production site build, we want to import naive-ui from node_modules
        alias:
            process.env.NODE_ENV !== 'production'
                ? [
                    {
                        find: 'yiz-ui',
                        replacement: path.resolve(__dirname, './scripts')
                    }
                ]
                : undefined
    },
    plugins: [vue()],
})