import type { App, Component } from 'vue'

import './style.less'
import './global-components'

import * as components from './components'

export * from './components'
export * from './locale'
export * from './notification'
export { showContextMenu } from './context-menu'
export { renderSvg } from './icon/renderSvg'
export { loadingBar } from './loading-bar'
export type { LoadingBarOptions, LoadingBarDirection, LoadingBarPositionUsing } from './loading-bar'

const componentAliases: Record<string, string[]> = {
  DateTimePicker: ['y-datetime-picker'],
  DateTimeRangePicker: ['y-datetime-range-picker']
}

const install = (app: App): void => {
  for (const [key, component] of Object.entries(components)) {
    app.component('Y' + key, component as Component)
    componentAliases[key]?.forEach((name) => app.component(name, component as Component))
  }
}

export default { install }
