import { h, type VNode } from 'vue'
import { normalizeIconSize } from './normalizeIconSize'

export interface RenderSvgIconOptions {
  size?: number | string
}

export function renderSvgIcon(svg: string, options: RenderSvgIconOptions = {}): VNode {
  const style: Record<string, string> = {
    width: '1em',
    height: '1em',
    'line-height': '1em',
  }
  const size = normalizeIconSize(options.size)
  if (size) {
    style['font-size'] = size
  }
  return h('span', {
    class: 'yiz-icon',
    style,
    innerHTML: svg,
  })
}
