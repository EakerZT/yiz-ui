import path from 'node:path'
import { normalizePath, type Plugin } from 'vite'
import { generateComponentApi } from './generate-component-api.mjs'

export function componentApiPlugin(): Plugin {
  const componentRoot = normalizePath(path.resolve(import.meta.dirname, '../../scripts'))
  const componentManifest = `${componentRoot}/components.ts`

  return {
    name: 'yiz-component-api',
    buildStart() {
      generateComponentApi()
    },
    handleHotUpdate({ file, server }) {
      const normalizedFile = normalizePath(file)
      const isComponentVue = normalizedFile.startsWith(`${componentRoot}/`) && normalizedFile.endsWith('.vue')
      const isComponentIndex = normalizedFile.startsWith(`${componentRoot}/`) && normalizedFile.endsWith('/index.ts')
      if (!isComponentVue && !isComponentIndex && normalizedFile !== componentManifest) return
      generateComponentApi()
      server.ws.send({ type: 'full-reload' })
    },
  }
}
