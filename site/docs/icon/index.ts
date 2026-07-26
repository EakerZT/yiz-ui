import type { DemoDefinition } from '../types'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'
import RenderSvgDemo from './RenderSvgDemo.vue'
import renderSvgDemoSource from './RenderSvgDemo.vue?raw'
import RenderSvgIconDemo from './RenderSvgIconDemo.vue'
import renderSvgIconDemoSource from './RenderSvgIconDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
  { id: 'RenderSvgDemo', titleKey: 'demo.icon.renderSvg', component: RenderSvgDemo, source: renderSvgDemoSource },
  {
    id: 'RenderSvgIconDemo',
    titleKey: 'demo.icon.renderSvgIcon',
    component: RenderSvgIconDemo,
    source: renderSvgIconDemoSource,
  },
]

export const apiComponents = ['Icon']
