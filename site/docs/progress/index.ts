import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import DynamicDemo from './DynamicDemo.vue'
import dynamicDemoSource from './DynamicDemo.vue?raw'
import StatusDemo from './StatusDemo.vue'
import statusDemoSource from './StatusDemo.vue?raw'
import CustomColorDemo from './CustomColorDemo.vue'
import customColorDemoSource from './CustomColorDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'DynamicDemo', titleKey: 'demo.progress.dynamic', component: DynamicDemo, source: dynamicDemoSource },
  { id: 'StatusDemo', titleKey: 'demo.progress.status', component: StatusDemo, source: statusDemoSource },
  {
    id: 'CustomColorDemo',
    titleKey: 'demo.common.customColor',
    component: CustomColorDemo,
    source: customColorDemoSource,
  },
]

export const apiComponents = ['Progress']
