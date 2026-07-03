import { h, type VNode } from 'vue'

export function renderSvg(svg: string): VNode {
  return h('span', {
    class: 'yiz-render-svg',
    innerHTML: svg,
  })
}
