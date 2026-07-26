import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import ValueFormatDemo from './ValueFormatDemo.vue'
import valueFormatDemoSource from './ValueFormatDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  {
    id: 'ValueFormatDemo',
    titleKey: 'demo.datePicker.valueFormat',
    component: ValueFormatDemo,
    source: valueFormatDemoSource,
  },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
]

export const apiComponents = ['DateTimePicker']
