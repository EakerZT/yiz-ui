import path from 'node:path'
import type { Plugin } from 'vite'
import { generateComponentApi } from './generate-component-api.mjs'
import { generateDemoSources } from './generate-demo-sources.mjs'

export function componentApiPlugin(): Plugin {
  const componentRoot = path.resolve(import.meta.dirname, '../../scripts')
  const pageRoot = path.resolve(import.meta.dirname, '../pages')

  return {
    name: 'yiz-component-api',
    buildStart() {
      generateComponentApi()
      generateDemoSources()
    },
    handleHotUpdate({ file, server }) {
      if (!file.endsWith('.vue')) return
      if (file.startsWith(componentRoot)) generateComponentApi()
      if (file.startsWith(pageRoot)) generateDemoSources()
      if (!file.startsWith(componentRoot) && !file.startsWith(pageRoot)) return
      server.ws.send({ type: 'full-reload' })
    },
  }
}
