import type { App, Component } from 'vue'

import './style.less'
import './global-components'

import * as components from './components'
import './input-style.less'

export * from './components'
export * from './emitter'
export * from './locale'
export * from './theme'
export * from './message'
export * from './notification'
export type { InputStyleMode } from './input-style'
export { useModalLayer, useModalLayerManager } from './overlay/modalLayer'
export type { ModalLayer, ModalLayerManager } from './overlay/modalLayer'
export {
  useContextMenu,
  type ContextMenuApi,
  type ContextMenuHandle,
  type ContextMenuItem,
  type ContextMenuOptions,
} from './context-menu'
export { renderSvg } from './icon/renderSvg'
export { renderSvgIcon, type RenderSvgIconOptions } from './icon/renderSvgIcon'
export { useImageViewer } from './image-viewer'
export type { ImageViewerApi, ImageViewerHandle, ImageViewerItem, ImageViewerOptions } from './image-viewer'
export { loadingBar } from './loading-bar'
export type { LoadingBarOptions, LoadingBarDirection, LoadingBarPositionUsing } from './loading-bar'

const componentAliases: Record<string, string[]> = {
  DateTimePicker: ['y-datetime-picker'],
  DateTimeRangePicker: ['y-datetime-range-picker'],
}

const install = (app: App): void => {
  for (const [key, component] of Object.entries(components)) {
    app.component('Y' + key, component as Component)
    componentAliases[key]?.forEach((name) => app.component(name, component as Component))
  }
}

export default { install }
