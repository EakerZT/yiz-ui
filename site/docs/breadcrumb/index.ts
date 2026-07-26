import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import CustomContentDemo from './CustomContentDemo.vue'
import customContentDemoSource from './CustomContentDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledDemoSource from './DisabledDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicDemoSource },
  {
    id: 'CustomContentDemo',
    titleKey: 'demo.common.customContent',
    component: CustomContentDemo,
    source: customContentDemoSource,
  },
  { id: 'DisabledDemo', titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledDemoSource },
]

export const apiComponents = ['Breadcrumb', 'BreadcrumbItem']
