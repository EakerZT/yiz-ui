import type { App, Component } from 'vue'

import * as components from './components'

export * from './components'
export * from './notification'

const install = (app: App): void => {
  for (const [key, component] of Object.entries(components)) {
    app.component('Y' + key, component as Component)
  }
}

export default { install }
