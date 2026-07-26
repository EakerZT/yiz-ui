import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import StatusDemo from './StatusDemo.vue'
import statusDemoSource from './StatusDemo.vue?raw'
import AlternateDemo from './AlternateDemo.vue'
import alternateDemoSource from './AlternateDemo.vue?raw'
import CustomSlotDemo from './CustomSlotDemo.vue'
import customSlotDemoSource from './CustomSlotDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'StatusDemo', titleKey: 'demo.common.status', component: StatusDemo, source: statusDemoSource },
  { id: 'AlternateDemo', titleKey: 'demo.timeline.alternate', component: AlternateDemo, source: alternateDemoSource },
  { id: 'CustomSlotDemo', titleKey: 'demo.common.customSlot', component: CustomSlotDemo, source: customSlotDemoSource },
]

export const apiComponents = ['Timeline', 'TimelineItem']
