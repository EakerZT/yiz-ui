import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import ValueFormatDemo from './ValueFormatDemo.vue'
import valueFormatDemoSource from './ValueFormatDemo.vue?raw'
import RequiredRangeDemo from './RequiredRangeDemo.vue'
import requiredRangeDemoSource from './RequiredRangeDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  {
    id: 'ValueFormatDemo',
    titleKey: 'demo.dateRangePicker.valueFormat',
    component: ValueFormatDemo,
    source: valueFormatDemoSource,
  },
  {
    id: 'RequiredRangeDemo',
    titleKey: 'demo.dateRangePicker.requiredRange',
    component: RequiredRangeDemo,
    source: requiredRangeDemoSource,
  },
]

export const apiComponents = ['DateTimeRangePicker']
