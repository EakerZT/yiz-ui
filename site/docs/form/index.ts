import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import TopLabelDemo from './TopLabelDemo.vue'
import topLabelDemoSource from './TopLabelDemo.vue?raw'
import LayoutDemo from './LayoutDemo.vue'
import layoutDemoSource from './LayoutDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicDemoSource },
  { id: 'TopLabelDemo', titleKey: 'demo.form.topLabel', component: TopLabelDemo, source: topLabelDemoSource },
  { id: 'LayoutDemo', titleKey: 'demo.form.layout', component: LayoutDemo, source: layoutDemoSource },
]

export const apiComponents = ['Form', 'FormItem']
