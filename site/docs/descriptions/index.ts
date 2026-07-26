import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import WithBorderDemo from './WithBorderDemo.vue'
import withBorderDemoSource from './WithBorderDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'
import VerticalDemo from './VerticalDemo.vue'
import verticalDemoSource from './VerticalDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicDemoSource },
  { id: 'WithBorderDemo', titleKey: 'demo.common.withBorder', component: WithBorderDemo, source: withBorderDemoSource },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
  { id: 'VerticalDemo', titleKey: 'demo.descriptions.vertical', component: VerticalDemo, source: verticalDemoSource },
]

export const apiComponents = ['Descriptions', 'DescriptionItem']
