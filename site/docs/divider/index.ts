import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import WithTextDemo from './WithTextDemo.vue'
import withTextDemoSource from './WithTextDemo.vue?raw'
import DashedDemo from './DashedDemo.vue'
import dashedDemoSource from './DashedDemo.vue?raw'
import VerticalDemo from './VerticalDemo.vue'
import verticalDemoSource from './VerticalDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicDemoSource },
  { id: 'WithTextDemo', titleKey: 'demo.divider.withText', component: WithTextDemo, source: withTextDemoSource },
  { id: 'DashedDemo', titleKey: 'demo.divider.dashed', component: DashedDemo, source: dashedDemoSource },
  { id: 'VerticalDemo', titleKey: 'demo.divider.vertical', component: VerticalDemo, source: verticalDemoSource },
]

export const apiComponents = ['Divider']
