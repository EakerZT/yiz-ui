import { h, type VNode } from 'vue'

export interface RenderSvgIconOptions {
  size?: number | string
}

export function renderSvgIcon(svg: string, options: RenderSvgIconOptions = {}): VNode {
  const style: Record<string, string> = {
    width: '1em',
    height: '1em',
    'line-height': '1em',
  }
  if (options.size != null) {
    style['font-size'] = typeof options.size === 'number' ? `${options.size}px` : options.size
  }
  return h('span', {
    class: 'yiz-icon',
    style,
    innerHTML: svg,
  })
}
