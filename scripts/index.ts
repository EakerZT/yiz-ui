import type { App, Component } from 'vue'

import './style.less'
import './global-components'

import * as components from './components'

export * from './components'
export * from './locale'
export * from './notification'
export { showContextMenu } from './context-menu'
export { renderSvg } from './icon/renderSvg'

const install = (app: App): void => {
  for (const [key, component] of Object.entries(components)) {
    app.component('Y' + key, component as Component)
  }
}

export default { install }
