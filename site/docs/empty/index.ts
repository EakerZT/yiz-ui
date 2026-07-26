import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import CustomDescDemo from './CustomDescDemo.vue'
import customDescDemoSource from './CustomDescDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'
import CustomImageDemo from './CustomImageDemo.vue'
import customImageDemoSource from './CustomImageDemo.vue?raw'
import WithActionDemo from './WithActionDemo.vue'
import withActionDemoSource from './WithActionDemo.vue?raw'
import TableEmptyDemo from './TableEmptyDemo.vue'
import tableEmptyDemoSource from './TableEmptyDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'CustomDescDemo', titleKey: 'demo.common.customDesc', component: CustomDescDemo, source: customDescDemoSource },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
  {
    id: 'CustomImageDemo',
    titleKey: 'demo.common.customImage',
    component: CustomImageDemo,
    source: customImageDemoSource,
  },
  { id: 'WithActionDemo', titleKey: 'demo.empty.withAction', component: WithActionDemo, source: withActionDemoSource },
  { id: 'TableEmptyDemo', titleKey: 'demo.empty.tableEmpty', component: TableEmptyDemo, source: tableEmptyDemoSource },
]

export const apiComponents = ['Empty']
