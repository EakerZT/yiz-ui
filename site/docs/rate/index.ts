import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import HalfDemo from './HalfDemo.vue'
import halfDemoSource from './HalfDemo.vue?raw'
import TextDemo from './TextDemo.vue'
import textDemoSource from './TextDemo.vue?raw'
import CustomDemo from './CustomDemo.vue'
import customDemoSource from './CustomDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'HalfDemo', titleKey: 'demo.rate.half', component: HalfDemo, source: halfDemoSource },
  { id: 'TextDemo', titleKey: 'demo.rate.text', component: TextDemo, source: textDemoSource },
  { id: 'CustomDemo', titleKey: 'demo.common.customContent', component: CustomDemo, source: customDemoSource },
]

export const apiComponents = ['Rate']
